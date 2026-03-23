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
**Editor Workspace Foundations & Runtime Control**

## ✅ Completed
- [x] **Renderer Decoupling**: Injected `IRenderer` into `TitaneEngine`, replacing hardcoded `ThreeRenderer`.
- [x] **ECS Typings**: Strict `unknown` usage instead of `any` internally for Component Maps.
- [x] **Functional ECS Core**: Strict data/logic separation (Entity, Component, Query).
- [x] **Advanced Runtime**: `TitaneEngine` with independent Logic and Render loops.
- [x] **DeltaTime Management**: Precision `Clock` for frame-independent movement.
- [x] **Modular UI Architecture**: Refactored Inspector, Hierarchy, and UI components.
- [x] **Inspector Logic**: Encapsulated actions (Delete, Duplicate) in `useInspectorActions`.
- [x] **Simulation Control**: Play/Pause/Step functionality via `useRuntime`.
- [x] **Visual Aids**: Integrated `GridHelper` in the 3D viewport.
- [x] **Memory Management**: Automatic GPU resource cleanup (`dispose`) in `RenderSystem`.
- [x] **Renderer Abstraction**: `IRenderer` interface defined.
- [x] **Three.js Driver**: Encapsulated camera and scene logic.
- [x] **Corrected HandleResize**: Decoupled resize logic (now driver-side).
- [x] **Clean Runtime**: `TitaneEngine` no longer imports `THREE`.
- [x] **API Forteresse**: Encapsulated `world._components`.
- [x] **Safe Accessors**: `add`, `get`, `remove`, `has`, and `updateComponent` (const arrows + JSDoc).
- [x] **Optimized Query**: "Smallest-store-first" iteration logic (const arrow + JSDoc).

## ⏳ In Progress
- [ ] **Entity Naming**: Transitioning to "named" entities for better UX.
- [ ] **Command API for Editor**: Finishing the `updateComponent` integration in the UI.

## 📋 Next Tasks
1. **Name Component**: Create the data structure and factory.
2. **Hierarchy Refresh**: Update the Sidebar to show names instead of IDs.
3. **Scheduler**: Implement strict execution phases (Input -> Logic -> Render).