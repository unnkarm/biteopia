import React, { useState } from "react";
import { ProjectWork, ActivePage } from "../types";
import { PROJECTS_DATA } from "../data";
import { Eye, Filter, ArrowUpRight } from "lucide-react";

interface WorksViewProps {
  onSelectProject: (project: ProjectWork) => void;
  setActivePage: (page: ActivePage) => void;
}

export const WorksView: React.FC<WorksViewProps> = ({ onSelectProject, setActivePage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    "Magazine Design & Merchandise",
    "Brand Identity",
    "Packaging & Spatial",
    "Editorial Systems",
    "Digital Visual Language",
  ];

  const filteredProjects = selectedCategory === "ALL"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12 space-y-12 animate-fade-in select-none">
      {/* Title & Filter Header */}
      <div className="space-y-6 border-b border-black/10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-black/50">
              Selected Archives
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
              Works &amp; Projects
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-bold text-black/70 max-w-xs">
            A curated index of print publications, brand systems, packaging design, and visual languages from 2034–2035.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-black mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black/20 hover:border-black"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group cursor-pointer space-y-3"
          >
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-black/10 transition-all duration-300 group-hover:border-black group-hover:shadow-2xl">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-black px-4 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Expand Case
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">
                  {project.year}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-black tracking-tight group-hover:underline underline-offset-4">
                  {project.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs font-bold text-black/60 uppercase tracking-wider">
                {project.category}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-extrabold text-black/50 bg-neutral-100 px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
