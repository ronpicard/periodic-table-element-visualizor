# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `README.md`, `CHANGELOG.md`, and `REQUIREMENTS.md` per project documentation rules.

### Fixed

- Nucleus protons and neutrons visible again (restored per-color instanced rendering; instance-color path failed under React Three Fiber).

## [1.0.0] - 2026-05-25

### Added

- Interactive periodic table for all 118 elements with category color coding and legend.
- Bohr-style 3D atom viewer (nucleus, subshell-based electron orbits, shell rings).
- Element facts panel: discovery, isotopes, common uses, notable traits, and natural vs synthetic origin.
- GitHub Actions workflow to build and deploy to GitHub Pages on each push to `main`.

### Changed

- Nucleus layout interleaves protons and neutrons with close-packed positioning and correct depth sorting.
- Electron motion uses s/p/d/f orbital planes and shell-dependent angular speeds instead of rigid spinning rings.
- UI refresh: glass panels, design tokens, category accents, and responsive full-width layout.

### Fixed

- Layout uses full viewport width on large screens (removed 1400px content cap).
