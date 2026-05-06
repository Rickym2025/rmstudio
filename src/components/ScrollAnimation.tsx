import { useRef, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

export function ScrollAnimation() {
  const ref = useRef(null);
  // Percorso iniziale corretto per EZGIF
  const [currentFrame, setCurrentFrame] = useState("/animation/ezgif-frame-001.jpg");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Mappiamo lo scroll su 160 immagini
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, 160]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    // Trasforma il numero in 001, 002, ecc.
    const num = Math.floor(latest).toString().padStart(3, '0');
    // Costruisce il nome file come uscito da EZGIF
    setCurrentFrame(`/animation/ezgif-frame-${num}.jpg`);
  });

  return (
    <section ref={ref} className="h-[400vh] relative bg-transparent">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
          className="absolute top-24 text-center z-20"
        >
          <h2 className="text-2xl font-bold tracking-[0.3em] text-cyan-500 uppercase">The Innovation Core</h2>
          <p className="text-white/40 text-sm mt-2 font-light">Scorri per esplorare l'ingegneria RM Studio</p>
        </motion.div>

        <img 
          src={currentFrame} 
          alt="AI Core Animation" 
          className="w-full max-w-[900px] h-auto object-contain z-10"
        />

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]) }}
          className="absolute bottom-24 text-center z-20 px-6"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Potenza Pura.</h2>
          <p className="text-white/60 text-lg mt-2">Nessun limite. Solo soluzioni scalabili.</p>
        </motion.div>

        {/* Sfumature per fondere l'animazione con il resto del sito */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04040a] via-transparent to-[#04040a] pointer-events-none" />
      </div>
    </section>
  );
}
