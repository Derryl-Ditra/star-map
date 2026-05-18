# Star Map (Solar System Explorer)

A highly optimized, high-performance, and visually immersive educational progressive web application designed specifically for toddlers (Ages 2-5) to explore and learn celestial bodies.

## 🚀 Concept & UX Architecture
The Star Map application is engineered using a strict **"Toddler-First" UX design philosophy**. It strips away all distracting and chaotic UI paradigms (menus, buttons, ads, settings, search inputs) and replaces them with an extremely responsive, clean, and sensory-driven physical sandbox. 

The app features deep, dark-mode cosmic graphics optimized to protect young eyes while ensuring maximum visual contrast of celestial bodies.

## 🧠 Toddler-Centric Interaction Rules

### 1. ⏱ The "1.2s Immediate Flow" (Anti-Doomscroll)
*   **The Problem**: Toddlers have a tendency to swipe rapidly through slides ("doom-scrolling"), which breaks the learning loop and leads to overstimulation.
*   **The Solution**: Swiping to a new celestial body triggers the name narration **instantly** (0ms delay) but locks further navigation swiping and arrow taps for exactly **1.2 seconds**. 
*   **Safety Lock**: The UI remains fully bright and active (no confusing dimming or disabling indicators), but interaction is programmatically frozen, allowing the child's attention to settle on the image and absorb the verbal name.

### 2. 🔍 "2.0s Tap Lock" & Persistent Focus Zoom
*   **The Problem**: Tapping rapidly on the center image ("doom-tapping") causes audio stuttering and chaotic noise.
*   **The Solution**: Tapping a celestial body plays the soft narration and triggers a persistent **1.15x enlargement zoom**. 
*   **Lock Duration**: Taps are locked for exactly **2.0 seconds** to allow the voice narration to finish completely. The item remains enlarged to capture focal attention and smoothly shrinks back to normal size when the 2-second lock finishes.

### 3. 🔊 Single-Source Audio Controller (Singleton)
*   **Preventing Chaos**: A robust React `useRef`-managed audio manager instantly halts and cleans up any previous playing sound the exact millisecond a swipe or tap occurs. This guarantees that different voices will never play over one another.

### 4. 👩‍🏫 Calmed Bilingual Narration (0.75x Pace)
*   **Language Acquisition**: Audio is pre-recorded using a mature, soft, and warm female voice in both **Bahasa Indonesia** and **English**.
*   **Pacing**: Played back at a controlled **0.75x speed** to ensure the speech phonetics are easily recognizable, enabling optimal mimicry and pronunciation matching for early language learners.
*   **Simplified Terminology**: Complex identifiers (like *International Space Station* / *Stasiun Luar Angkasa*) are simplified to **Satellite** / **Satelit** to align with toddler cognitive vocabulary.

## 📱 Progressive Web App (PWA) Setup
*   **Standalone Full-Screen Mode**: Installs cleanly on Android, iPad, and iPhone home screens.
*   **Zero Distractions**: Hides system bars and URL search bars, locking the phone/tablet into a true full-screen educational sandbox where toddlers cannot accidentally navigate away.

## 🛠 Technical Specifications
*   **Framework**: Next.js 16 (App Router)
*   **Animations**: Framer Motion (GPU-accelerated, spring-physics animations with `will-change` layer optimizations running at a buttery-smooth 60fps)
*   **Styling**: Vanilla CSS & Tailwind CSS 4
*   **Asset Performance**: Integrated offline asset preloading for both high-contrast 3D PNG images and bilingual `.mp3` narration clips.
*   **Deployment**: Zero-maintenance automated deployment pipeline hosted on GitHub Pages via custom CI/CD GitHub Actions.
*   **PII Compliant**: Zero personal identifiable information (PII), credentials, or private configuration entries are stored in the code or website bundle.

## 📝 Usage & Installation
To run the developer sandbox locally:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the development server using `npm run dev`.
4. Deploy a static export using `npm run build`.

---
*Created purely for educational, zero-cost, screen-safe toddler development.*
