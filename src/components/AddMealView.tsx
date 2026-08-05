import React, { useState, useRef } from "react";
import { MealLog, FrequentMeal, MealType, ActivePage, MealEstimate } from "../types";
import { ArrowRight, Check, Edit3, Sparkles, RefreshCw, X, ArrowLeft, Camera, Upload, Image as ImageIcon, Trash2 } from "lucide-react";

interface AddMealViewProps {
  onSaveMeal: (newMeal: Omit<MealLog, "id">) => void;
  onSaveFrequentMeal: (newFreq: Omit<FrequentMeal, "id">) => void;
  setActivePage: (page: ActivePage) => void;
}

export const AddMealView: React.FC<AddMealViewProps> = ({
  onSaveMeal,
  onSaveFrequentMeal,
  setActivePage,
}) => {
  const [promptInput, setPromptInput] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEstimating, setIsEstimating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera capture modal state
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Result state
  const [estimateResult, setEstimateResult] = useState<MealEstimate | null>(null);
  const [editedMealName, setEditedMealName] = useState<string>("");
  const [editedCalories, setEditedCalories] = useState<number>(0);
  const [editedMealType, setEditedMealType] = useState<MealType>("Lunch");
  const [isEditingCalories, setIsEditingCalories] = useState<boolean>(false);

  // Frequent meal prompt post-save
  const [savedMealForFrequent, setSavedMealForFrequent] = useState<{
    mealName: string;
    calories: number;
    mealType: MealType;
  } | null>(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera permission denied or camera unavailable. Try uploading a photo instead.");
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Snap photo from video feed
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEstimateWithGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() && !selectedImage) return;

    setIsEstimating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/estimate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          image: selectedImage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reach estimation server.");
      }

      const data: MealEstimate = await res.json();
      setEstimateResult(data);
      setEditedMealName(data.meal_name);
      setEditedCalories(data.estimated_calories);
      setEditedMealType(data.meal_type || "Lunch");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Could not fetch AI estimate. Using fallback entry.");
      setEstimateResult({
        meal_name: promptInput.trim() || "Meal Photo",
        estimated_calories: 450,
        meal_type: "Lunch",
        confidence_note: "Fallback estimate",
      });
      setEditedMealName(promptInput.trim() || "Meal Photo");
      setEditedCalories(450);
      setEditedMealType("Lunch");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSaveMealConfirmed = () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    onSaveMeal({
      userId: "user_default",
      mealName: editedMealName || "Custom Meal",
      calories: Math.max(0, Number(editedCalories)),
      mealType: editedMealType,
      date: todayStr,
      time: timeStr,
      isAiEstimated: !!estimateResult,
      confidenceNote: estimateResult?.confidence_note,
    });

    setSavedMealForFrequent({
      mealName: editedMealName || "Custom Meal",
      calories: Math.max(0, Number(editedCalories)),
      mealType: editedMealType,
    });
  };

  const handleConfirmFrequentSave = (saveIt: boolean) => {
    if (saveIt && savedMealForFrequent) {
      onSaveFrequentMeal({
        userId: "user_default",
        mealName: savedMealForFrequent.mealName,
        calories: savedMealForFrequent.calories,
        mealType: savedMealForFrequent.mealType,
        isFavorite: true,
      });
    }
    setSavedMealForFrequent(null);
    setActivePage("home");
  };

  return (
    <div className="px-6 md:px-12 max-w-4xl mx-auto py-12 space-y-12 animate-fade-in select-none">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePage("home")}
            className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1 hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
            Gemini Multimodal AI
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
          Add Meal
        </h1>

        <p className="text-base sm:text-lg font-bold text-black/70 leading-snug">
          Snap a food photo or describe your meal in plain words. Gemini Vision will analyze portion sizes and calculate calories.
        </p>
      </div>

      {/* Input Form */}
      {!estimateResult && (
        <form onSubmit={handleEstimateWithGemini} className="space-y-8">
          {/* PHOTO SELECTION BLOCK */}
          <div className="p-8 bg-neutral-50 border border-black space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                  Option 1
                </span>
                <h3 className="text-lg font-black uppercase text-black mt-1 font-sans-custom">
                  Food Photo Analysis
                </h3>
              </div>
              <span className="text-xs font-extrabold text-black/50">Camera / Upload</span>
            </div>

            {selectedImage ? (
              <div className="relative border-2 border-black bg-white p-3 flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={selectedImage}
                  alt="Meal Preview"
                  className="w-full sm:w-48 h-48 object-cover border border-black"
                />
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      Photo Attached &amp; Ready
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black/60">
                    Gemini Vision will identify dish ingredients, portion volume, and calculate calories from this photo.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 border border-black text-xs font-black uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Take Photo Button */}
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-6 bg-white border border-black hover:bg-black hover:text-white text-black transition-all flex flex-col items-center justify-center gap-3 group text-center"
                >
                  <div className="w-12 h-12 rounded-full border border-black group-hover:border-white flex items-center justify-center transition-colors">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-wider block">
                      Click Meal Photo
                    </span>
                    <span className="text-[11px] font-bold text-black/50 group-hover:text-white/70 block">
                      Use Device Camera
                    </span>
                  </div>
                </button>

                {/* Upload Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 bg-white border border-black hover:bg-black hover:text-white text-black transition-all flex flex-col items-center justify-center gap-3 group text-center"
                >
                  <div className="w-12 h-12 rounded-full border border-black group-hover:border-white flex items-center justify-center transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-wider block">
                      Upload Image File
                    </span>
                    <span className="text-[11px] font-bold text-black/50 group-hover:text-white/70 block">
                      Select JPG, PNG, WEBP
                    </span>
                  </div>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* TEXT DESCRIPTION BLOCK */}
          <div className="p-8 bg-neutral-50 border border-black space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                  Option 2
                </span>
                <h3 className="text-lg font-black uppercase text-black mt-1 font-sans-custom">
                  Text Description / Notes
                </h3>
              </div>
              <span className="text-xs font-extrabold text-black/50">
                {selectedImage ? "Optional Details" : "Required if no photo"}
              </span>
            </div>

            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={
                selectedImage
                  ? "Add optional notes e.g., '1 tbsp extra butter, cooked in olive oil'..."
                  : "Example: Two rotis, one bowl of dal, and a small bowl of rice."
              }
              className="w-full bg-white border border-black/20 p-4 text-base font-bold text-black focus:outline-none focus:border-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isEstimating || (!promptInput.trim() && !selectedImage)}
            className="w-full py-5 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
          >
            {isEstimating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing {selectedImage ? "Photo & Meal" : "Description"} with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Estimate Calories with Gemini AI</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* LIVE CAMERA CAPTURE MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-black max-w-lg w-full border-2 border-black p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-black" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Live Food Camera
                </span>
              </div>
              <button
                onClick={stopCamera}
                className="p-1 hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-xs font-extrabold text-red-600">{cameraError}</p>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest"
                >
                  Close &amp; Upload Photo Instead
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black overflow-hidden border border-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-white/30 pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-black text-white bg-black/60 px-3 py-1 uppercase tracking-widest">
                      Center Food Plate In Frame
                    </span>
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

                <div className="flex gap-3">
                  <button
                    onClick={stopCamera}
                    className="flex-1 py-4 border border-black text-black font-black text-xs uppercase tracking-widest hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-2 py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ESTIMATION RESULT DISPLAY CARD */}
      {estimateResult && (
        <div className="p-8 md:p-10 bg-neutral-50 border border-black space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
              Gemini Estimate Result
            </span>
            <button
              onClick={() => {
                setEstimateResult(null);
                setPromptInput("");
                setSelectedImage(null);
              }}
              className="text-xs font-black uppercase tracking-wider text-black hover:underline"
            >
              Analyze Another Meal
            </button>
          </div>

          <div className="space-y-6">
            {selectedImage && (
              <div className="flex items-center gap-4 bg-white p-3 border border-black">
                <img
                  src={selectedImage}
                  alt="Meal photo"
                  className="w-24 h-24 object-cover border border-black/20"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    Analyzed Image
                  </span>
                  <p className="text-xs font-bold text-black/70">
                    Analyzed directly with Gemini 3.6 Flash multimodal vision.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-black/50">
                Identified Meal Name
              </span>
              <input
                type="text"
                value={editedMealName}
                onChange={(e) => setEditedMealName(e.target.value)}
                className="w-full text-2xl sm:text-3xl font-black text-black bg-white border border-black/20 p-3 focus:outline-none focus:border-black font-sans-custom uppercase"
              />
            </div>

            {/* Calories Display / Edit Box */}
            <div className="bg-white p-6 border border-black space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Estimated Caloric Content
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingCalories(!isEditingCalories)}
                  className="text-xs font-extrabold uppercase text-black underline underline-offset-4 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingCalories ? "Done Editing" : "Edit Calories"}</span>
                </button>
              </div>

              {isEditingCalories ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editedCalories}
                    onChange={(e) => setEditedCalories(Number(e.target.value))}
                    className="w-full text-4xl font-black text-black bg-neutral-100 border border-black p-3 focus:outline-none"
                  />
                  <span className="text-lg font-black text-black">kcal</span>
                </div>
              ) : (
                <div className="text-4xl sm:text-5xl font-black text-black font-sans-custom">
                  ≈ {editedCalories}&nbsp;<span className="text-base font-extrabold text-black/60">kcal</span>
                </div>
              )}
            </div>

            {/* Meal Type Selection */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Category / Meal Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setEditedMealType(type)}
                    className={`py-3 text-xs font-black uppercase tracking-widest border transition-all ${
                      editedMealType === type
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black/20 hover:border-black"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {estimateResult.confidence_note && (
              <p className="text-xs font-medium text-black/70 bg-white p-3 border border-black/10">
                <span className="font-extrabold uppercase text-black mr-1">Portion Breakdown:</span>
                {estimateResult.confidence_note}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={() => setIsEditingCalories(!isEditingCalories)}
              className="w-full sm:w-auto px-6 py-4 border border-black text-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              {isEditingCalories ? "Save Calorie Edit" : "Edit Calories"}
            </button>

            <button
              type="button"
              onClick={handleSaveMealConfirmed}
              className="w-full sm:w-auto px-10 py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Save Meal</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* POST-SAVE FREQUENT MEAL PROMPT MODAL */}
      {savedMealForFrequent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-white text-black max-w-md w-full border border-black p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="space-y-2 text-center">
              <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 inline-block">
                Meal Saved To Log
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight font-sans-custom">
                Save this as a frequent meal?
              </h3>
              <p className="text-sm font-bold text-black/70">
                "{savedMealForFrequent.mealName}" ({savedMealForFrequent.calories} kcal) will be pinned to your Frequent Meals for 1-tap logging later.
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => handleConfirmFrequentSave(false)}
                className="flex-1 py-4 border border-black text-black font-black text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => handleConfirmFrequentSave(true)}
                className="flex-1 py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

