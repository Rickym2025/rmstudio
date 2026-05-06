import { useRef } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

export function ScrollAnimation() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Mappa il progresso dello scroll (0-1) sul numero di fotogrammi (es. 1-100)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, 100]);
  const [currentFrame, setCurrentFrame] = useState("/animation/frame_001.jpg");

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const num = Math.floor(latest).toString().padStart(3, '0');
    setCurrentFrame(`/animation/frame_${num}.jpg`);
  });

  return (
    <div ref={ref} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.img 
          src={currentFrame} 
          alt="RM Studio Exploded View" 
          className="max-w-4xl w-full h-auto object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-transparent to-[#020205] pointer-events-none" />
      </div>
    </div>
  );
}
