# Personal Stocktake

A lightning-fast webapp for personal household inventory tracking. Track stock levels of common supplies (batteries, soap, cleaning products) without any friction, logins, or setup screens.

## Why This Exists

Kevin is tired of never knowing how many batteries, trash bags, or boxes of soap he actually has at home. Paper lists get lost and remembering details mentally is unreliable. This app solves that problem with a dead-simple tool: open the app, see your inventory, update counts with a tap, and know exactly what you have.

No more overbuying. No more surprise shortages. Household management as easy as it should be.

## Features

- **Zero friction** — No login, no setup, no onboarding. Open and use immediately.
- **Instant inline editing** — Click a count to edit, use +/- buttons for quick adjustments
- **Category filtering** — Filter by category to find items fast
- **Custom categories** — Add your own categories on the fly
- **Low stock warnings** — Visual indicators for zero/low stock items
- **Fully offline** — All data stored in browser localStorage
- **Mobile-friendly** — Responsive design, touch-optimized controls

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Data Storage

All inventory data is stored locally in your browser's localStorage. No server, no accounts, no data leaves your device. You remain fully in control of your data.

**Note:** Clearing browser data will erase your inventory.

## Design Principles

- **Speed first** — Fastest possible input/edit experience
- **Minimalism** — Large, tappable controls; immediate feedback
- **Mobile-ready** — Works great on phone, tablet, and desktop
- **Accessible** — Strong color contrast, proper text sizing, keyboard navigation

## Future Roadmap

- [ ] Item photos/attachments
- [ ] PWA support for true offline access
- [ ] Export/import inventory data
