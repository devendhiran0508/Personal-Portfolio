"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useScrollAnimation } from "./common/useScrollAnimation";

// Memoized animation variants to prevent recreation
const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.9,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 100,
    scale: 0.8,
    filter: "blur(5px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const dotVariants = {
  hidden: { 
    scale: 0,
    rotate: -180,
    opacity: 0
  },
  visible: { 
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.2
    }
  },
  hover: {
    scale: 1.2,
    boxShadow: "0 0 25px rgba(147, 51, 234, 0.6)",
    transition: {
      duration: 0.3
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 50,
    rotateY: -15,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      delay: 0.1
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Memoized TimelineDot component
const TimelineDot = React.memo(({ isEven, itemInView, index }) => {
  const gradientClass = useMemo(() => 
    isEven 
      ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-purple-500/25" 
      : "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/25",
    [isEven]
  );

  const pulseAnimation = useMemo(() => ({
    scale: [1, 1.2, 1],
  }), []);

  const pulseTransition = useMemo(() => ({
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
    delay: index * 0.5
  }), [index]);

  return (
    <motion.div 
      className={`relative flex-shrink-0 w-12 h-12 ${gradientClass} rounded-full flex items-center justify-center shadow-lg z-10`}
      initial="hidden"
      animate={itemInView ? "visible" : "hidden"}
      variants={dotVariants}
      whileHover="hover"
      whileTap={{ scale: 0.9 }}
    >
      <motion.div 
        className="w-5 h-5 bg-white rounded-full"
        animate={itemInView ? pulseAnimation : { scale: 1 }}
        transition={pulseTransition}
      />
    </motion.div>
  );
});

TimelineDot.displayName = 'TimelineDot';

// Memoized MobileTimelineDot component
const MobileTimelineDot = React.memo(({ itemInView }) => {
  const pulseAnimation = useMemo(() => ({
    scale: [1, 1.2, 1],
  }), []);

  const pulseTransition = useMemo(() => ({
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }), []);

  return (
    <motion.div 
      className="relative flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 mr-6"
      initial="hidden"
      animate={itemInView ? "visible" : "hidden"}
      variants={dotVariants}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="w-3 h-3 bg-white rounded-full"
        animate={itemInView ? pulseAnimation : { scale: 1 }}
        transition={pulseTransition}
      />
    </motion.div>
  );
});

MobileTimelineDot.displayName = 'MobileTimelineDot';

// Memoized ContentCard component
const ContentCard = React.memo(({ item, itemInView, isDesktop = false, isEven = true, position = 'left' }) => {
  const cardClasses = useMemo(() => {
    if (!isDesktop) {
      return "bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800 shadow-xl";
    }
    return `bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800 shadow-xl ${
      position === 'left' ? 'ml-auto' : 'mr-auto'
    } max-w-lg`;
  }, [isDesktop, position]);

  const titleClasses = useMemo(() => 
    isDesktop 
      ? "text-2xl lg:text-3xl font-bold text-white mb-3"
      : "text-xl sm:text-2xl font-bold text-white mb-2",
    [isDesktop]
  );

  const timeClasses = useMemo(() => {
    const baseClasses = "font-semibold";
    const sizeClasses = isDesktop ? "text-xl mb-6" : "text-lg mb-4";
    const colorClasses = isEven ? "text-purple-400" : "text-blue-400";
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  }, [isDesktop, isEven]);

  const contentClasses = useMemo(() => 
    isDesktop 
      ? "text-neutral-300 leading-relaxed text-lg"
      : "text-neutral-300 leading-relaxed",
    [isDesktop]
  );

  const initialAnimation = useMemo(() => ({
    opacity: 0,
    x: isDesktop ? (position === 'left' ? -100 : 100) : 0,
    rotateY: isDesktop ? (position === 'left' ? -15 : 15) : 0
  }), [isDesktop, position]);

  const animateAnimation = useMemo(() => ({
    opacity: itemInView ? 1 : 0,
    x: itemInView ? 0 : (isDesktop ? (position === 'left' ? -100 : 100) : 0),
    rotateY: 0
  }), [itemInView, isDesktop, position]);

  const titleInitial = useMemo(() => ({ 
    opacity: 0, 
    x: position === 'right' ? 20 : -20 
  }), [position]);

  const titleAnimate = useMemo(() => ({ 
    opacity: itemInView ? 1 : 0, 
    x: itemInView ? 0 : (position === 'right' ? 20 : -20)
  }), [itemInView, position]);

  return (
    <motion.div 
      className={cardClasses}
      initial={initialAnimation}
      animate={animateAnimation}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.h3 
        className={titleClasses}
        initial={titleInitial}
        animate={titleAnimate}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {item.title}
      </motion.h3>
      <motion.div 
        className={timeClasses}
        initial={titleInitial}
        animate={titleAnimate}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {item.time}
      </motion.div>
      {item.content && (
        <motion.div 
          className={contentClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {item.content}
        </motion.div>
      )}
    </motion.div>
  );
});

ContentCard.displayName = 'ContentCard';

// Memoized TimelineItem component
const TimelineItem = React.memo(({ item, index, totalHeight }) => {
  const { ref: itemRef, isInView: itemInView } = useScrollAnimation({ 
    margin: "-80px" 
  });

  const isEven = useMemo(() => index % 2 === 0, [index]);

  return (
    <motion.div 
      ref={itemRef}
      className="relative mb-16 md:mb-24 last:mb-0"
      initial="hidden"
      animate={itemInView ? "visible" : "hidden"}
      variants={itemVariants}
    >
      {/* Mobile Layout */}
      <div className="flex md:hidden items-start">
        <MobileTimelineDot itemInView={itemInView} />
        
        <div className="flex-1 pb-8">
          <ContentCard 
            item={item} 
            itemInView={itemInView} 
            isDesktop={false} 
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center">
        {isEven ? (
          // Left side content
          <>
            <div className="w-1/2 pr-12">
              <ContentCard 
                item={item} 
                itemInView={itemInView} 
                isDesktop={true}
                isEven={isEven}
                position="left"
              />
            </div>
            
            <TimelineDot 
              isEven={isEven} 
              itemInView={itemInView} 
              index={index} 
            />
            
            <div className="w-1/2 pl-12">
              {/* Empty space for alternating layout */}
            </div>
          </>
        ) : (
          // Right side content
          <>
            <div className="w-1/2 pr-12">
              {/* Empty space for alternating layout */}
            </div>
            
            <TimelineDot 
              isEven={isEven} 
              itemInView={itemInView} 
              index={index} 
            />
            
            <div className="w-1/2 pl-12">
              <ContentCard 
                item={item} 
                itemInView={itemInView} 
                isDesktop={true}
                isEven={isEven}
                position="right"
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
});

TimelineItem.displayName = 'TimelineItem';

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  // Individual scroll animations for title and container
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation({ margin: "-100px" });
  const { ref: timelineRef, isInView: timelineInView } = useScrollAnimation({ margin: "-50px" });

  // Memoized height calculation with useCallback
  const calculateHeight = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  useEffect(() => {
    calculateHeight();
    
    // Debounced resize handler
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [calculateHeight]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Memoized style objects
  const timelineStyle = useMemo(() => ({ 
    transformOrigin: "top" 
  }), []);

  const timelineInitial = useMemo(() => ({ 
    opacity: 0, 
    scaleY: 0, 
    height: 0 
  }), []);

  const timelineAnimate = useMemo(() => ({ 
    opacity: timelineInView ? 1 : 0, 
    scaleY: timelineInView ? 1 : 0, 
    height: timelineInView ? height + "px" : 0 
  }), [timelineInView, height]);

  const timelineTransition = useMemo(() => ({ 
    duration: 1.2, 
    ease: "easeOut" 
  }), []);

  const titleHoverAnimation = useMemo(() => ({ 
    scale: 1.05,
    textShadow: "0 0 25px rgba(147, 51, 234, 0.5)",
    transition: { duration: 0.3 }
  }), []);

  return (
    <motion.div
      className="w-full min-h-screen py-12 md:py-20"
      ref={containerRef}
    >
      {/* Container with max width and centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          ref={titleRef}
          className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-12 md:mb-20 text-center"
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={titleVariants}
          whileHover={titleHoverAnimation}
        >
          Education
        </motion.h2>
        
        <div ref={ref} className="relative">
          {/* Timeline line container */}
          <motion.div
            ref={timelineRef}
            className="absolute left-4 md:left-1/2 md:-translate-x-0.5 top-0 w-0.5 bg-gradient-to-b from-transparent from-[0%] via-neutral-600 via-[10%] to-transparent to-[90%]"
            initial={timelineInitial}
            animate={timelineAnimate}
            transition={timelineTransition}
            style={timelineStyle}
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 rounded-full"
            />
          </motion.div>

          {/* Render timeline items */}
          {data.map((item, index) => (
            <TimelineItem 
              key={`${item.title}-${index}`}
              item={item} 
              index={index}
              totalHeight={height}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};