import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cvData } from '../cvData';
import { Terminal, Download, ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={heroRef} className="min-h-screen flex items-center pt-24 pb-12 section-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-fira text-neon mb-6 hero-elem magnetic">
            <Terminal size={12} />
            <span>sys.status === 'OPERATIONAL'</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 hero-elem text-ash">
            Engineering <br />
            <span className="heading-drama text-white/40 font-light pr-4 block mt-2">
              the future.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-ash/70 font-light max-w-2xl mb-8 hero-elem leading-relaxed">
            Hi, I'm <strong className="text-ash font-semibold">{cvData.name}</strong>. A {cvData.role} building scalable, real-time web applications with precision and high-performance design.
          </p>

          <div className="flex flex-wrap items-center gap-4 hero-elem">
            <a 
              href="#contact"
              className="px-6 py-3 bg-neon text-jet font-fira font-bold rounded hover:bg-neon/90 transition-colors uppercase magnetic flex items-center gap-2"
            >
              Initialize Contact <ArrowRight size={16} />
            </a>
            <a 
              href="JM  Currículo 2026.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent border border-white/20 text-ash hover:border-white/50 font-fira rounded transition-colors uppercase magnetic flex items-center gap-2"
            >
              <Download size={16} /> Download CV
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2 flex justify-start lg:justify-end hero-elem">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-layer overflow-hidden border border-neon/30 bg-jet shadow-[0_0_30px_rgba(0,255,65,0.15)] group magnetic">
            <div 
              className={`absolute inset-0 bg-cover bg-center ${!cvData.photo ? 'opacity-40 mix-blend-luminosity' : ''} group-hover:scale-105 transition-transform duration-700`}
              style={{ backgroundImage: `url('${cvData.photo || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/20 to-transparent opacity-80"></div>
            <div className="absolute bottom-4 left-4 font-fira text-neon/80 text-xs">
              <span className="block opacity-50 mb-1">// IDENT target</span>
              {cvData.github}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
