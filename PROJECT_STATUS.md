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
- [x] **Functional ECS Core**: Strict data/logic separation (Entity, Component, Query).
- [x] **Advanced Runtime**: `TitaneEngine` with independent Logic and Render loops.
- [x] **DeltaTime Management**: Precision `Clock` for frame-independent movement.
- [x] **Modular UI Architecture**: Refactored Inspector, Hierarchy, and UI components.
- [x] **Inspector Logic**: Encapsulated actions (Delete, Duplicate) in `useInspectorActions`.
- [x] **Simulation Control**: Play/Pause/Step functionality via `useRuntime`.
- [x] **Visual Aids**: Integrated `GridHelper` in the 3D viewport.
- [x] **Memory Management**: Automatic GPU resource cleanup (`dispose`) in `RenderSystem`.

## ⏳ In Progress
- [ ] **Scene State Management**: Capturing the initial world state before "Play".
- [ ] **Viewport Interaction**: Raycasting for clicking objects directly in 3D.

## 📋 Next Tasks
1. **Entity Naming**: Add a `Name` component to replace "GameObject #ID" with custom names.
2. **Scene Reset**: Implement a way to revert all entities to their "Pre-Play" positions.
3. **Transform Gizmos**: Add visual axes (X, Y, Z) to the selected entity in the viewport.
4. **Enhanced Factory**: Allow color and primitive selection (Sphere, Plane) in the UI.