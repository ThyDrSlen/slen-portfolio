"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type WordMode = "code" | "snippets" | "leetcode" | "systems";
type TimeOption = 15 | 30 | 60;

const WORD_MODES: { key: WordMode; label: string }[] = [
  { key: "code", label: "code" },
  { key: "snippets", label: "snippets" },
  { key: "leetcode", label: "leetcode" },
  { key: "systems", label: "systems" },
];

const TIME_OPTIONS: TimeOption[] = [15, 30, 60];

const WORD_LISTS: Record<WordMode, string[]> = {
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
  snippets: [
    "useState", "useEffect", "useRef", "useCallback", "useMemo",
    "console.log", "JSON.parse", "JSON.stringify", "Object.keys",
    "Array.from", "Promise.all", "setTimeout", "setInterval",
    "req.body", "res.json", "app.use", "router.get", "next()",
    "addEventListener", "querySelector", "createElement",
    "fs.readFile", "path.join", "http.createServer",
    "process.env", "module.exports", "require()", "import()",
    "map()", "filter()", "reduce()", "forEach()", "find()",
    "Object.assign", "Array.isArray", "Number.parseInt",
    "String.prototype", "RegExp.test", "Date.now()",
    "try/catch", "async/await", "for...of", "for...in",
    "switch/case", "if/else", "do/while", "break/continue",
    "ctx.params", "ctx.query", "ctx.body", "ctx.status",
    "db.query", "db.insert", "db.update", "db.delete",
    "git.commit", "git.push", "git.merge", "git.rebase",
    "npm.install", "npm.run", "npm.publish", "npm.init",
    "test.describe", "test.it", "expect()", "assert()",
    "render()", "screen.getBy", "fireEvent", "waitFor",
    "fetch(url)", "axios.get", "axios.post", "response.data",
    "express()", "koa()", "fastify()", "hono()",
    "prisma.find", "prisma.create", "prisma.update",
    "zod.object", "zod.string", "zod.number", "zod.parse",
  ],
  leetcode: [
    "two", "pointers", "sliding", "window", "binary", "search",
    "depth", "first", "breadth", "traversal", "dynamic", "programming",
    "greedy", "approach", "backtracking", "recursion", "memoization",
    "topological", "sort", "union", "find", "disjoint", "sets",
    "prefix", "sum", "kadane", "algorithm", "floyd", "cycle",
    "tortoise", "hare", "monotonic", "stack", "trie", "insert",
    "segment", "tree", "fenwick", "range", "query", "update",
    "dijkstra", "shortest", "path", "bellman", "ford", "kruskal",
    "minimum", "spanning", "connected", "components", "bipartite",
    "intervals", "merge", "overlapping", "sweep", "line",
    "matrix", "rotation", "spiral", "order", "diagonal",
    "linked", "list", "reverse", "palindrome", "detection",
    "substring", "subsequence", "longest", "common", "increasing",
    "knapsack", "coin", "change", "climbing", "stairs",
    "permutations", "combinations", "subsets", "generate",
    "inorder", "preorder", "postorder", "level", "zigzag",
    "serialize", "deserialize", "lowest", "ancestor",
    "heap", "priority", "median", "kth", "largest", "smallest",
    "hashmap", "frequency", "counter", "anagram", "grouping",
    "bit", "manipulation", "xor", "complement", "counting",
  ],
  systems: [
    "load", "balancer", "reverse", "proxy", "gateway",
    "write-ahead", "log", "replication", "sharding", "partitioning",
    "eventual", "consistency", "strong", "linearizable",
    "consensus", "protocol", "raft", "paxos", "leader", "election",
    "circuit", "breaker", "retry", "backoff", "exponential",
    "rate", "limiting", "throttling", "debounce", "quota",
    "message", "queue", "broker", "consumer", "producer",
    "pub/sub", "event", "sourcing", "cqrs", "saga", "pattern",
    "service", "mesh", "sidecar", "envoy", "istio",
    "container", "orchestration", "kubernetes", "pod", "deployment",
    "horizontal", "autoscaling", "rolling", "canary", "blue-green",
    "observability", "tracing", "distributed", "spans", "metrics",
    "prometheus", "grafana", "alerting", "slo", "sli",
    "cdn", "edge", "caching", "ttl", "invalidation", "purge",
    "dns", "resolution", "failover", "health", "check", "heartbeat",
    "mutual", "tls", "certificate", "rotation", "zero-trust",
    "idempotency", "exactly-once", "at-least-once", "at-most-once",
    "database", "index", "b-tree", "lsm", "compaction",
    "snapshot", "isolation", "mvcc", "deadlock", "prevention",
    "connection", "pooling", "backpressure", "flow", "control",
  ],
};

const WORD_COUNT = 25;
const WPM_MIN_ELAPSED = 2;

function pbKey(mode: WordMode): string {
  return `typing-test-pb-${mode}`;
}

