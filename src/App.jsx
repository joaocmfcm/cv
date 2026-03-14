import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Interests from './components/Interests';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const comp = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Intro animations
      gsap.from('.section-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'apple',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.section-reveal',
          start: 'top 85%',
        }
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="min-h-screen selection:bg-primary selection:text-surface pb-20 relative bg-background text-primary">
      <div className="noise-overlay"></div>
      
      <Navbar />
      
      <main className="container mx-auto px-6 max-w-5xl space-y-32">
        <Hero />
        <Experience />
        <Skills />
        <Education />
        <Interests />
        <Contact />
      </main>
    </div>
  );
}

export default App;
