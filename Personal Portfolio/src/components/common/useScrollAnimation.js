import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false, // This is key - allows animations to repeat
    margin: "-100px",
    ...options
  });

  return { ref, isInView };
};