function shuffleWords(mode: WordMode, count: number): string[] {
  const words = [...WORD_LISTS[mode]];
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

function readPersonalBest(mode: WordMode): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(pbKey(mode));
    const parsed = stored ? parseInt(stored, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function writePersonalBest(mode: WordMode, wpm: number): void {
  try {
    localStorage.setItem(pbKey(mode), String(wpm));
  } catch {
  }
}

function getTimerColor(fraction: number): string {
  if (fraction <= 0.167) return "var(--color-error)";
  if (fraction <= 0.333) return "#cc8800";
  return "var(--color-accent)";
}

const modeButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "var(--space-1) var(--space-3)",
  background: active ? "var(--color-accent)" : "transparent",
  color: active ? "var(--color-bg)" : "var(--color-text-muted)",
  border: active ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  cursor: "pointer",
  transition: "all 150ms ease",
  fontWeight: active ? 600 : 400,
});

const timeButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "var(--space-1) var(--space-2)",
  background: "transparent",
  color: active ? "var(--color-accent)" : "var(--color-text-muted)",
  border: "none",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  cursor: "pointer",
  fontWeight: active ? 600 : 400,
  textDecoration: active ? "underline" : "none",
  textUnderlineOffset: "3px",
});

export function TypingTest() {
  const [mode, setMode] = useState<WordMode>("code");
  const [timeLimit, setTimeLimit] = useState<TimeOption>(30);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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
  const timerFraction = started ? Math.max(0, (timeLimit - elapsed) / timeLimit) : 1;

  const initTest = useCallback(() => {
    const newWords = shuffleWords(mode, WORD_COUNT);
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
    setPersonalBest(readPersonalBest(mode));
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode]);

  useEffect(() => {
    requestAnimationFrame(() => {
      initTest();
    });
  }, [initTest]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateTouchState = () => {
      setIsTouchDevice(mediaQuery.matches);
    };

    updateTouchState();
    mediaQuery.addEventListener("change", updateTouchState);

    return () => {
      mediaQuery.removeEventListener("change", updateTouchState);
    };
  }, []);

  useEffect(() => {
    if (!finished || wpm <= 0) return;
    const pb = readPersonalBest(mode);
    if (wpm > pb) {
      writePersonalBest(mode, wpm);
      requestAnimationFrame(() => {
        setPersonalBest(wpm);
        setIsNewRecord(true);
      });
    }
  }, [finished, wpm, mode]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = (now - startTime) / 1000;
        setElapsed(secs);

        if (secs >= timeLimit) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, startTime, timeLimit]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleModeChange = (newMode: WordMode) => {
    if (started) return;
    setMode(newMode);
  };

  const handleTimeChange = (newTime: TimeOption) => {
    if (started) return;
    setTimeLimit(newTime);
    initTest();
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

  const timeLeft = Math.max(0, Math.ceil(timeLimit - elapsed));
  const rating = finished ? getWpmRating(wpm) : null;

  if (isTouchDevice) {
    return (
      <div
        className="typing-test"
        ref={containerRef}
        data-testid="typing-test"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-3)",
          }}
        >
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
        </div>

        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          This typing test is designed for desktop keyboards. Visit on a computer for the full experience.
        </p>
      </div>
    );
  }

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
          marginBottom: "var(--space-3)",
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
            {started ? `${timeLeft}s` : `${timeLimit}s`}
          </span>
          <button type="button" className="typing-reset" onClick={(e) => { e.stopPropagation(); initTest(); setTimeout(() => inputRef.current?.focus(), 0); }}>
            reset
          </button>
        </div>
      </div>

      <div
        data-testid="typing-test-mode-bar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          marginBottom: "var(--space-4)",
          flexWrap: "wrap",
          opacity: started ? 0.3 : 1,
          pointerEvents: started ? "none" : "auto",
          transition: "opacity 200ms ease",
        }}
      >
        {WORD_MODES.map((m) => (
          <button
            type="button"
            key={m.key}
            data-testid={`typing-mode-${m.key}`}
            style={modeButtonStyle(mode === m.key)}
            onClick={(e) => { e.stopPropagation(); handleModeChange(m.key); }}
            aria-pressed={mode === m.key}
            disabled={started}
          >
            {m.label}
          </button>
        ))}
        <span style={{ width: "1px", height: "16px", background: "var(--color-border)", margin: "0 var(--space-2)" }} />
        {TIME_OPTIONS.map((t) => (
          <button
            type="button"
            key={t}
            data-testid={`typing-time-${t}`}
            style={timeButtonStyle(timeLimit === t)}
            onClick={(e) => { e.stopPropagation(); handleTimeChange(t); }}
            aria-pressed={timeLimit === t}
            disabled={started}
          >
            {t}s
          </button>
        ))}
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
          <div aria-live="polite" aria-atomic="true">
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
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}
        >
          Test complete. {wpm} words per minute, {accuracy}% accuracy.
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
