"use client";

import { useState } from "react";
import Image from "next/image";

interface SlideItem {
  id: number;
  type: "text" | "image";
  title: string;
  content?: string;
  src?: string;
}

const slideData: SlideItem[] = [
  {
    id: 1,
    type: "text",
    title: "Visi Kami",
    content: "Menjadi pembudidaya yang konsisten dan memberikan kualitas ikan lele yang unggul.",
  },
  {
    id: 2,
    type: "text",
    title: "Misi Kami",
    content: "• Budidaya lele gaya modern/millenial.\n• Pakan bernutrisi standar peternakan.\n• Menciptakan lapangan kerja & meningkatkan taraf hidup masyarakat.\n• Edukasi budidaya & inovasi olahan lele.",
  },
  {
    id: 3,
    type: "text",
    title: "Tujuan Utama",
    content: "Meningkatkan profit seluruh pembudidaya di Cibunar-Cibatu melalui program kegiatan bersama yang berkelanjutan demi kesejahteraan anggota.",
  },
];

export default function CarouselPengenalan() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full max-w-2xl mx-auto h-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border dark:border-gray-700">
      <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center transition-all duration-500 ease-in-out">
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{slideData[currentIndex].title}</h3>
        {slideData[currentIndex].type === "text" ? (
          <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-line">{slideData[currentIndex].content}</p>
        ) : (
          <div className="relative w-full h-48">
            {slideData[currentIndex].src && <Image src={slideData[currentIndex].src as string} alt={slideData[currentIndex].title} fill className="object-contain" />}
          </div>
        )}
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full cursor-pointer transition">❮</button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full cursor-pointer transition">❯</button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slideData.map((_, i) => (
          <div key={i} onClick={() => setCurrentIndex(i)} className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentIndex === i ? "bg-blue-600" : "bg-gray-400"}`} />
        ))}
      </div>
    </div>
  );
}