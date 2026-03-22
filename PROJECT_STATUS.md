# Titane Engine - Project Status & Roadmap

## Current Vision
A data-oriented, ECS-based 3D game engine.
- **Core:** Minimalist, handles entity storage, system scheduling, and game loop.
- **Renderer:** Pluggable (currently Three.js).
- **Editor:** Nuxt 4 based visual interface.

## Project Structure (Monorepo)
- `packages/core`: The ECS World, Query engine, and Loop.
- `packages/renderer`: Three.js implementation (bridges ECS data to 3D visuals).
- `editor/editor`: The Nuxt UI.

## Architecture Rules
1. **Entities** are just `number` IDs.
2. **Components** are pure data objects (no logic).
3. **Systems** are functions or classes that iterate over queries.
4. **Public API** must be used for all modifications (Internal Maps are private).

## 🎯 Current Milestone
**Modular Editor & Logic Decoupling**

## ✅ Completed
- [x] Full Functional ECS Core.
- [x] RenderSystem with Cleanup phase.
- [x] **Refactored Inspector logic into `useInspectorActions` composable.**
- [x] Nuxt UI Integration for Hierarchy and Inspector.

## ⏳ In Progress
- [ ] Global Play/Pause simulation state.
- [ ] Transform gizmos or simple click-to-select in viewport.

## 📋 Next Tasks
1. Add a **Play/Pause** button in the TopBar (via a new `useRuntime` composable).
2. Create a `MeshInspector` to change colors/shapes.
3. Add a "Reset Scene" button in the hierarchy.