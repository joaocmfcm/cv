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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/40 py-4 transition-all">
      <div className="container mx-auto px-6 max-w-5xl flex items-center justify-between">
        <a href="#" className="font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity">
          {cvData.name}
        </a>
        
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link} className="hidden md:block">
              <button 
                onClick={() => scrollToSection(link)}
                className="text-primary/70 hover:text-primary text-sm font-medium transition-colors"
              >
                {link}
              </button>
            </li>
          ))}
          <li>
            <a 
              href={`mailto:${cvData.email}`}
              className="px-4 py-2 bg-primary text-surface text-sm font-medium rounded-full hover:scale-105 hover:shadow-apple-hover transition-all inline-block"
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
