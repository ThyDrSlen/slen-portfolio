# slen.win

Personal portfolio for Fabrizio Corrales — backend-focused software engineer.

**Live:** [slen.win](https://slen.win)

## Stack

Next.js 16 · React 19 · TypeScript · Vanilla CSS · Vercel

## Features

- Interactive terminal with 12+ commands, tab completion, and easter eggs
- 4-mode typing test (code / snippets / leetcode / systems) with WPM tracking and personal bests
- Boot sequence overlay, cursor trail, scroll reveals, and matrix card hover effects
- GitHub commit pulse — live SVG heartbeat from real activity data
- Status bar with live NYC time and F-train indicator

## Development

```bash
pnpm install
pnpm dev
```

## Testing

```bash
pnpm lint          # ESLint
pnpm typecheck     # TypeScript
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright (Chromium)
```

A husky pre-push hook runs lint → typecheck → unit tests → build before every push.

## License

MIT
