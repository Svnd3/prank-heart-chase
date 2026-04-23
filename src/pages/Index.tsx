import { useEffect, useRef, useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import RunawayNo from "@/components/RunawayNo";
import { playHeartbreak, playWhoosh } from "@/lib/sounds";

type Stage = "ask" | "loading" | "reveal";

const Index = () => {
  const [stage, setStage] = useState<Stage>("ask");
  const yesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = "Would you die for me? 💔";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "A playful romantic prank — would you die for me? Tap Yes… if you dare. 💖"
    );
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  const handleYes = () => {
    setStage("loading");
    window.setTimeout(() => {
      playHeartbreak();
      setStage("reveal");
    }, 800);
  };

  const handleReset = () => setStage("ask");

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
      <FloatingHearts />

      <h1 className="sr-only">Would you die for me — a romantic prank</h1>

      <section className="relative z-10 w-full max-w-xl mx-auto text-center animate-fade-in">
        {stage !== "reveal" ? (
          <>
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-6">
              A little question…
            </p>
            <h2 className="text-4xl sm:text-6xl font-bold leading-tight text-gradient-romance drop-shadow-[0_0_30px_hsl(330_90%_65%/0.4)]">
              Would you die for me?
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground">
              Be honest. I'm watching. 👀
            </p>

            <div className="mt-12 flex items-center justify-center gap-5 sm:gap-8 flex-wrap">
              <button
                ref={yesRef}
                onClick={handleYes}
                disabled={stage === "loading"}
                className="relative px-8 py-4 rounded-full font-bold text-lg text-primary-foreground bg-button-romance shadow-glow animate-pulse-glow transition-transform hover:scale-110 active:scale-95 disabled:opacity-80 disabled:cursor-wait"
              >
                {stage === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                    Thinking…
                  </span>
                ) : (
                  <>Yes ❤️</>
                )}
              </button>

              <RunawayNo yesButtonRef={yesRef} playWhoosh={playWhoosh} />
            </div>

            <p className="mt-10 text-xs text-muted-foreground/70">
              Hint: try clicking "No" 😏
            </p>
          </>
        ) : (
          <div className="animate-heartbreak">
            <div className="text-8xl mb-6 select-none">💔</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gradient-romance leading-tight">
              I wouldn't do the same…
            </h2>
            <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">
              sorry 😔💔
            </p>
            <button
              onClick={handleReset}
              className="mt-10 px-6 py-3 rounded-full border border-border bg-secondary/60 backdrop-blur text-secondary-foreground font-medium hover:scale-105 transition-transform"
            >
              Ask me again 🙃
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Index;
