# Periodic element visualizer

Interactive periodic table with a Bohr-style 3D atom viewer. Click any of the 118 elements to inspect its nucleus, electron shells, and short reference facts.

**Live site:** [ronpicard.github.io/periodic-table-element-visualizor](https://ronpicard.github.io/periodic-table-element-visualizor/)

## Quickstart

Requires **Node.js 20+**.

```bash
npm ci
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Usage

1. Select an element on the periodic table grid.
2. Use the right panel to rotate the 3D model (drag) and zoom (scroll).
3. Read proton, neutron, electron, and shell counts plus discovery, isotopes, uses, and origin notes below the viewer.

## Configuration

| Setting | Location | Notes |
| --- | --- | --- |
| Dev server port | Vite default | Override with `npm run dev -- --port 3000` |
| Production base path | `vite.config.ts` | Set to `/periodic-table-element-visualizor/` for GitHub Pages |
| Path alias `@/` | `vite.config.ts`, `tsconfig` | Maps to `src/` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Typecheck and production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Project layout

```text
src/
├── features/
│   ├── atom-viewer/     # 3D canvas, nucleus, shells, element facts
│   └── periodic-table/  # Grid and element tiles
└── shared/
    ├── data/            # Elements and per-element info
    ├── lib/             # Shell filling, nucleus layout, orbit math
    └── types/
```

Feature-first layout: import from feature `index.ts` files, not deep paths across features.

## Deployment

Pushes to `main` run [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) and publish `dist/` to GitHub Pages.

## Documentation

- [REQUIREMENTS.md](REQUIREMENTS.md) — product requirements and constraints
- [CHANGELOG.md](CHANGELOG.md) — user-visible changes by release

## Contributing

Private repository. Open issues or pull requests on GitHub if you have access.
