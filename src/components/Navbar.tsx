import React from "react";
import { ActivePage } from "../types";
import { Plus, Target, Scale, Bookmark, Home, User } from "lucide-react";

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  userName = "Profile",
}) => {
  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "HOME", icon: <Home className="w-3.5 h-3.5" /> },
    { id: "add-meal", label: "ADD MEAL", icon: <Plus className="w-3.5 h-3.5" /> },
    { id: "frequent", label: "FREQUENT", icon: <Bookmark className="w-3.5 h-3.5" /> },
    { id: "weight", label: "WEIGHT", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "goal", label: "SET GOAL", icon: <Target className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/10 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActivePage("home")}
          className="text-left group flex items-baseline tracking-tighter"
        >
          <span className="text-xl md:text-2xl font-black text-black uppercase tracking-tight font-sans-custom">
            BITE
          </span>
          <span className="text-xl md:text-2xl font-serif-italic font-normal text-black tracking-normal">
            opia
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`text-xs font-black tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "text-black underline underline-offset-4 decoration-2"
                    : "text-black/60 hover:text-black hover:underline underline-offset-4"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right User Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage("profile")}
            className="text-xs font-black text-black hover:opacity-75 transition-opacity uppercase tracking-wider"
          >
            {userName}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navbar */}
      <div className="md:hidden border-t border-black/10 bg-white px-4 py-2 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`text-[10px] font-black tracking-widest uppercase px-2 py-1.5 flex flex-col items-center gap-1 ${
                isActive ? "bg-black text-white" : "text-black/70 hover:text-black"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
