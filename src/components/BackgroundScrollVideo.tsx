import { useState } from "react";
// @ts-ignore
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export function BackgroundScrollVideo() {
  // Imposta il primo frame
  const [currentFrame, setCurrentFrame] = useState("/animation/ezgif-frame-001.jpg");

  // useScroll senza target "ascolta" lo scroll dell'intera pagina web
  const { scrollYProgress } = useScroll();

  // Mappa lo scroll (da 0% a 100%) sui 160 frame
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, 160]);

  useMotionValueEvent(frameIndex, "change", (latest: number) => {
    const num = Math.floor(latest).toString().padStart(3, '0');
    setCurrentFrame(`/animation/ezgif-frame-${num}.jpg`);
  });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      {/* Immagine a tutto schermo */}
      <img 
        src={currentFrame} 
        alt="RM Studio Background" 
        className="w-full h-full object-cover opacity-60" 
      />
      {/* Sfumatura scura per far leggere bene i testi sopra */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04040a]/80 via-black/40 to-[#04040a]/90" />
    </div>
  );
}
