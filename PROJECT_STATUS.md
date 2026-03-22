# Titane Engine - Project Status & Roadmap

## Current Vision
A data-oriented, ECS-based 3D game engine.
- **Core:** Minimalist, handles entity storage, system scheduling, and game loop.
- **Renderer:** Pluggable (currently Three.js).
- **Editor:** Nuxt 4 based visual interface.

## Project Structure (Monorepo)
- `packages/core`: The ECS World, Query engine, and Loop.
- `packages/renderer`: Three.js implementation (bridges ECS data to 3D visuals).
- `editor/titane-editor`: The Nuxt UI.

## Architecture Rules
1. **Entities** are just `number` IDs.
2. **Components** are pure data objects (no logic).
3. **Systems** are functions or classes that iterate over queries.
4. **Public API** must be used for all modifications (Internal Maps are private).

## 🎯 Current Milestone
**ECS Kernel Stabilization (Functional & Documented)**

## ✅ Completed
- [x] Full Functional ECS Core with String IDs.
- [x] JSDoc documentation for all Kernel functions.
- [x] `Transform` interface and factory implementation.
- [x] Strict separation of data (Interfaces) and logic (Functions).

## ⏳ In Progress
- [ ] Validating the data-flow with a basic test loop.

## 📋 Next Tasks
1. Create a `MovementSystem` in `ecs/systems/` to test `query` and `getComponent`.
2. Build a minimal `EngineRunner` that wraps the `World` and `requestAnimationFrame`.
3. Connect the ECS state to the Nuxt Editor hierarchy view.