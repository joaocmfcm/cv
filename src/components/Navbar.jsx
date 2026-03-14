import React from 'react';
import { cvData } from '../cvData';

const Navbar = () => {
  const links = ['Experience', 'Skills', 'Education', 'Interests', 'Contact'];

  const scrollToSection = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-jet/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-fira font-bold group-hover:bg-neon group-hover:text-jet transition-colors">
            {cvData.name.charAt(0)}
          </span>
          <span className="font-fira text-sm hidden sm:block font-bold">~/{cvData.github}</span>
        </a>
        
        <ul className="flex items-center gap-6">
          {links.map((link) => (
            <li key={link} className="hidden md:block">
              <button 
                onClick={() => scrollToSection(link)}
                className="text-ash/60 hover:text-neon text-sm font-fira transition-colors uppercase tracking-wider magnetic"
              >
                {link}
              </button>
            </li>
          ))}
          <li>
            <a 
              href={`mailto:${cvData.email}`}
              className="px-4 py-2 bg-neon text-jet text-sm font-fira font-bold rounded hover:bg-neon/90 transition-colors uppercase magnetic inline-block"
            >
              Get in Touch
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
