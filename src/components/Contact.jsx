import React from 'react';
import { cvData } from '../cvData';
import { Github, Linkedin, Mail, MessageSquare, MapPin } from 'lucide-react';

const Contact = () => {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = React.useState(false);

  return (
    <footer id="contact" className="pt-32 pb-12 section-reveal">
      <div className="bg-surface border border-border/40 rounded-[3rem] p-10 md:p-20 shadow-apple text-center overflow-hidden relative">

        <div className="relative z-[60] max-w-2xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary flex items-center justify-center gap-4">
            <MessageSquare size={48} className="text-primary/80" /> Let's talk.
          </h2>

          <p className="text-xl md:text-2xl text-secondary font-medium leading-relaxed flex items-center justify-center gap-2">
            <MapPin size={24} className="text-secondary/70" /> Currently based in {cvData.location}.
          </p>

          <div className="pt-6">
            <a
              href={`mailto:${cvData.email}`}
              onClick={() => {
                navigator.clipboard.writeText(cvData.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
              className={`inline-flex items-center gap-2 px-10 py-5 font-semibold rounded-full hover:scale-105 hover:shadow-apple-hover transition-all text-lg tracking-wide min-w-[240px] justify-center
                ${copied ? 'bg-green-500 text-white' : 'bg-primary text-surface'}`}
            >
              {copied ? (
                <>Email Copied!</>
              ) : (
                <>
                  <Mail size={20} /> Initialize Contact
                </>
              )}
            </a>
            <p className="text-sm text-secondary/50 mt-3 font-medium">
              (Opens email client & copies address)
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 border-t border-border/40 mt-12 w-full max-w-sm mx-auto">
            <a
              href={`https://${cvData.linkedin}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors group"
            >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
              LinkedIn
            </a>
            <a
              href={`https://github.com/${cvData.github}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors group"
            >
              <Github size={20} className="group-hover:scale-110 transition-transform" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-secondary/60 text-sm font-medium flex flex-col md:flex-row items-center justify-between px-4">
        <p>&copy; {currentYear} {cvData.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Contact;
