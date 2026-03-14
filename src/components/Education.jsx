import React from 'react';
import { cvData } from '../cvData';
import { GraduationCap } from 'lucide-react';

const Education = () => {
  return (
    <section id="education" className="pt-12 section-reveal">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Academic <span className="heading-drama text-white/50">Foundation</span></h2>
        <div className="flex-grow h-px bg-gradient-to-r from-neon/50 to-transparent max-w-sm ml-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cvData.education.map((edu, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-layer p-8 relative overflow-hidden group magnetic">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 group-hover:text-neon">
              <GraduationCap size={120} strokeWidth={1} />
            </div>
            
            <div className="relative z-10">
              <div className="text-code text-neon/80 text-sm mb-3 inline-block bg-neon/10 px-2 py-0.5 rounded">
                CLASS OF {edu.period}
              </div>
              <h3 className="text-2xl font-bold text-ash mb-2 leading-tight">
                {edu.degree}
              </h3>
              <div className="text-lg text-ash/70 mb-4">{edu.institution}</div>
              
              <div className="inline-flex items-center gap-2 text-sm text-ash/50 pt-4 border-t border-white/10 w-full">
                <span className="font-fira">const finalGrade = "{edu.grade}";</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
