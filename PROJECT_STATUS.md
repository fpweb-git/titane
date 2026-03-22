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

## ⏳ In Progress
- [ ] Centralizing Engine access via Nuxt Composables.

## 📋 Next Tasks
1. Create a `useTitane` composable in Nuxt to share the engine instance.
2. Build a basic `Hierarchy.vue` component to list active entities.
3. Implement `destroyEntity` logic in the `RenderSystem` (cleanup Three.js objects).