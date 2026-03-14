import React from 'react';
import { cvData } from '../cvData';

const Interests = () => {
  return (
    <section id="interests" className="pt-12 section-reveal">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Human <span className="heading-drama text-white/50">Element</span></h2>
        <div className="flex-grow h-px bg-gradient-to-r from-neon/50 to-transparent max-w-sm ml-4"></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {cvData.interests.map((interest, idx) => (
          <div 
            key={idx} 
            className="group relative px-6 py-4 bg-white/5 border border-white/10 rounded-layer overflow-hidden magnetic"
          >
            {/* Hover slide effect */}
            <div className="absolute inset-0 bg-neon/10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-magnetic"></div>
            
            <div className="relative z-10 font-fira text-ash group-hover:text-neon transition-colors duration-300">
              <span className="opacity-50 mr-2 text-xs">[{idx < 9 ? `0${idx+1}` : idx+1}]</span>
              {interest}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Interests;
