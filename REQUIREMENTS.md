# Requirements

## Periodic table

- The app MUST display all 118 elements in standard periodic table grid positions (including lanthanide and actinide rows).
- Each tile MUST show atomic number, symbol, and name (name MAY hide on very narrow viewports).
- Tiles MUST be color-coded by element category with a visible legend.
- Clicking a tile MUST select that element and update the atom viewer and facts panel.
- The selected tile MUST have a distinct visual state accessible to keyboard and pointer users.

## Atom viewer

- The viewer MUST render a 3D Bohr-style model for the selected element.
- The nucleus MUST show the correct proton count (atomic number) and neutron count (from rounded atomic mass).
- Protons and neutrons MUST be distributed through the nucleus volume, not segregated into inner/outer layers.
- Electrons MUST orbit on paths matching subshell structure (s, p, d, f) for the filled shell configuration.
- Inner electron shells MUST orbit faster than outer shells (Bohr-style angular speed scaling).
- Users MUST be able to rotate the model by dragging and zoom with scroll/wheel.
- The viewer MUST show proton, neutron, electron, and per-shell electron counts.

## Element information

- For each element, the app MUST show short text for: discovery (when/where/how), known isotopes, common uses, notable characteristics, and whether it is natural, synthetic, or both.
- Facts MUST update when the user selects a different element.

## Presentation

- The layout MUST use the available viewport width on desktop (no arbitrary narrow max-width cap on the main app).
- The UI MUST remain usable on mobile (stacked layout, simplified tiles where needed).
- The app MUST respect `prefers-reduced-motion` for CSS transitions.

## Deployment

- Production builds MUST use the GitHub Pages base path `/periodic-table-element-visualizor/`.
- Pushes to `main` MUST trigger an automated build and GitHub Pages deploy via GitHub Actions.

## Technical constraints

- Runtime MUST be Node.js 20 or newer (see `package.json` `engines`).
- Source MUST follow feature-first layout under `src/features/` with shared code in `src/shared/`.
- Dependencies MUST stay on maintained stable major versions (no alpha/beta on main).

## Non-goals

- Quantum-mechanical orbital shapes (probability clouds, nodal surfaces).
- Chemical bonding, ions, or molecular visualization.
- User accounts, persistence, or editable element data.
