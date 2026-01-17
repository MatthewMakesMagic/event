"use client";

import { Star } from "lucide-react";

interface InterestButtonProps {
  eventId: string;
  hasInterest: boolean;
  interestCount: number;
  onToggle: (eventId: string) => void;
  size?: "sm" | "md";
}

export default function InterestButton({
  eventId,
  hasInterest,
  interestCount,
  onToggle,
  size = "md",
}: InterestButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion
    onToggle(eventId);
  };

  const sizeClasses = size === "sm" 
    ? "px-2.5 py-1 text-xs gap-1.5" 
    : "px-3 py-1.5 text-sm gap-2";
  
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  // Show different states based on interest count
  const showCount = interestCount > 0;
  const isPopular = interestCount >= 5;

  return (
    <button
      onClick={handleClick}
      className={`flex items-center rounded-full transition-all touch-feedback ${sizeClasses} ${
        hasInterest
          ? "bg-daybreak-gold text-pangia-black font-medium"
          : isPopular
          ? "bg-daybreak-gold/20 text-daybreak-gold hover:bg-daybreak-gold/30"
          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      }`}
      aria-label={hasInterest ? "Remove interest" : "Express interest"}
    >
      <Star
        className={`${iconSize} ${hasInterest ? "fill-pangia-black" : isPopular ? "fill-daybreak-gold" : ""}`}
      />
      {showCount ? (
        <span className="font-semibold">{interestCount}</span>
      ) : (
        <span className="text-2xs">Interest</span>
      )}
    </button>
  );
}
