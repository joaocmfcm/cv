import React from 'react';
import { cvData } from '../cvData';
import { GitCommit } from 'lucide-react';

const Experience = () => {
  return (
    <section id="experience" className="pt-12 section-reveal">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Professional <span className="heading-drama text-white/50">Experience</span></h2>
        <div className="flex-grow h-px bg-gradient-to-r from-neon/50 to-transparent max-w-md ml-4"></div>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-16">
        {cvData.experience.map((exp, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12 group">
            {/* Timeline dot */}
            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 bg-jet border border-neon rounded-full group-hover:bg-neon transition-colors duration-300"></div>
            
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl font-bold text-ash">{exp.role}</h3>
              <span className="text-code text-neon/80 text-sm mt-1 md:mt-0 bg-neon/10 px-2 py-0.5 rounded">{exp.period}</span>
            </div>
            
            <div className="text-xl font-medium text-ash/80 mb-4">{exp.company}</div>
            
            <p className="text-ash/60 mb-6 max-w-3xl leading-relaxed">
              {exp.description}
            </p>

            {exp.achievements.length > 0 && (
              <ul className="space-y-3 mb-6">
                {exp.achievements.map((achieve, i) => (
                  <li key={i} className="flex items-start gap-3 text-ash/70 group/item">
                    <GitCommit size={16} className="text-neon/50 shrink-0 mt-1 group-hover/item:text-neon transition-colors" />
                    <span className="leading-snug">{achieve}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2">
              {exp.stack.map(tech => (
                <span key={tech} className="px-2.5 py-1 text-xs font-fira bg-white/5 border border-white/10 rounded-sm text-ash/80 hover:border-neon/50 hover:text-neon transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
