import React, { useState } from 'react';
import { cvData } from '../cvData';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = Object.keys(cvData.skills);
  
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section id="skills" className="pt-20 section-reveal">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Skills.</h2>
        <p className="text-xl text-secondary mt-2 font-medium">Tools of the trade.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex flex-row lg:flex-col flex-wrap gap-2 lg:min-w-[200px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`text-left px-5 py-3 rounded-2xl transition-all duration-300 font-medium text-sm lg:text-base
                ${activeCategory === cat || activeCategory === null 
                  ? 'bg-primary text-surface shadow-apple' 
                  : 'bg-surface text-secondary hover:text-primary'}`}
            >
              {formatCategoryName(cat)}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              cvData.skills[cat].map((skill, idx) => (
                 <span 
                   key={`${cat}-${idx}`} 
                   className={`px-5 py-3 text-sm md:text-base font-semibold rounded-2xl transition-all duration-500 
                     ${activeCategory === null || activeCategory === cat 
                        ? 'bg-surface border border-border/40 text-primary shadow-apple hover:shadow-apple-hover hover:-translate-y-1' 
                        : 'bg-surface/50 border-transparent text-secondary/30 scale-95'}`}
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
