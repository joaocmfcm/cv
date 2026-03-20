import React from 'react';
import { 
  SiReact, SiAngular, SiTypescript, SiJavascript, SiHtml5, SiCss, SiSass,
  SiGit, SiJira, SiGithubactions, SiJenkins, SiDocker, SiKubernetes,
  SiNextdotjs, SiTailwindcss, SiTestinglibrary, SiCypress, SiVite,
  SiReactivex, SiWebpack, SiEmberdotjs, SiBackbonedotjs
} from 'react-icons/si';
import { 
  LayoutTemplate, Blocks, Zap, Gauge, GitMerge, RefreshCw, Users, Radio, Activity 
} from 'lucide-react';

export const getSkillIcon = (skill, size = 16) => {
  const iconSize = size;
  const skillMap = {
    // Frontend
    "React": <SiReact size={iconSize} />,
    "Angular": <SiAngular size={iconSize} />,
    "AngularJS": <SiAngular size={iconSize} />,
    "TypeScript": <SiTypescript size={iconSize} />,
    "JavaScript": <SiJavascript size={iconSize} />,
    "HTML5": <SiHtml5 size={iconSize} />,
    "CSS3": <SiCss size={iconSize} />,
    "SCSS": <SiSass size={iconSize} />,
    "EmberJS": <SiEmberdotjs size={iconSize} />,
    "BackboneJS": <SiBackbonedotjs size={iconSize} />,
    
    // Tools & Frameworks
    "Git": <SiGit size={iconSize} />,
    "JIRA": <SiJira size={iconSize} />,
    "GitHub Actions": <SiGithubactions size={iconSize} />,
    "Jenkins": <SiJenkins size={iconSize} />,
    "Vite": <SiVite size={iconSize} />,
    "Docker": <SiDocker size={iconSize} />,
    "Kubernetes": <SiKubernetes size={iconSize} />,
    "Next.js": <SiNextdotjs size={iconSize} />,
    "Tailwind CSS": <SiTailwindcss size={iconSize} />,
    "Testing Library": <SiTestinglibrary size={iconSize} />,
    "Cypress": <SiCypress size={iconSize} />,
    "RxJS": <SiReactivex size={iconSize} />,
    "Module Federation": <SiWebpack size={iconSize} />,
    "SignalR": <Radio size={iconSize} />,
    
    // Abstract Concepts
    "Frontend architecture": <LayoutTemplate size={iconSize} />,
    "Component-driven design": <Blocks size={iconSize} />,
    "Real-time interfaces": <Zap size={iconSize} />,
    "Performance optimization": <Gauge size={iconSize} />,
    "CI/CD": <GitMerge size={iconSize} />,
    "Agile workflows": <RefreshCw size={iconSize} />,
    "Technical mentorship": <Users size={iconSize} />
  };
  return skillMap[skill] || <Activity size={iconSize} />;
};
