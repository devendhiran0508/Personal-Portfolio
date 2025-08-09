import { motion } from 'framer-motion';
import { useScrollAnimation } from './useScrollAnimation';


const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fadeInUp',
  delay = 0 
}) => {
  const { ref, isInView } = useScrollAnimation();

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 60 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -60 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -60 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 60 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    staggerContainer: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    }
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={selectedAnimation}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;