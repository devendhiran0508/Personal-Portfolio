// import { OrbitingCircles } from "./OrbitingCircles";

// export function FrameWorks() {
//   const skills = [
//     "c",
//     "html",
//     "css",  
//     "javascript",
//     "git",
//     "react",
//     "node-js",
//     "tailwindcss",
//     "unity",
//     "blender",
//     "python",
//   ]
//   return (
//     <div className="relative w-[100px] h-[15rem] flex items-center justify-center overflow-visible mx-auto">
//       <OrbitingCircles iconSize={40}>
//         {skills.map((skill,index) => (
//           <Icons key={index} src={`src/assets/logos/${skill}.svg`} />
//         ))}
//       </OrbitingCircles>
//       <OrbitingCircles iconSize={30} radius={70} reverse speed={2}>
//         {skills.reverse().map((skill,index) => (
//           <Icons key={index} src={`src/assets/logos/${skill}.svg`} />
//         ))}
//       </OrbitingCircles>
//     </div>
//   );
// }

// const Icons=({src}) =>(
//   <img src={src} className="duration-200 rounded-sm hover:scale-110"/>
// );

import { useEffect, useState, useMemo } from "react";
import { OrbitingCircles } from "./OrbitingCircles";

export function FrameWorks() {
  const skills = [
    "c",
    "html",
    "css",
    "javascript",
    "git",
    "react",
    "node-js",
    "tailwindcss",
    "unity",
    "blender",
    "python",
  ];

  const reversedSkills = useMemo(() => [...skills].reverse(), [skills]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Responsive values
  const outerRadius = isMobile ? 125 : 140;
  const outerIconSize = isMobile ? 30 : 40;

  const innerRadius = isMobile ? 70 : 70;
  const innerIconSize = isMobile ? 24 : 30;

  return (
    <div className="relative w-[250px] sm:w-[350px] h-[300px] sm:h-[350px] flex items-center justify-center overflow-visible mx-auto">
      {/* Outer orbit */}
      <OrbitingCircles iconSize={outerIconSize} radius={outerRadius}>
        {skills.map((skill, index) => (
          <Icons key={index} src={`/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>

      {/* Inner orbit */}
      <OrbitingCircles iconSize={innerIconSize} radius={innerRadius} reverse speed={2}>
        {reversedSkills.map((skill, index) => (
          <Icons key={`reverse-${index}`} src={`/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icons = ({ src }) => (
  <img
    src={src}
    alt="tech-icon"
    className="duration-200 rounded-sm hover:scale-110"
  />
);
