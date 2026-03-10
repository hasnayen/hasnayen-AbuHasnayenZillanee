import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Play, RotateCcw, Zap, Timer } from "lucide-react";

interface Bug {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  emoji: string;
  points: number;
  caught: boolean;
}

const BUG_EMOJIS = [
  { emoji: "🐛", points: 1, size: 40 },
  { emoji: "🦟", points: 2, size: 35 },
  { emoji: "🕷️", points: 3, size: 32 },
  { emoji: "🦠", points: 5, size: 28 },
];

const GAME_DURATION = 30;

let bugIdCounter = 0;

function generateBug(containerW: number, containerH: number): Bug {
  const template = BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)];
  return {
    id: bugIdCounter++,
    x: Math.random() * (containerW - template.size * 2) + template.size,
    y: Math.random() * (containerH - template.size * 2) + template.size,
    size: template.size,
    speed: 0.5 + Math.random() * 1.5,
    emoji: template.emoji,
    points: template.points,
    caught: false,
  };
}

export function BugCatcherGame({ onXpGain }: { onXpGain?: (xp: number) => void }) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; points: number }[]>([]);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("bugcatcher-hi") || "0"); } catch { return 0; }
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();
  const bugsRef = useRef<Bug[]>([]);
  const spawnRef = useRef<NodeJS.Timeout>();

  const getContainerSize = () => {
    const el = containerRef.current;
    if (!el) return { w: 600, h: 300 };
    return { w: el.clientWidth, h: el.clientHeight };
  };

  const startGame = () => {
    bugIdCounter = 0;
    setBugs([]);
    bugsRef.current = [];
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setPopEffects([]);
    setGameState("playing");
  };

  const catchBug = useCallback((bugId: number, x: number, y: number, points: number) => {
    setBugs((prev) => {
      const updated = prev.map((b) => b.id === bugId ? { ...b, caught: true } : b);
      bugsRef.current = updated;
      return updated;
    });
    setScore((s) => {
      const newScore = s + points;
      return newScore;
    });
    onXpGain?.(points * 5);
    setCombo((c) => c + 1);
    setPopEffects((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x, y, points },
    ]);
    setTimeout(() => {
      setPopEffects((prev) => prev.filter((p) => p.x !== x || p.y !== y));
      setBugs((prev) => {
        const updated = prev.filter((b) => b.id !== bugId);
        bugsRef.current = updated;
        return updated;
      });
    }, 400);
  }, []);

  // Spawn bugs
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnBug = () => {
      const { w, h } = getContainerSize();
      const newBug = generateBug(w, h);
      setBugs((prev) => {
        const updated = [...prev.filter((b) => !b.caught), newBug];
        bugsRef.current = updated;
        return updated;
      });
    };

    // Initial bugs
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnBug, i * 300);
    }

    // Continuous spawning
    spawnRef.current = setInterval(spawnBug, 1800);
    return () => clearInterval(spawnRef.current);
  }, [gameState]);

  // Bug movement animation
  useEffect(() => {
    if (gameState !== "playing") {
      cancelAnimationFrame(animRef.current!);
      return;
    }

    const { w, h } = getContainerSize();
    const velocities = new Map<number, { vx: number; vy: number }>();

    const animate = () => {
      setBugs((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((bug) => {
          if (bug.caught) return bug;
          let vel = velocities.get(bug.id);
          if (!vel) {
            const angle = Math.random() * Math.PI * 2;
            vel = { vx: Math.cos(angle) * bug.speed, vy: Math.sin(angle) * bug.speed };
            velocities.set(bug.id, vel);
          }
          let nx = bug.x + vel.vx;
          let ny = bug.y + vel.vy;
          if (nx < bug.size || nx > w - bug.size) {
            vel.vx *= -1;
            nx = bug.x + vel.vx;
          }
          if (ny < bug.size || ny > h - bug.size) {
            vel.vy *= -1;
            ny = bug.y + vel.vy;
          }
          return { ...bug, x: nx, y: ny };
        });
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current!);
  }, [gameState]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameState("over");
          setScore((s) => {
            setHighScore((prev) => {
              const next = Math.max(prev, s);
              try { localStorage.setItem("bugcatcher-hi", String(next)); } catch {}
              return next;
            });
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Reset combo on timeout
  useEffect(() => {
    if (combo === 0) return;
    const t = setTimeout(() => setCombo(0), 2000);
    return () => clearTimeout(t);
  }, [combo]);

  const timerPercent = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timerPercent > 50 ? "hsl(199 89% 52%)" : timerPercent > 25 ? "hsl(43 96% 56%)" : "hsl(0 80% 55%)";

  return (
    <div className="w-full space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Score</span>
            <span
              data-testid="game-score"
              className="font-serif font-bold text-2xl text-primary"
            >
              {score}
            </span>
          </div>
          {combo >= 3 && (
            <div className="flex items-center gap-1 bg-destructive/15 text-destructive px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">{combo}x Combo!</span>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>{timeLeft}s</span>
            </div>
            <span>High Score: {highScore}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPercent}%`, background: timerColor }}
            />
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={containerRef}
        data-testid="game-area"
        className="relative w-full rounded-xl border-2 border-border bg-card overflow-hidden select-none"
        style={{ height: "280px", cursor: gameState === "playing" ? "crosshair" : "default" }}
      >
        {/* Legend overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-card/95 z-10">
            <div className="text-center space-y-2">
              <p className="font-serif text-2xl font-bold">Bug Catcher</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Click the bugs before they escape! Different bugs give different points.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              {BUG_EMOJIS.map((b) => (
                <div key={b.emoji} className="flex items-center gap-1.5">
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="text-muted-foreground font-mono">+{b.points}</span>
                </div>
              ))}
            </div>
            <Button
              data-testid="button-start-game"
              onClick={startGame}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Start Game
            </Button>
          </div>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-card/95 z-10">
            <Trophy className="w-10 h-10 text-primary" />
            <div className="text-center">
              <p className="font-serif text-2xl font-bold">Time's Up!</p>
              <p className="text-4xl font-serif font-bold text-primary mt-1">{score}</p>
              <p className="text-muted-foreground text-sm mt-1">
                {score >= highScore && score > 0 ? "New High Score!" : `High Score: ${highScore}`}
              </p>
            </div>
            <Button
              data-testid="button-restart-game"
              onClick={startGame}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}

        {/* Bugs */}
        {bugs.map((bug) => (
          !bug.caught && (
            <button
              key={bug.id}
              data-testid={`bug-${bug.id}`}
              onClick={(e) => {
                if (gameState !== "playing") return;
                const rect = (e.target as HTMLElement).closest("[data-testid='game-area']")?.getBoundingClientRect();
                const cx = e.clientX - (rect?.left ?? 0);
                const cy = e.clientY - (rect?.top ?? 0);
                catchBug(bug.id, cx, cy, bug.points);
              }}
              className="absolute bug-float transition-opacity select-none"
              style={{
                left: bug.x - bug.size / 2,
                top: bug.y - bug.size / 2,
                width: bug.size,
                height: bug.size,
                fontSize: bug.size * 0.7,
                lineHeight: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                animationDelay: `${Math.random() * 1.2}s`,
              }}
            >
              {bug.emoji}
            </button>
          )
        ))}

        {/* Pop effects */}
        {popEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute pointer-events-none text-xs font-bold font-mono counter-animate"
            style={{
              left: effect.x,
              top: effect.y - 20,
              color: "hsl(199 89% 52%)",
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
          >
            +{effect.points}
          </div>
        ))}

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(199 89% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(199 89% 52%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {gameState === "playing" ? "Click the bugs as fast as you can!" : "A fun game while you explore the portfolio"}
      </p>
    </div>
  );
}
