"use client";

interface EventTypeToggleProps {
  eventType: "all" | "main_conference" | "side_event";
  onTypeChange: (type: "all" | "main_conference" | "side_event") => void;
}

export default function EventTypeToggle({ eventType, onTypeChange }: EventTypeToggleProps) {
  return (
    <div className="flex gap-2 p-1 rounded-xl glass">
      <button
        onClick={() => onTypeChange("main_conference")}
        className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all touch-feedback ${
          eventType === "main_conference"
            ? "bg-gradient-to-r from-dawn-teal to-dawn-light text-pangia-black"
            : "text-white/70 hover:text-white"
        }`}
      >
        <span className="block text-xs opacity-70 mb-0.5">Jan 17-18</span>
        <span>Main Conference</span>
      </button>
      <button
        onClick={() => onTypeChange("side_event")}
        className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all touch-feedback ${
          eventType === "side_event"
            ? "bg-gradient-to-r from-golden-coral to-golden-dusty text-white"
            : "text-white/70 hover:text-white"
        }`}
      >
        <span className="block text-xs opacity-70 mb-0.5">Jan 18-24</span>
        <span>Nomad Week</span>
      </button>
    </div>
  );
}



