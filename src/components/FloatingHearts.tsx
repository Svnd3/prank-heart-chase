import { useMemo } from "react";

const HEARTS = ["💖", "💕", "💗", "💓", "💝", "🌸", "✨"];

const FloatingHearts = () => {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        emoji: HEARTS[i % HEARTS.length],
        left: Math.random() * 100,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 12,
        size: 14 + Math.random() * 22,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute animate-float-up select-none"
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            filter: "drop-shadow(0 0 8px hsl(330 90% 65% / 0.6))",
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
