# Security checks in this repo

This repo has automated checks that run on every commit.

## What runs at commit time (locally, via husky)

1. **Malware scan** — checks staged files for PolinRider / obfuscated-JS supply-chain malware markers. Excludes `node_modules`, `dist`, `build`, etc.
2. **Lint** (if a `lint` script exists in `package.json`)
3. **Build** (if a `build` script exists in `package.json` — frontend repos only)

If any step fails, the commit is blocked with a clear message.

## What runs server-side (on every PR)

- The same malware scan
- **Socket** scans `package.json` and lockfile changes for malicious npm packages
- The PR cannot merge until both pass

## Scopes (what gets scanned)

The scanner has three modes:

| Mode | Used by | What it scans |
|---|---|---|
| `staged` | husky pre-commit hook | Only files you're about to commit |
| `all` | `npm run scan:malware`, PR CI | All tracked files **except** build output (`dist/`, `build/`, `.next/`, etc.) |
| `deep` | `npm run scan:malware:deep`, push-to-default CI | **Everything**, including build output |

Why two depths? Build-output directories regenerate constantly; scanning them on every PR produces noise when devs legitimately update bundles. But malware can hide in committed `dist/` JS or in font/image files — so we run a deep scan on push-to-default and you can run one manually with `npm run scan:malware:deep`.

The scanner inspects **all file types**, not just source code. PolinRider has been observed hiding payloads in:
- Config files (`*.config.{js,ts,mjs,cjs}`)
- Font files (`.woff`, `.woff2`)
- Compiled JS in `dist/` / `build/` directories
- VS Code workspace files (`.vscode/tasks.json`)
- Static assets in `public/` / `static/`

## Emergency bypass


If lint or build is blocking a critical hotfix, you can skip those steps locally:

```bash
SKIP_LINT=1 git commit -m "..."
SKIP_BUILD=1 git commit -m "..."
```

**The malware scan cannot be skipped locally**, and the same scan runs server-side regardless. Don't try to bypass with `git commit --no-verify` — server CI will reject the push.

## Adjusting the build timeout

Default build timeout is 300 seconds. If your build legitimately takes longer:

```bash
BUILD_TIMEOUT=600 git commit -m "..."
```

## If the malware scan flags your commit

1. Open each flagged file. Scroll to the bottom.
2. PolinRider appends one long obfuscated line starting with `global['_V']=`, `global['!']=`, or `var _$_`.
3. Delete that line. Save. `git add`. Re-commit.
4. **If you didn't write that line**, your machine may be compromised. Stop using it and contact the org owner immediately. Rotate: GitHub PAT, SSH keys, npm tokens, browser-saved passwords, any `.env` secrets you have access to.

## Where the rules live

- `.husky/pre-commit` — orchestrator
- `scripts/security/scan-malware.sh` — malware marker list & scanner
- `.github/workflows/security.yml` — server-side enforcement
- `socket.yml` — Socket.dev config

To update the marker list across all repos, edit the canonical version and re-run the org-wide rollout script.
