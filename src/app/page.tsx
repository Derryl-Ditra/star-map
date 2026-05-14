"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Star, 
  Circle as Planet, 
  Rocket, 
  Telescope,
  MilkyWay as Galaxy 
} from "lucide-react";

// --- Data Structure ---
const CELESTIAL_BODIES = [
  { id: 1, name: "Sun", icon: Sun, color: "text-yellow-400", glow: "icon-glow" },
  { id: 2, name: "Moon", icon: Moon, color: "text-white", glow: "icon-glow-white" },
  { id: 3, name: "Earth", icon: Planet, color: "text-blue-400", glow: "icon-glow-white" },
  { id: 4, name: "Mars", icon: Planet, color: "text-red-500", glow: "icon-glow" },
  { id: 5, name: "Jupiter", icon: Planet, color: "text-orange-300", glow: "icon-glow" },
  { id: 6, name: "Saturn", icon: Planet, color: "text-yellow-200", glow: "icon-glow" },
  { id: 7, name: "Star", icon: Star, color: "text-yellow-400", glow: "icon-glow" },
  { id: 8, name: "Rocket", icon: Rocket, color: "text-white", glow: "icon-glow-white" },
];

// --- Speech Hook ---
const useSpeech = () => {
  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7; // Slightly slower for toddler comprehension
      utterance.pitch = 1.1; // Friendly tone
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return speak;
};

export default function SolarSystemExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const speak = useSpeech();

  const currentBody = CELESTIAL_BODIES[currentIndex];

  const navigate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % CELESTIAL_BODIES.length;
      } else {
        return (prev - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
      }
    });
  }, []);

  // Trigger speech when the body changes
  useEffect(() => {
    speak(currentBody.name);
  }, [currentIndex, currentBody.name, speak]);

  // Framer Motion variants for sliding
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Click zones for navigation */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer" 
        onClick={() => navigate(-1)}
        aria-label="Previous"
      />
      <div 
        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer" 
        onClick={() => navigate(1)}
        aria-label="Next"
      />

      {/* Main Content Area */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentBody.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x;
            const swipeThreshold = 50;
            if (swipe < -swipeThreshold) {
              navigate(1);
            } else if (swipe > swipeThreshold) {
              navigate(-1);
            }
          }}
          className="absolute flex flex-col items-center justify-center select-none"
          onClick={(e) => {
            // Prevent click from bubbling to zones if we want to trigger speech on icon tap
            e.stopPropagation();
            speak(currentBody.name);
          }}
        >
          <currentBody.icon 
            size={250} 
            strokeWidth={2.5}
            className={`${currentBody.color} ${currentBody.glow} transition-all duration-300`}
          />
          <h1 className="mt-12 text-6xl font-bold text-white tracking-widest uppercase">
            {currentBody.name}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Decorative stars in background (static) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-75" />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
        <div className="absolute top-1/5 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
      </div>
    </main>
  );
}
