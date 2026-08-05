import React from "react";
import { ActivePage } from "../types";
import { Plus } from "lucide-react";

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-black text-white pt-16 md:pt-24 pb-8 px-6 md:px-12 w-full overflow-hidden select-none border-t border-black">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Start a Conversation Column */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-sans-custom">
              BITEOPIA
            </h2>
            <p className="text-sm font-extrabold text-neutral-300 max-w-sm">
              AI-assisted nutritional tracking &amp; calorie volume logs. Powered by Gemini.
            </p>
          </div>

          {/* Nav Links Column */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-2">
              System Pages
            </span>
            <button
              onClick={() => setActivePage("home")}
              className="block text-sm font-extrabold tracking-wider hover:underline underline-offset-4 text-left"
            >
              HOME DASHBOARD
            </button>
            <button
              onClick={() => setActivePage("add-meal")}
              className="block text-sm font-extrabold tracking-wider hover:underline underline-offset-4 text-left"
            >
              ADD MEAL (AI)
            </button>
            <button
              onClick={() => setActivePage("frequent")}
              className="block text-sm font-extrabold tracking-wider hover:underline underline-offset-4 text-left"
            >
              FREQUENT MEALS
            </button>
            <button
              onClick={() => setActivePage("weight")}
              className="block text-sm font-extrabold tracking-wider hover:underline underline-offset-4 text-left"
            >
              WEIGHT TRACKER
            </button>
            <button
              onClick={() => setActivePage("goal")}
              className="block text-sm font-extrabold tracking-wider hover:underline underline-offset-4 text-left"
            >
              SET GOALS &amp; METRICS
            </button>
          </div>

          {/* Specifications Column */}
          <div className="lg:col-span-4 space-y-3 text-sm font-bold tracking-tight text-neutral-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
              Specifications &amp; Rules
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gemini estimate model uses server-side proxy routes. Daily target calorie calculations and weight logs persist in standard browser local storage.
            </p>
          </div>
        </div>

        {/* Massive Watermark Branding */}
        <div className="pt-8 border-t border-white/10 text-center sm:text-left">
          <div className="w-full flex flex-wrap items-baseline justify-between overflow-hidden leading-none select-none">
            <span className="text-[14vw] sm:text-[15vw] font-black tracking-tighter uppercase font-sans-custom leading-none">
              BITE
            </span>
            <span className="text-[14vw] sm:text-[15vw] font-serif-italic leading-none">
              opia
            </span>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-neutral-400 gap-2 border-t border-white/10">
          <p>© Biteopia</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-white uppercase transition-colors"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
