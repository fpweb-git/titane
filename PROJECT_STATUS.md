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
**Engine Polishing & DX Improvements**

## ✅ Completed
- [x] Full Functional ECS Core.
- [x] `TitaneEngine` Runtime with JSDoc and `handleResize`.
- [x] Precise `Clock` for delta time management.
- [x] `EntityFactory` to simplify entity spawning.
- [x] Vue Viewport component with proper resize event management.
- [x] `useTitane` Nuxt Composable for global engine access.
- [x] Standardized `apps/editor` and `packages/core` communication.
- [x] ESLint configuration for custom Vue props line breaking.

## ⏳ In Progress
- [ ] Making the Hierarchy reactive to real-time ECS changes.
- [ ] Implementing Entity Selection state.

## 📋 Next Tasks
1. Build a real `Hierarchy` component to list and select entities.
2. Implement a `SelectionSystem` or a simple state to track the "Active Entity".
3. Add a "Play/Pause" button in the Editor TopBar that calls `engine.start()` / `engine.stop()`