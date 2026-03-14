import React, { useState } from 'react';
import { cvData } from '../cvData';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = Object.keys(cvData.skills);

  return (
    <section id="skills" className="pt-12 section-reveal">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Technical <span className="heading-drama text-white/50">Arsenal</span></h2>
        <div className="flex-grow h-px bg-gradient-to-r from-neon/50 to-transparent max-w-sm ml-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`text-left px-4 py-3 rounded-layer border transition-all duration-300 font-fira text-sm uppercase tracking-wider
                ${activeCategory === cat || activeCategory === null 
                  ? 'border-neon/30 text-neon bg-neon/10' 
                  : 'border-white/10 text-ash/40 hover:text-ash/70'}`}
            >
              {`<${cat} />`}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              cvData.skills[cat].map((skill, idx) => (
                 <span 
                   key={`${cat}-${idx}`} 
                   className={`px-4 py-2 text-sm font-medium rounded-layer border transition-all duration-500 magnetic
                     ${activeCategory === null || activeCategory === cat 
                        ? 'border-white/20 bg-white/5 text-ash hover:border-neon hover:text-neon shadow-[0_0_15px_rgba(0,255,65,0)] hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                        : 'border-white/5 bg-transparent text-ash/20 opacity-50 scale-95'}`}
                 >
                   {skill}
                 </span>
              ))
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
