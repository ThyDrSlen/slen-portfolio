"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const WORD_LISTS = {
  code: [
    "function", "const", "return", "async", "await", "import", "export",
    "interface", "type", "class", "extends", "implements", "promise",
    "callback", "middleware", "endpoint", "payload", "schema", "query",
    "mutation", "resolver", "handler", "controller", "service", "module",
    "deploy", "pipeline", "container", "cluster", "instance", "proxy",
    "socket", "stream", "buffer", "cache", "index", "config", "runtime",
    "compiler", "parser", "token", "node", "thread", "process", "daemon",
    "binary", "stack", "queue", "graph", "tree", "hash", "table",
    "debug", "trace", "error", "warning", "fatal", "panic", "recover",
    "goroutine", "channel", "mutex", "struct", "enum", "trait", "generic",
    "iterator", "closure", "lambda", "reduce", "filter", "transform",
    "serialize", "encode", "decode", "encrypt", "verify", "validate",
    "monitor", "metrics", "latency", "throughput", "uptime", "replica",
    "shard", "partition", "consensus", "failover", "circuit", "breaker",
    "kubectl", "docker", "grpc", "protobuf", "webhook", "cron", "nginx",
  ],
};

const WPM_MIN_ELAPSED = 2;
const PB_STORAGE_KEY = "typing-test-pb";

function shuffleWords(count: number): string[] {
  const words = [...WORD_LISTS.code];
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.slice(0, count);
}

function getWpmRating(wpm: number): { label: string; color: string } {
  if (wpm >= 120) return { label: "legendary", color: "#ff0" };
  if (wpm >= 90) return { label: "speed demon", color: "#0f0" };
  if (wpm >= 70) return { label: "blazing", color: "var(--color-accent)" };
  if (wpm >= 50) return { label: "solid", color: "var(--color-accent-dim)" };
  if (wpm >= 30) return { label: "warming up", color: "var(--color-text-secondary)" };
  return { label: "keep practicing", color: "var(--color-text-muted)" };
}

function readPersonalBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(PB_STORAGE_KEY);
    const parsed = stored ? parseInt(stored, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function writePersonalBest(wpm: number): void {
  try {
    localStorage.setItem(PB_STORAGE_KEY, String(wpm));
  } catch {
  }
}

function getTimerColor(fraction: number): string {
  if (fraction <= 0.167) return "var(--color-error)";
  if (fraction <= 0.333) return "#cc8800";
  return "var(--color-accent)";
}

export function TypingTest() {
  const WORD_COUNT = 25;
  const TIME_LIMIT = 30;

  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [charStates, setCharStates] = useState<("correct" | "incorrect" | "pending")[][]>([]);
  const [personalBest, setPersonalBest] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const wpm = elapsed > 0 && correctChars > 0 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0;
  const displayWpm = elapsed >= WPM_MIN_ELAPSED ? wpm : null;
  const timerFraction = started ? Math.max(0, (TIME_LIMIT - elapsed) / TIME_LIMIT) : 1;

  const initTest = useCallback(() => {
    const newWords = shuffleWords(WORD_COUNT);
    setWords(newWords);
    setCharStates(newWords.map((w) => w.split("").map(() => "pending")));
    setInput("");
    setWordIndex(0);
    setCharIndex(0);
    setStarted(false);
    setFinished(false);
    setStartTime(0);
    setCorrectChars(0);
    setTotalChars(0);
    setElapsed(0);
    setIsNewRecord(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initTest();
    setPersonalBest(readPersonalBest());
  }, [initTest]);

  useEffect(() => {
    if (finished && wpm > 0) {
      const pb = readPersonalBest();
      if (wpm > pb) {
        writePersonalBest(wpm);
        setPersonalBest(wpm);
        setIsNewRecord(true);
      }
    }
  }, [finished, wpm]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = (now - startTime) / 1000;
        setElapsed(secs);

        if (secs >= TIME_LIMIT) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, startTime]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (finished) return;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    if (e.key === "Tab") {
      e.preventDefault();
      initTest();
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    const currentWord = words[wordIndex];
    if (!currentWord) return;

    if (e.key === " ") {
      e.preventDefault();
      if (charIndex > 0) {
        setWordIndex((prev) => prev + 1);
        setCharIndex(0);
        setInput("");

        if (wordIndex + 1 >= words.length) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }
      return;
    }

    if (e.key === "Backspace") {
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
        setCharStates((prev) => {
          const next = prev.map((w) => [...w]);
          if (next[wordIndex]) {
            next[wordIndex][charIndex - 1] = "pending";
          }
          return next;
        });
        setInput((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (e.key.length === 1) {
      if (charIndex >= currentWord.length) return;

      const isCorrect = e.key === currentWord[charIndex];
      setTotalChars((prev) => prev + 1);
      if (isCorrect) setCorrectChars((prev) => prev + 1);

      setCharStates((prev) => {
        const next = prev.map((w) => [...w]);
        if (next[wordIndex]) {
          next[wordIndex][charIndex] = isCorrect ? "correct" : "incorrect";
        }
        return next;
      });

      setCharIndex((prev) => prev + 1);
      setInput((prev) => prev + e.key);
    }
  };

  const timeLeft = Math.max(0, Math.ceil(TIME_LIMIT - elapsed));
  const rating = finished ? getWpmRating(wpm) : null;

  return (
    <div
      className="typing-test"
      ref={containerRef}
      onClick={handleFocus}
      data-testid="typing-test"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            typing test
          </span>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            {TIME_LIMIT}s &middot; code words
          </span>
          {personalBest > 0 && !started && (
            <span
              className="mono"
              data-testid="typing-test-pb"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              pb: {personalBest} wpm
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <span
            className="mono glow"
            style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}
          >
            {started ? `${timeLeft}s` : `${TIME_LIMIT}s`}
          </span>
          <button type="button" className="typing-reset" onClick={(e) => { e.stopPropagation(); initTest(); setTimeout(() => inputRef.current?.focus(), 0); }}>
            reset
          </button>
        </div>
      </div>

      <div
        data-testid="typing-test-timer-bar"
        style={{
          height: "3px",
          marginBottom: "var(--space-6)",
          background: "var(--color-border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${timerFraction * 100}%`,
            background: getTimerColor(timerFraction),
            borderRadius: "2px",
            transition: started ? "width 100ms linear, background-color 300ms ease" : "none",
            boxShadow: started ? `0 0 8px ${getTimerColor(timerFraction)}` : "none",
          }}
        />
      </div>

      <input
        ref={inputRef}
        className="typing-test-input"
        value={input}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-label="Typing test input"
      />

      <div className="typing-test-words">
        {!started && !finished && (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-4)",
            }}
          >
            click here and start typing &middot; tab to reset
          </p>
        )}
        {words.map((word, wi) => (
          <span key={`${word}-${wi}`} style={{ marginRight: "0.75em", display: "inline" }}>
            {word.split("").map((char, ci) => {
              const state = charStates[wi]?.[ci] ?? "pending";
              const isCursor = wi === wordIndex && ci === charIndex && !finished;
              return (
                <span
                  key={ci}
                  className={`${state} ${isCursor ? "current" : ""}`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>

      {started && !finished && (
        <div className="typing-test-stats">
          <div>
            <div className="stat-value" data-testid="typing-test-live-wpm">
              {displayWpm !== null ? displayWpm : "--"}
            </div>
            <div className="stat-label">wpm</div>
          </div>
          <div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">accuracy</div>
          </div>
          <div>
            <div className="stat-value">
              {wordIndex}/{words.length}
            </div>
            <div className="stat-label">words</div>
          </div>
        </div>
      )}

      {finished && (
        <div className="typing-test-stats" data-testid="typing-test-results">
          <div>
            <div className="stat-value">{wpm}</div>
            <div className="stat-label">wpm</div>
          </div>
          <div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">accuracy</div>
          </div>
          <div>
            <div className="stat-value">
              {wordIndex}/{words.length}
            </div>
            <div className="stat-label">words</div>
          </div>
          {rating && (
            <div>
              <div
                className="stat-value"
                data-testid="typing-test-rating"
                style={{ color: rating.color, fontSize: "var(--text-lg)" }}
              >
                {rating.label}
              </div>
              <div className="stat-label">rating</div>
            </div>
          )}
          {isNewRecord && (
            <div
              data-testid="typing-test-new-record"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#ff0",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                textShadow: "0 0 10px rgba(255, 255, 0, 0.4)",
                animation: "glow-pulse 1.5s ease-in-out infinite",
              }}
            >
              new record!
            </div>
          )}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="typing-reset"
              onClick={(e) => {
                e.stopPropagation();
                initTest();
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
