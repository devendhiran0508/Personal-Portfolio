// // components/SparkleBurst.jsx
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const Sparkle = ({ x, y, id }) => {
//   const angle = Math.random() * 2 * Math.PI;
//   const distance = Math.random() * 60 + 20;

//   const deltaX = Math.cos(angle) * distance;
//   const deltaY = Math.sin(angle) * distance;

//   return (
//     <motion.div
//       key={id}
//       className="w-2 h-2 bg-white rounded-full fixed pointer-events-none z-50"
//       initial={{ x, y, opacity: 1, scale: 1 }}
//       animate={{
//         x: x + deltaX,
//         y: y + deltaY,
//         opacity: 0,
//         scale: Math.random() + 0.5,
//       }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//     />
//   );
// };

// export default function SparkleBurst() {
//   const [sparkles, setSparkles] = useState([]);

//   useEffect(() => {
//     const handleClick = (e) => {
//       const newSparkles = Array.from({ length: 5 }).map((_, index) => ({
//         id: `${Date.now()}-${index}`,
//         x: e.clientX,
//         y: e.clientY,
//       }));
//       setSparkles((prev) => [...prev, ...newSparkles]);

//       // Remove sparkles after animation
//       setTimeout(() => {
//         setSparkles((prev) => prev.slice(newSparkles.length));
//       }, 800);
//     };

//     window.addEventListener("click", handleClick);
//     return () => window.removeEventListener("click", handleClick);
//   }, []);

//   return (
//     <>
//       {sparkles.map(({ id, x, y }) => (
//         <Sparkle key={id} id={id} x={x} y={y} />
//       ))}
//     </>
//   );
// }


// components/HeartBurst.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Heart = ({ x, y, id }) => {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * 50 + 30;

  const deltaX = Math.cos(angle) * distance;
  const deltaY = Math.sin(angle) * distance;

  const colors = ["#ff69b4", "#ff4d6d", "#ff85a1", "#ff9aa2"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      key={id}
      className="fixed z-50 text-[14px] pointer-events-none"
      initial={{ x, y, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x: x + deltaX,
        y: y + deltaY,
        opacity: 0,
        scale: 1.5,
        rotate: Math.random() * 360,
      }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ color: randomColor }}
    >
      ❤️
    </motion.div>
  );
};

export default function SparkleBurst() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newHearts = Array.from({ length: 5 }).map((_, index) => ({
        id: `${Date.now()}-${index}`,
        x: e.clientX,
        y: e.clientY,
      }));
      setHearts((prev) => [...prev, ...newHearts]);

      setTimeout(() => {
        setHearts((prev) => prev.slice(newHearts.length));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {hearts.map(({ id, x, y }) => (
        <Heart key={id} id={id} x={x} y={y} />
      ))}
    </>
  );
}
