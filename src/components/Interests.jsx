import React from 'react';
import { cvData } from '../cvData';
import StravaHeatmap from './StravaHeatmap';

const Interests = () => {
  return (
    <section id="interests" className="pt-20 section-reveal">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Interests.</h2>
        <p className="text-xl text-secondary mt-2 font-medium">Beyond the code.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {cvData.interests.map((interest, idx) => (
          <div 
            key={idx} 
            className="px-6 py-4 bg-surface border border-border/40 rounded-full shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all duration-300 group cursor-default"
          >
            <span className="font-semibold text-primary/80 group-hover:text-primary transition-colors">
              {interest}
            </span>
          </div>
        ))}
      </div>

      {/* Strava Activity Heatmap Area */}
      <div className="mt-12">
        <StravaHeatmap />
      </div>
    </section>
  );
};

export default Interests;
