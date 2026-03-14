import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cvData } from '../cvData';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'apple',
        delay: 0.1
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={heroRef} className="min-h-screen flex items-center pt-28 pb-12 section-reveal relative">
      {/* Soft abstract blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16 w-full relative z-10">
        
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-medium text-secondary mb-3 hero-elem tracking-tight">
            {cvData.role}
          </h2>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 hero-elem text-primary leading-[1.05]">
            Building <br className="hidden md:block" />
            <span className="text-primary/50">scalable systems.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary font-medium mb-10 hero-elem leading-relaxed max-w-xl mx-auto md:mx-0">
            {cvData.about}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 hero-elem">
            <a 
              href="#contact"
              className="px-8 py-4 bg-primary text-surface font-semibold rounded-full hover:scale-105 hover:shadow-apple-hover transition-all text-sm tracking-wide"
            >
              Contact Me
            </a>
            <a 
              href="JM  Currículo 2026.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-surface border border-border text-primary font-semibold rounded-full hover:bg-border/30 hover:scale-[1.02] transition-all text-sm tracking-wide shadow-apple"
            >
              View Résumé
            </a>
          </div>
        </div>

        <div className="hero-elem">
          <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden shadow-apple-hover ring-1 ring-border/50">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
              style={{ backgroundImage: `url('${cvData.photo}')` }}
            ></div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
