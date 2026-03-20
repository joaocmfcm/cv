import React, { useState } from 'react';
import { cvData } from '../cvData';
import { Code2, MonitorSmartphone, Network, Wrench } from 'lucide-react';
import { getSkillIcon } from './SkillIcon';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = Object.keys(cvData.skills);
  
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'frontend': return <MonitorSmartphone size={18} />;
      case 'architecture': return <Network size={18} />;
      case 'engineering': return <Wrench size={18} />;
      default: return null;
    }
  };


  return (
    <section id="skills" className="pt-20 section-reveal">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">
          Skills.
        </h2>
        <p className="text-xl text-secondary mt-2 font-medium flex items-center gap-2">
          <Code2 size={20} className="text-secondary/80" /> Tools of the trade.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex flex-row lg:flex-col flex-wrap gap-2 lg:min-w-[200px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`text-left px-5 py-3 rounded-2xl transition-all duration-300 font-medium text-sm lg:text-base flex items-center gap-3
                ${activeCategory === cat || activeCategory === null 
                  ? 'bg-primary text-surface shadow-apple' 
                  : 'bg-surface text-secondary hover:text-primary'}`}
            >
              <span className={activeCategory === cat || activeCategory === null ? 'text-surface/80' : 'text-secondary/70'}>
                {getCategoryIcon(cat)}
              </span>
              {formatCategoryName(cat)}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              cvData.skills[cat].map((skill, idx) => {
                const icon = getSkillIcon(skill);
                return (
                  <span 
                    key={`${cat}-${idx}`} 
                    className={`px-5 py-3 text-sm md:text-base font-semibold rounded-2xl transition-all duration-500 flex items-center gap-2.5
                      ${activeCategory === null || activeCategory === cat 
                         ? 'bg-surface border border-border/40 text-primary shadow-apple hover:shadow-apple-hover hover:-translate-y-1' 
                         : 'bg-surface/50 border-transparent text-secondary/30 scale-95'}`}
                  >
                    {icon}
                    {skill}
                  </span>
                );
              })
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

