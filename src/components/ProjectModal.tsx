import React from "react";
import { ProjectWork } from "../types";
import { X, ArrowRight, Tag, Calendar, User, ExternalLink } from "lucide-react";

interface ProjectModalProps {
  project: ProjectWork | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenContact,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in select-none">
      <div className="bg-white text-black max-w-4xl w-full rounded-none border border-black shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black/50 block">
              Case Study • {project.year}
            </span>
            <h2 className="text-xl md:text-2xl font-black font-sans-custom uppercase tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Main Image */}
          <div className="aspect-[16/10] bg-neutral-100 overflow-hidden border border-black/10">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 inline-block">
                  {project.category}
                </span>
                <p className="text-base md:text-lg font-bold text-black/90 pt-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-2 flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-extrabold uppercase tracking-wider bg-neutral-100 text-black border border-black/10 px-2.5 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar info */}
            <div className="md:col-span-4 bg-neutral-50 p-6 border border-black/10 space-y-4 text-xs font-bold">
              <div>
                <span className="text-black/50 uppercase tracking-widest block text-[10px]">Client</span>
                <span className="text-sm font-extrabold text-black">{project.client}</span>
              </div>

              <div>
                <span className="text-black/50 uppercase tracking-widest block text-[10px]">Year</span>
                <span className="text-sm font-extrabold text-black">{project.year}</span>
              </div>

              <div>
                <span className="text-black/50 uppercase tracking-widest block text-[10px]">Scope</span>
                <span className="text-sm font-extrabold text-black">{project.category}</span>
              </div>

              <div className="pt-4 border-t border-black/10">
                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full py-3 bg-black text-white font-black uppercase tracking-widest text-[11px] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Inquire Similar Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
