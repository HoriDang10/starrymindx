"use client";

import HeroSection from "@/compoments/HeroSection";
import AboutVanGogh from "@/compoments/aboutVanGogh";
import PaintingSelector from "@/compoments/painting_selector";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      
      {/* 🌟 Hero Section */}
      <section id="hero" className="w-screen h-screen">
      <HeroSection />
      </section>

      {/* 🎨 About Van Gogh */}
      <section id="about" className="py-32">
        <AboutVanGogh />
      </section>

      {/* 🖼️ Painting Selector */}
      <section
        id="gallery"
        className="w-full flex flex-col items-center justify-center py-32 scroll-mt-32"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          Hãy chọn bức tranh mà bạn cảm thấy đồng cảm nhất
        </h1>

        <PaintingSelector />
      </section>
    </main>
  );
}
