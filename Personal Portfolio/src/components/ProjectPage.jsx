import { Projects } from "./Projects";
import portfolioImage from "../assets/portfolio.webp";
import smartImage from "../assets/smart.webp";
import dailydoImage from "../assets/dailydo.webp";
import storyImage from "../assets/story.webp";
import resumeImage from "../assets/resume.webp";

const ProjectsPage = () => {
  const projectsData = [
    // Page 1 Projects
    {
      title: "Smart Attendance System using Face Recognition",
      description: " Built a real-time, face recognition–based classroom attendance tool with 95% accuracy, cutting processing time by 50% and reducing administrative workload by 30%, while eliminating proxy attendance.",
      image: smartImage,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/ecommerce",
      technologies: ["Python", "OpenCV", "PyQt5", "Mediapipe", "Face-recognition","Numpy"],
      //stats: { stars: 45, forks: 12, views: "1.2k" }
    },
    {
      title: " ResumePro  – AI Resume Analyzer with Streamlit + Gemini",
      description: "Built an AI-powered resume analysis tool using Streamlit with Gemini API integration to deliver role-specific feedback. Integrated PyPDF2 for efficient resume parsing and implemented ATS optimization to enhance keyword alignment and structure.",
      image: resumeImage,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/devendhiran0508/ResumePro",
      technologies: ["Python", "Streamlit", "PyPDF2", "Gemini API"],
      //stats: { stars: 32, forks: 8, views: "890" }
    },
    {
      title: "AI Story Generator using Gemini API ",
      description: "Created a customizable storytelling app where users choose genre, keywords, and episode format. Boosted user engagement by 20% with interactive and personalized content generation.",
      image: storyImage,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/devendhiran0508/Story-Generator",
      technologies: ["React.js", "Vite", "Gemini API", "CSS"],
      //stats: { stars: 28, forks: 6, views: "654" }
    },
    // {
    //   title: "Social Media Clone",
    //   description: "A feature-rich social media platform with posts, comments, likes, real-time messaging, and story features similar to Instagram.",
    //   image: socialImage,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/social",
    //   technologies: ["React Native", "Firebase", "Redux", "WebRTC"],
    //   //stats: { stars: 67, forks: 23, views: "2.1k" }
    // },
    {
      title: "DailyDO",
      description: "A clean and intuitive Task Management Application built with HTML, CSS, and JavaScript. This project demonstrates modern web development fundamentals while providing a fully functional todo list that helps users organize their daily tasks efficiently.",
      image: dailydoImage,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/devendhiran0508/DailyDo",
      technologies: ["HTML", "CSS", "JavaScript"],
      //stats: { stars: 89, forks: 34, views: "3.4k" }
    },
    {
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website built with cutting-edge technologies and smooth animations to showcase projects and skills.",
      image: portfolioImage,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/portfolio",
      technologies: ["React.js", "Vite", "Tailwind", "Framer Motion"],
      //stats: { stars: 15, forks: 4, views: "432" }
    },
    
    // Page 2 Projects
    // {
    //   title: "Data Visualization Dashboard",
    //   description: "An interactive data visualization platform with real-time charts, custom filters, and comprehensive analytics for business intelligence.",
    //   image: project2,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/dataviz",
    //   technologies: ["D3.js", "React", "Python", "Pandas", "PostgreSQL"],
    //   stats: { stars: 52, forks: 18, views: "1.8k" }
    // },
    // {
    //   title: "Blockchain Explorer",
    //   description: "A comprehensive blockchain explorer with transaction tracking, wallet analysis, and smart contract interaction capabilities.",
    //   image: weatherImage,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/blockchain",
    //   technologies: ["Web3.js", "Ethereum", "Solidity", "Node.js", "Redis"],
    //   stats: { stars: 78, forks: 29, views: "2.9k" }
    // },
    // {
    //   title: "Video Streaming Platform",
    //   description: "A Netflix-like streaming platform with user profiles, recommendations, video encoding, and subscription management.",
    //   image: socialImage,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/streaming",
    //   technologies: ["React", "AWS", "FFmpeg", "Node.js", "MongoDB"],
    //   stats: { stars: 134, forks: 47, views: "4.2k" }
    // },
    // {
    //   title: "IoT Home Automation",
    //   description: "Smart home automation system with sensor integration, mobile app control, and energy consumption monitoring.",
    //   image: aichatImage,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/iot-home",
    //   technologies: ["Arduino", "React Native", "MQTT", "InfluxDB", "Python"],
    //   stats: { stars: 41, forks: 15, views: "1.1k" }
    // },
    // {
    //   title: "Machine Learning Pipeline",
    //   description: "An end-to-end ML pipeline for predictive analytics with data preprocessing, model training, and automated deployment.",
    //   image: portfolioImage,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/ml-pipeline",
    //   technologies: ["Python", "Scikit-learn", "Docker", "Kubernetes", "MLflow"],
    //   stats: { stars: 96, forks: 38, views: "3.7k" }
    // },
    // {
    //   title: "Real-time Chat Application",
    //   description: "A modern chat application with end-to-end encryption, file sharing, voice messages, and multi-platform support.",
    //   image: eCommerceImage,
    //   liveUrl: "https://example.com",
    //   githubUrl: "https://github.com/username/chat-app",
    //   technologies: ["Socket.io", "React", "Express", "MongoDB", "WebRTC"],
    //   stats: { stars: 63, forks: 22, views: "2.3k" }
    // }
  ];

  return <Projects data={projectsData} />;
};

export default ProjectsPage;