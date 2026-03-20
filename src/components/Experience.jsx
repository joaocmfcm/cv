import React from 'react';
import { cvData } from '../cvData';
import { Briefcase, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import { getSkillIcon } from './SkillIcon';


const Experience = () => {
  return (
    <section id="experience" className="pt-20 section-reveal">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">
          Experience.
        </h2>
        <p className="text-xl text-secondary mt-2 font-medium flex items-center gap-2">
          <Briefcase size={20} className="text-secondary/80" /> Companies I've helped build.
        </p>
      </div>

      <div className="relative border-l-2 border-border/60 ml-4 md:ml-8 space-y-12 pb-8">
        {cvData.experience.map((exp, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-sm group-hover:scale-125 transition-transform duration-300"></div>

            <div className="bg-surface border border-border/40 rounded-[2rem] p-8 shadow-apple hover:shadow-apple-hover transition-shadow duration-500">
              
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-primary tracking-tight">{exp.role}</h3>
                  <div className="text-lg font-medium text-primary/60 mt-1 flex items-center gap-2">
                    <Building2 size={18} /> {exp.company}
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary/70 bg-background px-3 py-1.5 rounded-full whitespace-nowrap border border-border/40 flex items-center gap-2 max-h-8">
                  <Calendar size={14} /> {exp.period}
                </span>
              </div>
              
              <p className="text-primary/70 mb-6 max-w-3xl leading-relaxed">
                {exp.description}
              </p>

              {exp.achievements.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {exp.achievements.map((achieve, i) => (
                    <li key={i} className="flex items-start gap-4 text-primary/80">
                      <CheckCircle2 size={16} className="text-primary/40 shrink-0 mt-1" />
                      <span className="leading-relaxed">{achieve}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2 pt-5 border-t border-border/40">
                {exp.stack.map(tech => (
                  <span key={tech} className="px-3 py-1.5 text-sm font-medium bg-background border border-border/40 text-primary/70 rounded-full cursor-default hover:bg-border/30 transition-colors flex items-center gap-1.5">
                    {getSkillIcon(tech, 14)}
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
