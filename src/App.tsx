import React, { useRef, useState, useEffect } from "react";
import { NovaChatbot } from "./components/NovaChatbot";
import { FloatingDock } from "./components/FloatingDock";
import { ExternalLink, Download, Send } from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";

// --- 1. COMPONENTE FOOTER EFFETTO HOVER ---
const TextHoverEffect = ({ text }: { text: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef} width="100%" height="100%" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none uppercase cursor-pointer w-full h-full"
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </>
          )}
        </linearGradient>
        <motion.radialGradient id="revealMask" gradientUnits="userSpaceOnUse" r="20%" initial={{ cx: "50%", cy: "50%" }} animate={maskPosition} transition={{ duration: 0, ease: "easeOut" }}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.3" className="fill-transparent stroke-white/10 font-black text-6xl" style={{ opacity: hovered ? 0.7 : 0 }}>{text}</text>
      <motion.text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.3" className="fill-transparent stroke-cyan-500/50 font-black text-6xl"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }} animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }} transition={{ duration: 4, ease: "easeInOut" }}
      >{text}</motion.text>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" stroke="url(#textGradient)" strokeWidth="0.3" mask="url(#textMask)" className="fill-transparent font-black text-6xl">{text}</text>
    </svg>
  );
};

// --- 2. COMPONENTE TESTIMONIAL CARD ---
function TestimonialCard({ handleShuffle, testimonial, position, id, author }: any) {
  const dragRef = useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{ zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0 }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        scale: position === "front" ? 1 : position === "middle" ? 0.95 : 0.9,
      }}
      drag={isFront ? "x" : false}
      dragElastic={0.35}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e: any) => { dragRef.current = e.clientX; }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 100 || e.clientX - dragRef.current > 100) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[350px] w-[300px] select-none place-content-center space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img src={`https://i.pravatar.cc/128?img=${id}`} alt={author} className="pointer-events-none mx-auto h-20 w-20 rounded-full border-2 border-cyan-500/50 object-cover shadow-lg" />
      <p className="text-center text-sm italic text-white/70 leading-relaxed">"{testimonial}"</p>
      <span className="text-center text-xs font-black tracking-widest uppercase text-cyan-400">{author}</span>
    </motion.div>
  );
}

const initialTestimonials = [
  { id: "12", author: "Marco G. (Modena)", text: "Abbiamo venduto un immobile in 4 giorni dall'annuncio. Il Reel di HomeTour ha fatto 10k views organiche su Instagram." },
  { id: "32", author: "Sara L. (Roma)", text: "L'assistente Concierge24 ha letteralmente azzerato le chiamate in reception per chiedere la password del WiFi." },
  { id: "53", author: "Studio Rossi", text: "Marketing di un altro livello. Le auto sembrano fotografate in studio. DriveMotion ha cambiato le nostre vendite." },
];

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const handleShuffle = () => {
    setTestimonials((prev) => {
      const newArr = [...prev];
      const first = newArr.shift();
      if (first) newArr.push(first);
      return newArr;
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[450px] flex justify-center items-center mt-12 overflow-hidden px-4">
      <div className="relative w-[300px] h-[350px]">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.id} id={t.id} author={t.author} testimonial={t.text} position={i === 0 ? "front" : i === 1 ? "middle" : "back"} handleShuffle={handleShuffle} />
        ))}
      </div>
    </div>
  );
}

// --- 3. MAIN APP ---
export default function App() {
  const handleVCardClick = () => {
    toast.success("Contatto salvato nella rubrica.");
    const link = document.createElement("a");
    link.href = "/contact.vcf";
    link.download = "Riccardo_Modena_RMStudio.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "9013a8d5-0901-42a0-b9e6-4c45553f960d"); 

    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData }).then(r => r.json());
      if (res.success) {
        toast.success("Messaggio inviato con successo! Ti risponderò entro 24
