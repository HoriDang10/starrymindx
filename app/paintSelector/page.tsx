"use client";
import PaintingSelector from "@/compoments/painting_selector";

export default function PaintingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl font-bold text-center">
        Chọn bức tranh Van Gogh mà bạn cảm thấy kết nối nhất</h1>
      <PaintingSelector />
    </main>
  );
}
