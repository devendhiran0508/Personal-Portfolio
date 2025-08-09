// SectionTracker.jsx
import { useInView } from 'react-intersection-observer';

export const useSectionInView = () => {
  const [refHome, inViewHome] = useInView({ threshold: 0.6 });
  const [refAbout, inViewAbout] = useInView({ threshold: 0.6 });

  const currentSection = inViewAbout ? 'about' : 'home';

  return { refHome, refAbout, currentSection };
};
