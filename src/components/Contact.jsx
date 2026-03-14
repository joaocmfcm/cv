import React from 'react';
import { cvData } from '../cvData';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="pt-32 pb-12 section-reveal">
      <div className="bg-surface border border-border/40 rounded-[3rem] p-10 md:p-20 shadow-apple text-center overflow-hidden relative">
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary">
            Let's talk.
          </h2>
          
          <p className="text-xl md:text-2xl text-secondary font-medium leading-relaxed">
            Currently based in {cvData.location}. Open for new opportunities and collaborations.
          </p>
          
          <div className="pt-6">
            <a 
              href={`mailto:${cvData.email}`} 
              className="inline-block px-10 py-5 bg-primary text-surface font-semibold rounded-full hover:scale-105 hover:shadow-apple-hover transition-all text-lg tracking-wide"
            >
              Initialize Contact
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 border-t border-border/40 mt-12 w-full max-w-sm mx-auto">
            <a 
              href={`https://${cvData.linkedin}`} 
              target="_blank" rel="noopener noreferrer"
              className="text-secondary font-semibold hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href={`https://github.com/${cvData.github}`} 
              target="_blank" rel="noopener noreferrer"
              className="text-secondary font-semibold hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-secondary/60 text-sm font-medium flex flex-col md:flex-row items-center justify-between px-4">
        <p>&copy; {currentYear} {cvData.name}. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Crafted with React</p>
      </div>
    </footer>
  );
};

export default Contact;
