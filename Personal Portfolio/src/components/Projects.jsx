"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ExternalLink, Github, Eye, Code, Star, GitFork, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from './common/AnimatedSection';
import { useScrollAnimation } from "./common/useScrollAnimation";

export const Projects = ({ data }) => {
  const { ref: containerRef, isInView } = useScrollAnimation();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const projectsPerPage = 6;
  const totalPages = Math.ceil((data?.length || 0) / projectsPerPage);
  
  // Get current projects for the page
  const getCurrentProjects = () => {
    const start = currentPage * projectsPerPage;
    return data?.slice(start, start + projectsPerPage) || [];
  };

  // Page navigation with direction tracking
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (pageIndex) => {
    if (pageIndex !== currentPage) {
      setDirection(pageIndex > currentPage ? 1 : -1);
      setCurrentPage(pageIndex);
    }
  };

  // Scroll-triggered animations
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Page transition animations
  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  // Card animations with stagger
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.9,
      rotateY: 15
    },
    visible: (index) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      rotateY: 5,
      boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      filter: "brightness(1.1)",
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  // Navigation button animations
  const navButtonVariants = {
    rest: { 
      scale: 1, 
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(147, 51, 234, 0.3)"
    },
    hover: { 
      scale: 1.1,
      backgroundColor: "rgba(147, 51, 234, 0.2)",
      borderColor: "rgba(147, 51, 234, 0.8)",
      boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const pageIndicatorVariants = {
    inactive: { 
      scale: 0.8,
      opacity: 0.5,
      backgroundColor: "rgba(255, 255, 255, 0.2)"
    },
    active: { 
      scale: 1.2,
      opacity: 1,
      backgroundColor: "rgba(147, 51, 234, 1)",
      boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen py-12 md:py-20 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden"
    >
      {/* Background animated elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2 
            className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 30px rgba(147, 51, 234, 0.8)",
              transition: { duration: 0.3 }
            }}
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto"
            variants={subtitleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            A showcase of my recent work and creative solutions 
          </motion.p>
        </div>

        {/* Projects Grid with Page Transitions */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {getCurrentProjects().map((project, index) => (
                <motion.div
                  key={`${currentPage}-${index}`}
                  className="group relative h-full"
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onHoverStart={() => setHoveredProject(index)}
                  onHoverEnd={() => setHoveredProject(null)}
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-xl h-full flex flex-col"
                    variants={hoverVariants}
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex-shrink-0">
                      {project.image ? (
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-fill"
                          variants={imageVariants}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback content */}
                      <motion.div 
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-blue-500/30"
                        variants={imageVariants}
                        style={{ display: project.image ? 'none' : 'flex' }}
                      >
                        <Code size={48} className="text-white/70" />
                      </motion.div>
                      
                      {/* Overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="flex space-x-4">
                          {project.liveUrl && (
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-purple-500/50 transition-colors"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <ExternalLink size={20} />
                            </motion.a>
                          )}
                          {project.githubUrl && (
                            <motion.a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-blue-500/50 transition-colors"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Github size={20} />
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {project.title}
                      </h3>
                      
                      <p className="text-neutral-300 mb-4 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      {/* Project Stats */}
                      {project.stats && (
                        <div className="flex items-center space-x-4 mb-4 text-sm text-neutral-400">
                          {project.stats.stars && (
                            <motion.div 
                              className="flex items-center space-x-1"
                              whileHover={{ scale: 1.1, color: "#fbbf24" }}
                            >
                              <Star size={14} className="text-yellow-400" />
                              <span>{project.stats.stars}</span>
                            </motion.div>
                          )}
                          {project.stats.forks && (
                            <motion.div 
                              className="flex items-center space-x-1"
                              whileHover={{ scale: 1.1, color: "#60a5fa" }}
                            >
                              <GitFork size={14} className="text-blue-400" />
                              <span>{project.stats.forks}</span>
                            </motion.div>
                          )}
                          {project.stats.views && (
                            <motion.div 
                              className="flex items-center space-x-1"
                              whileHover={{ scale: 1.1, color: "#4ade80" }}
                            >
                              <Eye size={14} className="text-green-400" />
                              <span>{project.stats.views}</span>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.technologies?.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-neutral-800/50 text-neutral-300 border border-neutral-700"
                            whileHover={{ 
                              scale: 1.05,
                              backgroundColor: "rgba(147, 51, 234, 0.3)",
                              borderColor: "rgba(147, 51, 234, 0.5)",
                              transition: { duration: 0.2 }
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + (techIndex * 0.1) }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stylish Navigation Controls */}
        {totalPages > 1 && (
          <motion.div 
            className="flex items-center justify-center space-x-6 mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {/* Previous Button */}
            <motion.button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`p-3 rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
                currentPage === 0 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              }`}
              variants={navButtonVariants}
              initial="rest"
              whileHover={currentPage > 0 ? "hover" : "rest"}
              whileTap={currentPage > 0 ? "tap" : "rest"}
            >
              <ChevronLeft size={24} className="text-white" />
            </motion.button>

            {/* Page Indicators */}
            <div className="flex space-x-3">
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToPage(index)}
                  className="w-3 h-3 rounded-full border border-purple-400 transition-all duration-300"
                  variants={pageIndicatorVariants}
                  animate={currentPage === index ? "active" : "inactive"}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-3 rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
                currentPage === totalPages - 1 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              }`}
              variants={navButtonVariants}
              initial="rest"
              whileHover={currentPage < totalPages - 1 ? "hover" : "rest"}
              whileTap={currentPage < totalPages - 1 ? "tap" : "rest"}
            >
              <ChevronRight size={24} className="text-white" />
            </motion.button>
          </motion.div>
        )}

        {/* Page Info */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <p className="text-neutral-500 text-sm">
            Showing {getCurrentProjects().length} of {data?.length || 0} projects
          </p>
        </motion.div>
      </div>
    </div>
  );
};