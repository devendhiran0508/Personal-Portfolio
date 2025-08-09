import { FrameWorks } from "./FrameWorks";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Target, Zap } from "lucide-react";
import { useScrollAnimation } from "./common/useScrollAnimation";

// Optimized animation variants with reduced complexity
const gridItemVariants = {
  initial: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoother animation
    }
  }
};

const hoverVariants = {
  hover: {
    y: -8,
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Memoized TechStackPopup Component
const TechStackPopup = memo(({ isOpen, onClose }) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Memoized tech stack data
  const allTechStack = useMemo(() => ({
    languages: ['C', 'Python', 'JavaScript', 'SQL', 'PHP', 'Dart'],
    webTechnologies: ['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'React.js', 'Node.js', 'Express.js', 'FastAPI', 'Django'],
    mobile: ['React Native', 'Flutter'],
    databases: ['MySQL', 'MongoDB', 'Firebase'],
    tools: ['Git', 'GitHub', 'Linux(Ubuntu)', 'Windows', 'VS Code', 'Postman'],
    cloud: ['AWS', 'Google Cloud', 'Azure'],
    aiMl: ['TensorFlow', 'PyTorch', 'OpenCV', 'Pandas', 'NumPy', 'Matplotlib'],
    hardware: ['Arduino', 'Raspberry Pi', 'IoT', 'Sensors'],
    design: ['Figma', 'Adobe XD', 'Canva', 'Blender', 'Unity', 'Spline', 'Three.js'],
    other: ['Streamlit', 'Jupyter', 'Anaconda', 'REST APIs', 'GraphQL', 'WebSockets']
  }), []);

  // Simplified scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-8 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
        initial={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0 }}
        animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 md:gap-3">
            <Zap className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
            Complete Tech Stack
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors duration-150"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Object.entries(allTechStack).map(([category, techs]) => (
            <div
              key={category}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 md:p-6 rounded-2xl border border-gray-700/30"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-3 md:mb-4 capitalize flex items-center">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/30 hover:bg-gray-600/50 hover:text-white transition-colors duration-150 cursor-pointer"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});

// Optimized SkillTag component
const SkillTag = memo(({ skill, index, inView }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.span
      className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 rounded-full text-xs sm:text-sm font-medium border border-purple-500/30 backdrop-blur-sm"
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
      animate={inView && !shouldReduceMotion ? { opacity: 1, scale: 1 } : inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : 0.8 + index * 0.05, duration: shouldReduceMotion ? 0 : 0.2 }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
    >
      {skill}
    </motion.span>
  );
});

// Optimized TechItem component
const TechItem = memo(({ tech, index, inView, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-gray-800/60 text-gray-300 rounded-lg border border-gray-700/40 hover:bg-gray-700/60 hover:text-white transition-colors duration-150 text-xs sm:text-sm font-medium cursor-pointer"
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : delay + index * 0.02, duration: shouldReduceMotion ? 0 : 0.2 }}
      whileHover={shouldReduceMotion ? {} : { x: 2 }}
    >
      {tech}
    </motion.div>
  );
});

