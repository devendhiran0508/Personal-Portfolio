import About from "./components/About"
import Education from "./components/Education"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import ProjectsPage from "./components/ProjectPage"
import GeometricNetwork from "./components/GeometricNetwork"
import Contact from "./components/Contact";
import SparkleBurst from "./components/SparkleBurst";

export default function App() {
  return (
    <div className="relative">
      {/* Background Animation - stays behind all content */}
      <GeometricNetwork 
        nodeCount={60}
        nodeColor="rgba(139, 92, 246, 0.6)"
        connectionColor="rgba(139, 92, 246, 0.2)"
        maxConnectionDistance={120}
        nodeSpeed={0.3}
        nodeSize={{ min: 1, max: 3 }}
      />
      <div className="relative">
      {/* Your site content */}
      <SparkleBurst />
    </div>
      
      {/* All your content with higher z-index */}
      <div className="relative z-10">
        <section id="home" className="scroll-mt-24">
          <Header/>
          <HeroSection/>
        </section>
        
        <section id="about" className="scroll-mt-24">
          <About/>
        </section>
        
        <section id="education" className="scroll-mt-24">
          <Education/>
        </section>
        
        <section id="projects" className="scroll-mt-24">
          <ProjectsPage/>
        </section>
        
        <section id="projects" className="scroll-mt-24">
          <Contact/>
        </section>
        
      </div>
    </div>
  )
}