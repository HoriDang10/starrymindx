"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { paintings } from "./paintings";

export default function PaintingSelector() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1: next, -1: prev

  // 🎞️ Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => handleNext(), 4000);
    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % paintings.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + paintings.length) % paintings.length);
  };

  // 🧭 Mapping ID → Quiz route
  const handleSelect = (id: string) => {
    const routeMap: Record<string, string> = {
      "starry-night": "/quiz/starrynight",
      "bedroom-in-arles": "/quiz/bedroom",
      "sorrowing-old-man": "/quiz/enternityGate",
      "wheatfield-with-crows": "/quiz/wheatfield", // nếu có quiz này sau
    };

    router.push(routeMap[id] || "/");
  };

  const currentPainting = paintings[index];

  return (
    <section id="gallery" className="w-full flex justify-center mt-16 scroll-mt-24">
      <div className="relative w-full max-w-4xl h-[550px] overflow-hidden rounded-xl border border-primary/20 shadow-md">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute w-full h-full"
          >
            <img
              src={currentPainting.src}
              alt={currentPainting.label}
              onClick={() => handleSelect(currentPainting.id)}
              className={`w-full h-full object-cover ${
                currentPainting.position ?? ""
              } cursor-pointer`}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-background/60 backdrop-blur-sm">
              <div className="translate-y-[-6px]">
                <p className="text-lg font-semibold text-foreground mb-1">
                  {currentPainting.label}
                </p>
                <a
                  href={currentPainting.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-400 hover:underline"
                >
                  Nguồn: Wikipedia
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 🔘 Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm rounded-full p-2 shadow hover:bg-primary/30 transition"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm rounded-full p-2 shadow hover:bg-primary/30 transition"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>

        {/* ⚪ Dots */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2 mb-2">
          {paintings.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === index ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// 🎬 Netflix-like transition variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.2, 0.1, 0.25, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};
