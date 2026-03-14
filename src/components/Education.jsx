import React from 'react';
import { cvData } from '../cvData';

const Education = () => {
  return (
    <section id="education" className="pt-20 section-reveal">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Education.</h2>
        <p className="text-xl text-secondary mt-2 font-medium">Academic foundation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cvData.education.map((edu, idx) => (
          <div key={idx} className="bg-surface border border-border/40 rounded-[2rem] p-10 shadow-apple hover:shadow-apple-hover transition-all duration-500">
            
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="inline-block text-sm font-semibold text-secondary bg-background px-3 py-1 rounded-full mb-6">
                  Class of {edu.period}
                </span>
                <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight leading-tight">
                  {edu.degree}
                </h3>
                <div className="text-lg text-secondary font-medium mb-8">
                  {edu.institution}
                </div>
              </div>
              
              <div className="pt-6 border-t border-border/40">
                <span className="text-sm font-medium text-secondary">Final Grade: </span>
                <span className="text-sm font-bold text-primary">{edu.grade}</span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
