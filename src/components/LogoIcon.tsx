import React from 'react';

interface LogoProps {
  className?: string;
}

export default function LogoIcon({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House Roof */}
      <path 
        d="M15 60 L60 25 L105 60" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Left Wall */}
      <line x1="30" y1="48" x2="30" y2="85" stroke="currentColor" strokeWidth="7" />
      {/* Right Wall */}
      <line x1="90" y1="48" x2="90" y2="85" stroke="currentColor" strokeWidth="7" />
      
      {/* Inner Orange Square */}
      <rect 
        x="50" 
        y="50" 
        width="20" 
        height="20" 
        fill="var(--color-orange)" 
      />

      {/* BADIZ Text */}
      <text 
        x="60" 
        y="115" 
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
        fontWeight="600" 
        fontSize="34" 
        fill="currentColor" 
        textAnchor="middle" 
        letterSpacing="0.05em"
      >
        BADIZ
      </text>

      {/* REAL ESTATE Text */}
      <text 
        x="60" 
        y="135" 
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
        fontWeight="500" 
        fontSize="12" 
        fill="currentColor" 
        textAnchor="middle" 
        letterSpacing="0.25em"
      >
        REAL ESTATE
      </text>
    </svg>
  );
}
