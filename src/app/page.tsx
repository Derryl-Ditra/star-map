"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Translations ---
const TRANSLATIONS = {
  id: {
    Sun: "Matahari",
    Mercury: "Merkurius",
    Venus: "Venus",
    Earth: "Bumi",
    Mars: "Mars",
    Jupiter: "Yupiter",
    Saturn: "Saturnus",
    Uranus: "Uranus",
    Neptune: "Neptunus",
    Moon: "Bulan",
    ISS: "Stasiun Luar Angkasa",
    Asteroid: "Asteroid",
    Astronaut: "Astronot",
  },
  en: {
    Sun: "Sun",
    Mercury: "Mercury",
    Venus: "Venus",
    Earth: "Earth",
    Mars: "Mars",
    Jupiter: "Jupiter",
    Saturn: "Saturn",
    Uranus: "Uranus",
    Neptune: "Neptune",
    Moon: "Moon",
    ISS: "International Space Station",
    Asteroid: "Asteroid",
    Astronaut: "Astronaut",
  },
};

// --- Data Structure ---
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/star-map' : '';

const CELESTIAL_BODIES = [
  { id: "sun", key: "Sun", image: `${BASE_PATH}/planets/sun.png` },
  { id: "mercury", key: "Mercury", image: `${BASE_PATH}/planets/mercury.png` },
  { id: "venus", key: "Venus", image: `${BASE_PATH}/planets/venus.png` },
  { id: "earth", key: "Earth", image: `${BASE_PATH}/planets/earth.png` },
  { id: "moon", key: "Moon", image: `${BASE_PATH}/planets/moon.png` },
  { id: "mars", key: "Mars", image: `${BASE_PATH}/planets/mars.png` },
  { id: "jupiter", key: "Jupiter", image: `${BASE_PATH}/planets/jupiter.png` },
  { id: "saturn", key: "Saturn", image: `${BASE_PATH}/planets/saturn.png` },
  { id: "uranus", key: "Uranus", image: `${BASE_PATH}/planets/uranus.png` },
  { id: "neptune", key: "Neptune", image: `${BASE_PATH}/planets/neptune.png` },
  { id: "iss", key: "ISS", image: `${BASE_PATH}/planets/iss.png` },
  { id: "asteroid", key: "Asteroid", image: `${BASE_PATH}/planets/asteroid.png` },
  { id: "astronaut", key: "Astronaut", image: `${BASE_PATH}/planets/astronaut.png` },
];

type Lang = "id" | "en";