// Optimized TechCategory component
const TechCategory = memo(({ title, techs, color, inView, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      className="space-y-3"
      initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
      transition={{ delay: shouldReduceMotion ? 0 : delay, duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-300 flex items-center mb-3">
        <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 ${color} rounded-full mr-2 sm:mr-3`}></span>
        {title}
      </h4>
      <div className="space-y-1.5 sm:space-y-2">
        {techs.map((tech, index) => (
          <TechItem key={tech} tech={tech} index={index} inView={inView} delay={delay + 0.1} />
        ))}
      </div>
    </motion.div>
  );
});

const About = () => {
  const shouldReduceMotion = useReducedMotion();
  
  // Optimized refs with less aggressive margins
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation({ margin: "-20px" });
  const { ref: bioRef, isInView: bioInView } = useScrollAnimation({ margin: "-30px" });
  const { ref: techRef, isInView: techInView } = useScrollAnimation({ margin: "-40px" });
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation({ margin: "-50px" });

  // Memoized data arrays
  const skills = useMemo(() => ['Problem Solver', 'Innovation Driver', 'Code Craftsman', 'Team Player'], []);
  const languages = useMemo(() => ['C', 'Python', 'JavaScript', 'SQL'], []);
  const webTechs = useMemo(() => ['HTML5', 'CSS3', 'Tailwind CSS', 'React.js', 'Node.js','Framer Motion'], []);
  const tools = useMemo(() => ['Git', 'GitHub','Unity','Blender','MySQL', 'MongoDB', 'AWS', 'Arduino'], []);

  return (
    <>
      <section className="min-h-screen mt-10 px-3 sm:px-5 py-12 sm:py-16 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        
        {/* Enhanced Title */}
        <motion.div
          ref={titleRef}
          className="text-center mb-12 sm:mb-16"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
        >
          <motion.h1 
            className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4"
            whileHover={shouldReduceMotion ? {} : { 
              scale: 1.05,
              textShadow: "0 0 25px rgba(147, 51, 234, 0.6)",
              transition: { duration: 0.3 }
            }}
          >
            About Me
          </motion.h1>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

          {/* Grid 1 - Main Bio Section */}
          <motion.div
            ref={bioRef}
            initial="initial"
            animate={bioInView ? "animate" : "initial"}
            variants={shouldReduceMotion ? {} : gridItemVariants}
            whileHover={shouldReduceMotion ? {} : "hover"}
            className="w-full p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl min-h-[18rem] sm:min-h-[20rem] md:min-h-[25rem] relative overflow-hidden group cursor-pointer"
          >
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-purple-900/30 to-blue-900/30 backdrop-blur-sm" />
            <img 
              src="/src/assets/backgroud1.jpg" 
              alt="background" 
              className="absolute inset-0 w-full h-full object-cover opacity-20" 
              loading="lazy"
              style={{ willChange: 'auto' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Simplified floating elements */}
            {!shouldReduceMotion && (
              <>
                <motion.div
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full opacity-60"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full opacity-60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </>
            )}
            
            <motion.div
              className="relative z-10 text-white text-center max-w-4xl mx-auto px-2 sm:px-4"
              variants={shouldReduceMotion ? {} : hoverVariants}
            >
              <motion.p 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
                animate={bioInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -10 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.4 }}
              >
                Hi, I'm Devendhiran
              </motion.p>
              <motion.p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-300 font-medium mb-3 sm:mb-4 md:mb-6"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={bioInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 10 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.4 }}
              >
                Full-Stack Developer & Tech Enthusiast
              </motion.p>
              <motion.p 
                className="text-neutral-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto px-1 sm:px-2"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={bioInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 10 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.4 }}
              >
                Passionate about crafting innovative digital solutions with modern technologies. 
                I transform complex ideas into elegant, user-friendly applications that make a real impact. 
                Always learning, always building, always pushing the boundaries of what's possible.
              </motion.p>
              
              {/* Skills highlights */}
              <motion.div 
                className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mt-4 sm:mt-6 md:mt-8 px-1 sm:px-2"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={bioInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 10 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.4 }}
              >
                {skills.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} inView={bioInView} />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Grid 2 - Tech Stack Section */}
          <motion.div
            ref={techRef}
            initial="initial"
            animate={techInView ? "animate" : "initial"}
            variants={shouldReduceMotion ? {} : gridItemVariants}
            whileHover={shouldReduceMotion ? {} : "hover"}
            className="w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl min-h-[20rem] relative overflow-hidden group cursor-pointer"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-black/90 backdrop-blur-sm"
              variants={shouldReduceMotion ? {} : hoverVariants}
            />
            
            <div className="relative z-10 h-full">
              {/* Header */}
              <div className="flex items-center justify-center mb-6 md:mb-8">
                <motion.div
                  className="p-2 sm:p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full mr-3 sm:mr-4 border border-purple-500/30"
                  whileHover={shouldReduceMotion ? {} : { rotate: 180, scale: 1.05 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <Zap size={18} className="text-purple-400 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Tech Stack</h2>
              </div>

              {/* Main content - Redesigned Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                {/* Left Side - Tech Categories in Card Style */}
                <div className="space-y-4 sm:space-y-5">
                  
                  {/* Languages Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent p-4 sm:p-5 rounded-xl border border-blue-500/20 backdrop-blur-sm"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                    animate={techInView ? { opacity: 1, x: 0 } : { opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -20 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, borderColor: "rgba(59, 130, 246, 0.4)" }}
                  >
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-300 flex items-center mb-3">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((tech, index) => (
                        <motion.div
                          key={tech}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-200 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 hover:text-white transition-colors duration-150 text-xs sm:text-sm font-medium cursor-pointer"
                          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                          animate={techInView ? { opacity: 1, scale: 1 } : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.2 + index * 0.03, duration: shouldReduceMotion ? 0 : 0.2 }}
                          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Web Technologies Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent p-4 sm:p-5 rounded-xl border border-green-500/20 backdrop-blur-sm"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                    animate={techInView ? { opacity: 1, x: 0 } : { opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -20 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, borderColor: "rgba(34, 197, 94, 0.4)" }}
                  >
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-green-300 flex items-center mb-3">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
                      Web Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {webTechs.map((tech, index) => (
                        <motion.div
                          key={tech}
                          className="px-3 py-1.5 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30 hover:bg-green-500/30 hover:text-white transition-colors duration-150 text-xs sm:text-sm font-medium cursor-pointer"
                          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                          animate={techInView ? { opacity: 1, scale: 1 } : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.3 + index * 0.03, duration: shouldReduceMotion ? 0 : 0.2 }}
                          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tools & Databases Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent p-4 sm:p-5 rounded-xl border border-purple-500/20 backdrop-blur-sm"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                    animate={techInView ? { opacity: 1, x: 0 } : { opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -20 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.3 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-purple-300 flex items-center mb-3">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
                      Tools & Databases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tools.map((tech, index) => (
                        <motion.div
                          key={tech}
                          className="px-3 py-1.5 bg-purple-500/20 text-purple-200 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 hover:text-white transition-colors duration-150 text-xs sm:text-sm font-medium cursor-pointer"
                          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                          animate={techInView ? { opacity: 1, scale: 1 } : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.4 + index * 0.03, duration: shouldReduceMotion ? 0 : 0.2 }}
                          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>

                {/* Right Side - FrameWorks component */}
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9, rotateY: -10 }}
                    animate={techInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.9, rotateY: shouldReduceMotion ? 0 : -10 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
                    className="w-full max-w-[300px] sm:max-w-sm md:max-w-md lg:max-w-full"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, rotateY: 2 }}
                  >
                    <FrameWorks />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Simplified floating elements */}
            {!shouldReduceMotion && (
              <>
                <motion.div
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-500 rounded-full opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full opacity-50"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </>
            )}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          ref={ctaRef}
          className="text-center mt-12 sm:mt-16"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        >
          <motion.a
            href="#contact"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-200 text-sm sm:text-base"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          >
            Let's Connect & Collaborate
            <Target size={16} className="ml-2 sm:w-[18px] sm:h-[18px]" />
          </motion.a>
        </motion.div>
      </section>
    </>
  );
};

export default About;