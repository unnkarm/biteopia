import React from "react";
import { ActivePage } from "../types";
import { CAPABILITIES_DATA } from "../data";
import { ArrowRight, Check, Sparkles } from "lucide-react";

interface CapabilitiesViewProps {
  setActivePage: (page: ActivePage) => void;
  onOpenContact: () => void;
}

export const CapabilitiesView: React.FC<CapabilitiesViewProps> = ({
  setActivePage,
  onOpenContact,
}) => {
  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12 space-y-16 animate-fade-in select-none">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
          Services &amp; Expertise
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
          Studio Capabilities
        </h1>
        <p className="text-base sm:text-lg font-bold text-black/70 leading-snug">
          This is the space to introduce your Services section. Briefly describe the types of services you offer and highlight any special benefits or features.
        </p>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CAPABILITIES_DATA.map((cap, i) => (
          <div
            key={cap.id}
            className="p-8 bg-neutral-50 border border-black/10 hover:border-black transition-all space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-serif-italic">0{i + 1}.</span>
                {cap.featuredProject && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    Featured: {cap.featuredProject}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-black tracking-tight font-sans-custom">
                {cap.title}
              </h2>

              <p className="text-sm font-medium text-black/80 leading-relaxed">
                {cap.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/50 block">
                  Core Deliverables
                </span>
                <ul className="grid grid-cols-2 gap-2 text-xs font-extrabold text-black">
                  {cap.services.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-black/10">
              <button
                onClick={onOpenContact}
                className="text-xs font-black uppercase tracking-wider text-black hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>Request {cap.title} Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
