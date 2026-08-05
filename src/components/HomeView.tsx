import React, { useState } from "react";
import { ActivePage, ProjectWork } from "../types";
import { PROJECTS_DATA, CAPABILITIES_DATA, STUDIO_PROFILE } from "../data";
import { Plus, ArrowRight, Eye, Sparkles } from "lucide-react";

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  onOpenContact: () => void;
  onSelectProject: (project: ProjectWork) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActivePage,
  onOpenContact,
  onSelectProject,
}) => {
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);

  // Gallery items for the hero section
  const heroGalleryProjects = PROJECTS_DATA;

  return (
    <div className="space-y-24 pb-20 select-none">
      {/* SECTION 1: HERO STATEMENT (Matching Screenshot 2) */}
      <section className="pt-8 md:pt-16 px-6 md:px-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="max-w-5xl space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black tracking-tight leading-[1.08] font-sans-custom">
            Design is an act of translation. It is about turning complex business logic into intuitive visual languages. No fluff, just impact.
          </h1>

          {/* Sub Link */}
          <div className="pt-2">
            <button
              onClick={() => setActivePage("profile")}
              className="group flex items-center gap-2 text-lg sm:text-xl font-serif-italic hover:opacity-75 transition-opacity text-black"
            >
              <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs group-hover:bg-black group-hover:text-white transition-all">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="italic">The Studio</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL / GRID VISUAL GALLERY (Matching Screenshot 2 Row) */}
        <div className="pt-8">
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory">
            {heroGalleryProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="flex-shrink-0 w-72 sm:w-80 md:w-96 group cursor-pointer snap-start space-y-3"
              >
                <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-black/10 transition-all duration-300 group-hover:shadow-2xl group-hover:border-black">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-4 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-4 h-4" /> View Work
                    </span>
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <h3 className="text-base sm:text-lg font-black text-black tracking-tight group-hover:underline decoration-2 underline-offset-4">
                    {project.title}
                  </h3>
                  <p className="text-xs font-bold text-black/60 uppercase tracking-wider">
                    {project.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: CAPABILITIES SECTION (Matching Screenshot 1) */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-12 border-t border-black/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Heading */}
          <div className="lg:col-span-5">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight font-sans-custom">
              Capabilities
            </h2>
          </div>

          {/* Right Description */}
          <div className="lg:col-span-7">
            <p className="text-lg sm:text-xl font-bold text-black leading-snug max-w-2xl">
              {STUDIO_PROFILE.servicesSummary}
            </p>
          </div>
        </div>

        {/* Featured Cards Showcase Grid (Screenshot 1 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured 1: The Blue Shift (Magazine Design & Merchandise) */}
          <div
            onClick={() => onSelectProject(PROJECTS_DATA[0])}
            className="group cursor-pointer space-y-4"
          >
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-black/10 group-hover:border-black transition-all">
              <img
                src={PROJECTS_DATA[0].image}
                alt={PROJECTS_DATA[0].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-black tracking-tight group-hover:underline underline-offset-4">
                Magazine Design &amp; Merchandise
              </h3>
              <p className="text-xs font-bold text-black/60 uppercase tracking-wider mt-1">
                The Blue Shift • 2035
              </p>
            </div>
          </div>

          {/* Featured 2: Toulouse Bar & Bistro */}
          <div
            onClick={() => onSelectProject(PROJECTS_DATA[6])}
            className="group cursor-pointer space-y-4"
          >
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-black/10 group-hover:border-black transition-all">
              <img
                src={PROJECTS_DATA[6].image}
                alt={PROJECTS_DATA[6].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-black tracking-tight group-hover:underline underline-offset-4">
                Toulouse Bar &amp; Bistro
              </h3>
              <p className="text-xs font-bold text-black/60 uppercase tracking-wider mt-1">
                Digital Visual Language • 2034
              </p>
            </div>
          </div>

          {/* Featured 3: Weekend Jazz Brunch */}
          <div
            onClick={() => onSelectProject(PROJECTS_DATA[2])}
            className="group cursor-pointer space-y-4"
          >
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-black/10 group-hover:border-black transition-all">
              <img
                src={PROJECTS_DATA[2].image}
                alt={PROJECTS_DATA[2].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-black tracking-tight group-hover:underline underline-offset-4">
                Weekend Jazz Brunch
              </h3>
              <p className="text-xs font-bold text-black/60 uppercase tracking-wider mt-1">
                Brand Identity &amp; Art Direction • 2035
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Capabilities List Accordion */}
        <div className="mt-16 border-t border-black/10 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-black/50">
              Service Breakdown
            </h3>
            <button
              onClick={() => setActivePage("capabilities")}
              className="text-xs font-extrabold uppercase tracking-wider text-black hover:underline underline-offset-4 flex items-center gap-1"
            >
              <span>View All Capabilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-black/10">
            {CAPABILITIES_DATA.map((cap) => {
              const isOpen = selectedCapability === cap.id;
              return (
                <div key={cap.id} className="py-6 space-y-4">
                  <div
                    onClick={() => setSelectedCapability(isOpen ? null : cap.id)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <h4 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight group-hover:translate-x-1 transition-transform">
                      {cap.title}
                    </h4>
                    <div className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center group-hover:border-black">
                      <Plus className={`w-4 h-4 transition-transform ${isOpen ? "rotate-45" : ""}`} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="pt-2 text-sm space-y-4 animate-fade-in">
                      <p className="text-black/80 max-w-2xl font-medium">
                        {cap.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cap.services.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-neutral-100 text-black px-3 py-1 text-xs font-extrabold uppercase tracking-wider"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: CALL TO ACTION BANNER */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-neutral-100 border border-black p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-white px-2 py-1 border border-black inline-block">
              San Francisco • Studio
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight font-sans-custom">
              Ready to transform your visual identity?
            </h3>
            <p className="text-xs md:text-sm text-black/70 font-bold max-w-md">
              We work with selective clients per year to maintain high craft and individual attention.
            </p>
          </div>

          <button
            onClick={onOpenContact}
            className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-neutral-800 transition-all flex-shrink-0"
          >
            Start a Conversation
          </button>
        </div>
      </section>
    </div>
  );
};
