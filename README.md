# DrewBeFree

Personal repos for apps, sites, and homelab infrastructure.

---

## Repos

| Category | What's here |
|----------|-------------|
| [Apps](https://github.com/DrewBeFree?tab=repositories&q=topic%3Aapp) | Web apps (poker, golf, daily planner, recipes, etc.) |
| [Sites](https://github.com/DrewBeFree?tab=repositories&q=topic%3Asite) | Public-facing websites (dwebbsolutions, kybernet-tech, photography) |
| [Infra](https://github.com/DrewBeFree?tab=repositories&q=topic%3Ainfra) | Homelab infrastructure docs (Alienware + PowerEdge setup) |
| [Agents](https://github.com/DrewBeFree?tab=repositories&q=topic%3Aagents) | AI agent projects (recap-agents) |

---

## Filtering repos by category

Each repo is tagged with a topic. Click the links in the table above, or use the search bar on the [repositories tab](https://github.com/DrewBeFree?tab=repositories):

- `topic:app` — all apps
- `topic:site` — all sites
- `topic:infra` — infrastructure
- `topic:agents` — agent projects

---

## AI Dog Trainer

An interactive AI-powered dog training assistant that speaks commands directly to your dog using your browser's built-in voice synthesis.

### Features
- **Talks to your dog** — text-to-speech reads training commands aloud (parenthetical owner tips are skipped)
- **Voice input** — speak to report what your dog did
- **Quick buttons** — one-tap reporting for common behaviors (sat, stayed, ignored, barked, etc.)
- **Persistent history** — session history saved to `history.json` so you can pick up where you left off
- **New session** — clear history and start fresh with a new dog anytime

### Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your Anthropic API key
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
uvicorn app:app --reload

# 4. Open http://localhost:8000 in your browser
```

The app will greet you and ask for your dog's name, breed, and age to tailor the training session.
