import React from 'react';

export const LogoIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 C 25 10, 10 25, 10 50 C 10 60, 15 70, 20 75 L 5 90 L 40 85 L 35 50 L 25 60 C 20 55, 18 50, 18 45 C 18 30, 30 18, 45 18 C 55 18, 65 25, 70 35 L 85 25 C 75 10, 60 5, 45 5 Z" fill="#84cc16" />
    <path d="M50 90 C 75 90, 90 75, 90 50 C 90 40, 85 30, 80 25 L 95 10 L 60 15 L 65 50 L 75 40 C 80 45, 82 50, 82 55 C 82 70, 70 82, 55 82 C 45 82, 35 75, 30 65 L 15 75 C 25 90, 40 95, 55 95 Z" fill="#0ea5e9" />
  </svg>
);
