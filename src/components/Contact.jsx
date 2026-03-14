import React, { useState } from 'react';
import { cvData } from '../cvData';
import { Github, Linkedin, Mail, TerminalSquare } from 'lucide-react';

const Contact = () => {
  const currentYear = new Date().getFullYear();
  const [cmdText, setCmdText] = useState('> grep -i "contact" /sys/intent');

  const handleHover = (text) => setCmdText(text);
  const handleLeave = () => setCmdText('> grep -i "contact" /sys/intent');

  return (
    <footer id="contact" className="pt-24 pb-12 section-reveal">
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-neon/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Let's <span className="heading-drama text-white/50">Connect</span>
            </h2>
            <p className="text-ash/70 text-lg max-w-md">
              System is operational. Currently based in {cvData.location}. Open for new opportunities and collaborations.
            </p>
            
            {/* CLI prompt element */}
            <div className="bg-jet border border-white/10 p-4 rounded-layer font-fira text-sm flex items-center gap-3 max-w-md">
              <TerminalSquare size={18} className="text-neon" />
              <span className="text-ash/80 inline-block min-w-[250px]">{cmdText}<span className="animate-pulse">_</span></span>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-[200px]">
            <a 
              href={`mailto:${cvData.email}`} 
              onMouseEnter={() => handleHover(`> mailto:${cvData.email}`)}
              onMouseLeave={handleLeave}
              className="flex items-center gap-4 p-4 rounded-layer bg-white/5 border border-white/10 hover:border-neon/50 hover:bg-neon/10 transition-all magnetic group"
            >
              <Mail className="text-neon group-hover:scale-110 transition-transform" />
              <span className="font-fira text-sm">Email</span>
            </a>
            
            <a 
              href={`https://${cvData.linkedin}`} 
              target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => handleHover(`> ping linkedin.com/in/joaocmfcm`)}
              onMouseLeave={handleLeave}
              className="flex items-center gap-4 p-4 rounded-layer bg-white/5 border border-white/10 hover:border-neon/50 hover:bg-neon/10 transition-all magnetic group"
            >
              <Linkedin className="text-neon group-hover:scale-110 transition-transform" />
              <span className="font-fira text-sm">LinkedIn</span>
            </a>

            <a 
              href={`https://github.com/${cvData.github}`} 
              target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => handleHover(`> ssh git@github.com:${cvData.github}`)}
              onMouseLeave={handleLeave}
              className="flex items-center gap-4 p-4 rounded-layer bg-white/5 border border-white/10 hover:border-neon/50 hover:bg-neon/10 transition-all magnetic group"
            >
              <Github className="text-neon group-hover:scale-110 transition-transform" />
              <span className="font-fira text-sm">GitHub</span>
            </a>
          </div>
          
        </div>
      </div>

      <div className="mt-12 text-center text-ash/40 font-fira text-xs flex flex-col md:flex-row items-center justify-between px-4">
        <p>&copy; {currentYear} {cvData.name}. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built with React & Tailwind</p>
      </div>
    </footer>
  );
};

export default Contact;
