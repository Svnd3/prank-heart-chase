import { useCallback, useEffect, useRef, useState } from "react";

const EMOJIS = ["😏", "😈", "😆", "😳", "🙈", "😝", "😜", "🤭", "😅"];
const HIDING_EMOJI = "👀";

interface Position {
  x: number;
  y: number;
}

interface RunawayNoProps {
  yesButtonRef: React.RefObject<HTMLButtonElement>;
  playWhoosh: () => void;
}

const RunawayNo = ({ yesButtonRef, playWhoosh }: RunawayNoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<number | null>(null);

  const [pos, setPos] = useState<Position | null>(null); // null = at home
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [hiding, setHiding] = useState(false);
  const [shake, setShake] = useState(false);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setPos(null);
      setHiding(false);
      setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    }, 2000);
  }, []);

  const moveAway = useCallback(() => {
    playWhoosh();
    setShake(true);
    window.setTimeout(() => setShake(false), 400);

    // 40% chance to hide behind YES button, otherwise random spot
    const shouldHide = Math.random() < 0.4 && yesButtonRef.current;

    if (shouldHide && yesButtonRef.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      // Position slightly behind/peeking from top of yes button
      setPos({
        x: rect.left + rect.width / 2 - 24,
        y: rect.top - 18,
      });
      setHiding(true);
    } else {
      const padding = 80;
      const maxX = window.innerWidth - padding * 2;
      const maxY = window.innerHeight - padding * 2;
      setPos({
        x: padding + Math.random() * maxX,
        y: padding + Math.random() * maxY,
      });
      setHiding(false);
    }

    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    resetIdleTimer();
  }, [playWhoosh, resetIdleTimer, yesButtonRef]);

  // Slight cursor follow when at home
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (pos !== null || !homeRef.current) return;
      const rect = homeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      // If cursor approaches within 120px, run away
      if (dist < 120) {
        moveAway();
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [pos, moveAway]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    moveAway();
  };

  const isAway = pos !== null;
  const displayEmoji = hiding ? HIDING_EMOJI : emoji;

  return (
    <>
      {/* Home placeholder keeps layout stable */}
      <div ref={homeRef} className="relative w-[140px] h-[60px]">
        {!isAway && (
          <button
            ref={containerRef as never}
            onMouseEnter={moveAway}
            onClick={handleInteract}
            onTouchStart={handleInteract}
            className={`absolute inset-0 flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/60 backdrop-blur text-secondary-foreground font-semibold text-lg transition-transform hover:scale-105 ${
              shake ? "animate-shake" : ""
            }`}
            aria-label="No"
          >
            <span className="text-2xl animate-wiggle inline-block">{emoji}</span>
            <span>No</span>
          </button>
        )}
      </div>

      {/* Floating runaway version */}
      {isAway && (
        <button
          onMouseEnter={moveAway}
          onClick={handleInteract}
          onTouchStart={handleInteract}
          className={`fixed z-50 flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur px-5 py-3 text-secondary-foreground font-semibold text-lg shadow-soft transition-all duration-500 ease-in-out ${
            shake ? "animate-shake" : ""
          } ${hiding ? "scale-75 opacity-90" : "scale-100"}`}
          style={{
            left: `${pos!.x}px`,
            top: `${pos!.y}px`,
            transitionProperty: "left, top, transform, opacity",
          }}
          aria-label="No"
        >
          <span className="text-2xl">{displayEmoji}</span>
          {!hiding && <span>No</span>}
        </button>
      )}
    </>
  );
};

export default RunawayNo;
