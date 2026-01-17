"use client";

interface PangiaLogoProps {
  className?: string;
}

export default function PangiaLogo({ className = "w-8 h-8" }: PangiaLogoProps) {
  return (
    <svg 
      viewBox="0 0 50 40" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pangia wave logo - teal/cyan color matching pangiapass.com */}
      <path 
        d="M45.5,8.5c-3.2,2.1-7.1,5.1-8.5,9.2c-0.6,1.9-0.3,4.2,1.2,5.3c1.6,1.3,3.8,1,5.6,0.3
        c5.8-2.5,9.6-8.3,14.5-12.1c2.7-2.1,5.4-3.8,8.6-4.5c1-0.2,2.1-0.3,3-0.4c1-0.1,1.4-0.2,1.5-0.4
        c0.1-0.1-0.1-0.3-0.5-0.5c-1-0.5-2.1-0.8-3.2-1C59.5-0.1,51.3,1.7,45.5,8.5z"
        fill="url(#pangiaGradient)"
        transform="translate(-35, 0) scale(0.9)"
      />
      <path 
        d="M8,28c2.5,0.5,4.6,2.1,6.7,3.5c1.2,0.8,2.3,1.6,3.7,1.7c0.6,0,1.2-0.1,1.6-0.6
        c0.2-0.2,0.3-0.5,0.4-0.7c0.2-0.4,0.3-1.1,0.7-0.5c0.2,0.3,0.4,0.9,0.6,1.3c0.3,0.8,0.5,1.6,0.5,2.4
        c0,2.4-1.6,3.4-3.8,2.7c-1.8-0.5-3.4-1.6-5-2.6c-0.7-0.4-1.4-0.8-2-1.2c-1.7-1.1-4.1-2.3-6.6-2.3
        c-2,0-4.4,0.7-5.3,2.6c-0.3,0.7-0.4,1-0.4,0c0.1-2.8,2.4-5.2,5-6C5.4,27.4,6.9,27.6,8,28z"
        fill="url(#pangiaGradient)"
        transform="translate(2, -5) scale(1.1)"
      />
      <defs>
        <linearGradient id="pangiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#21a3cb" />
          <stop offset="100%" stopColor="#7fc2cb" />
        </linearGradient>
      </defs>
    </svg>
  );
}