export default function SolarSystemExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lang, setLang] = useState<Lang>("id");
  const [isPulsing, setIsPulsing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const isFirstLoad = React.useRef(true);

  const currentBody = CELESTIAL_BODIES[currentIndex];
  const t = TRANSLATIONS[lang];

  // Sound effects
  const playSound = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {}); // Ignore autoplay blocks
  }, []);

  const navigate = useCallback((newDirection: number) => {
    playSound("https://www.soundjay.com/misc/sounds/whoosh-01.mp3");
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % CELESTIAL_BODIES.length;
      } else {
        return (prev - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
      }
    });
  }, [playSound]);

  // The "Immediate + Freeze" Rule
  const speak = useCallback((planetKey: string, isManualTap = false) => {
    // Determine lock duration: 1.2s for navigation, 2.5s for manual taps to allow voice to finish
    const lockDuration = isManualTap ? 2500 : 1200;
    
    setIsBusy(true); // Lock interaction immediately
    
    const voiceUrl = `${BASE_PATH}/voices/${lang}/${planetKey.toLowerCase()}.mp3`;
    const audio = new Audio(voiceUrl);
    audio.volume = 1.0;
    audio.play().catch(() => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(TRANSLATIONS[lang][planetKey as keyof typeof TRANSLATIONS['id']]);
        utterance.lang = lang === "id" ? "id-ID" : "en-US";
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
      }
    });

    // Freeze to prevent doom-scrolling or doom-tapping
    setTimeout(() => setIsBusy(false), lockDuration);
  }, [lang]);

  // The "First Slide" Auto-Trigger and Preloading
  useEffect(() => {
    const delay = isFirstLoad.current ? 400 : 50; // Small delay for smoother start
    const timer = setTimeout(() => {
      speak(currentBody.key);
      isFirstLoad.current = false;
    }, delay);

    // Preload next assets
    const nextIndex = (currentIndex + 1) % CELESTIAL_BODIES.length;
    const nextKey = CELESTIAL_BODIES[nextIndex].key;
    const img = new Image();
    img.src = CELESTIAL_BODIES[nextIndex].image;
    const audio = new Audio(`${BASE_PATH}/voices/${lang}/${nextKey.toLowerCase()}.mp3`);
    audio.load();

    return () => clearTimeout(timer);
  }, [currentIndex, lang, currentBody.key, speak]);

  const handleInteraction = () => {
    if (isBusy) return;
    playSound("https://www.soundjay.com/button/sounds/button-30.mp3");
    speak(currentBody.key, true); // Pass true to trigger the longer 2.5s "Tap Lock"
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 500);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
  };

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="space-bg" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50 flex gap-2 md:gap-3">
        <button 
          onClick={() => setLang("id")}
          className={`language-btn text-xs md:text-sm ${lang === "id" ? "active" : ""}`}
        >
          ID
        </button>
        <button 
          onClick={() => setLang("en")}
          className={`language-btn text-xs md:text-sm ${lang === "en" ? "active" : ""}`}
        >
          EN
        </button>
      </div>

      {/* Navigation Areas */}
      <div 
        className="absolute left-0 top-0 w-[60px] md:w-[120px] h-full z-10 cursor-pointer flex items-center justify-start pl-4 md:pl-8 group" 
        style={{ pointerEvents: isBusy ? "none" : "auto" }}
        onClick={() => navigate(-1)}
      >
        <div className="text-white/20 group-hover:text-white/70 transition-colors text-2xl md:text-4xl">&larr;</div>
      </div>
      <div 
        className="absolute right-0 top-0 w-[60px] md:w-[120px] h-full z-10 cursor-pointer flex items-center justify-end pr-4 md:pr-8 group" 
        style={{ pointerEvents: isBusy ? "none" : "auto" }}
        onClick={() => navigate(1)}
      >
        <div className="text-white/20 group-hover:text-white/70 transition-colors text-2xl md:text-4xl">&rarr;</div>
      </div>

      {/* Content */}
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
          drag={isBusy ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, { offset, velocity }) => {
            if (isBusy) return;
            if (offset.x < -50) navigate(1);
            else if (offset.x > 50) navigate(-1);
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center select-none"
          style={{ padding: "5vh 5vw", willChange: "transform, opacity" }}
          onClick={handleInteraction}
        >
          {/* Image Container - Maximized for 85-95% screen coverage */}
          <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">
            <motion.img
              src={currentBody.image}
              alt={currentBody.key}
              className="max-w-full max-h-full object-contain will-change-transform drop-shadow-2xl"
              initial={{ rotate: -5 }}
              animate={{ 
                rotate: 0,
                scale: isPulsing ? 1.05 : 1,
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 400, damping: 10 },
                rotate: { duration: 0.5 }
              }}
            />
          </div>
          
          {/* Text Area - Absolute overlay to keep image space clear */}
          <div className="absolute bottom-[8vh] flex flex-col items-center justify-start max-w-full pointer-events-none">
            <motion.h1 
              className="text-lg sm:text-2xl md:text-3xl font-black text-white/80 tracking-tighter uppercase italic leading-none break-words px-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t[currentBody.key as keyof typeof t]}
            </motion.h1>
          </div>
        </motion.div>
      </AnimatePresence>

    </main>
  );
}
