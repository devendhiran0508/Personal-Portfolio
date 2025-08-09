import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GlowCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gray-900 overflow-hidden">
      {/* Trailing Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-6 h-6 rounded-full bg-pink-500 shadow-lg"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white text-4xl font-bold">
        Trailing Dot Cursor 🎯
      </div>
    </div>
  );
}
