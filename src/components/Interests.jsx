import React from 'react';
import { cvData } from '../cvData';
import StravaHeatmap from './StravaHeatmap';
import GoodreadsBooks from './GoodreadsBooks';
import LastFmStats from './LastFmStats';
import { Heart, Dumbbell, Bike, Activity, ChefHat, BookOpen, Film, Wifi, Box } from 'lucide-react';

const Interests = () => {
  const getInterestIcon = (interest) => {
    switch (interest.toLowerCase()) {
      case 'strength training': return <Dumbbell size={16} />;
      case 'cycling': return <Bike size={16} />;
      case 'running': return <Activity size={16} />;
      case 'cooking': return <ChefHat size={16} />;
      case 'reading': return <BookOpen size={16} />;
      case 'movies': return <Film size={16} />;
      case 'iot': return <Wifi size={16} />;
      case '3d printing': return <Box size={16} />;
      default: return null;
    }
  };
  return (
    <section id="interests" className="pt-20 section-reveal">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">
          Interests.
        </h2>
        <p className="text-xl text-secondary mt-2 font-medium flex items-center gap-2">
          <Heart size={20} className="text-secondary/80" /> Beyond the code.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {cvData.interests.map((interest, idx) => (
          <div 
            key={idx} 
            className="px-6 py-4 bg-surface border border-border/40 rounded-full shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all duration-300 group cursor-default flex items-center gap-2"
          >
            <span className="text-primary/50 group-hover:text-primary transition-colors">
              {getInterestIcon(interest)}
            </span>
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

      {/* Last.fm Stats Area */}
      <LastFmStats />

      {/* Goodreads Books Area */}
      <GoodreadsBooks />
    </section>
  );
};

export default Interests;
