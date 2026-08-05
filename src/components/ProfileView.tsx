import React from "react";
import { ActivePage } from "../types";
import { STUDIO_PROFILE, CAPABILITIES_DATA } from "../data";
import { ArrowRight, Award, Globe, Users, ShieldCheck, Sparkles } from "lucide-react";

interface ProfileViewProps {
  setActivePage: (page: ActivePage) => void;
  onOpenContact: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ setActivePage, onOpenContact }) => {
  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12 space-y-20 animate-fade-in select-none">
      {/* SECTION 1: STUDIO HEADER & MANIFESTO */}
      <section className="space-y-8 max-w-5xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
            About GLYPH &amp; chroma
          </span>
          <span className="text-xs font-bold text-black/50 uppercase tracking-widest">
            San Francisco • Est. 2024
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight leading-tight font-sans-custom">
          {STUDIO_PROFILE.heading}
        </h1>

        <p className="text-base sm:text-xl font-medium text-black/80 leading-relaxed border-l-2 border-black pl-6">
          {STUDIO_PROFILE.manifesto}
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenContact}
            className="px-6 py-3.5 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Inquire For 2035
          </button>

          <button
            onClick={() => setActivePage("works")}
            className="px-6 py-3.5 border border-black text-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Explore All Works
          </button>
        </div>
      </section>

      {/* SECTION 2: STATS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-black/10">
        {STUDIO_PROFILE.stats.map((stat, i) => (
          <div key={i} className="space-y-1">
            <span className="text-xs font-black text-black/50 uppercase tracking-widest block">
              {stat.label}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans-custom">
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      {/* SECTION 3: CORE PHILOSOPHY & VALUES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3 p-6 bg-neutral-50 border border-black/10">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">
            01
          </div>
          <h3 className="text-xl font-black text-black uppercase tracking-tight">
            Typographic Rigor
          </h3>
          <p className="text-xs font-semibold text-black/70 leading-relaxed">
            Every letterform, grid alignment, and tracking value is mathematically calculated for optical precision and high contrast.
          </p>
        </div>

        <div className="space-y-3 p-6 bg-neutral-50 border border-black/10">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">
            02
          </div>
          <h3 className="text-xl font-black text-black uppercase tracking-tight">
            Tactile Materiality
          </h3>
          <p className="text-xs font-semibold text-black/70 leading-relaxed">
            From heavy magazine paper stocks to textured aluminum coffee cans, we design for touch as intensely as we design for vision.
          </p>
        </div>

        <div className="space-y-3 p-6 bg-neutral-50 border border-black/10">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">
            03
          </div>
          <h3 className="text-xl font-black text-black uppercase tracking-tight">
            No Fluff Impact
          </h3>
          <p className="text-xs font-semibold text-black/70 leading-relaxed">
            We strip away ornamental noise. What remains is pure brand expression, distinct typography, and immediate visual clarity.
          </p>
        </div>
      </section>

      {/* SECTION 4: CLIENT ROSTER */}
      <section className="space-y-6 pt-6 border-t border-black/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase text-black font-sans-custom">
            Selected Client Roster
          </h2>
          <span className="text-xs font-extrabold text-black/50 uppercase">2030 – 2035</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-extrabold text-black uppercase tracking-wider">
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Blue Shift Publications
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Oryx Coffee Roasters
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Berlin Neue Galerie
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Toulouse Dining Group
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            The Remade Studio
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Single Origin Co.
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Le Petit Bistro
          </div>
          <div className="p-4 border border-black/10 bg-neutral-50 flex items-center justify-center text-center">
            Nordic Design Council
          </div>
        </div>
      </section>
    </div>
  );
};
