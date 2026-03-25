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
- [x] **Entity Naming**: `Name` component implemented and exported correctly.
- [x] **Documentation**: Translated README.md to English to unify project language.
- [x] **Scene State Snapshots**: Deep cloning for "Reset Scene" functionality.
- [x] **JSON Serialization**: Logic to stringify/parse the `World` state while preserving Maps and IDs.

## ⏳ In Progress
- [ ] **File System Bridge**: Adding "Save" and "Open" buttons in the Editor TopBar.
- [ ] **Input System**: Capturing Keyboard/Mouse events to be stored in the ECS for system consumption.
- [ ] **API Protection**: Final pass to ensure no direct `any` or illegal internal access remains.

## 📋 Next Tasks

### 1️⃣ Phase: Persistence (High Priority)
1. **JSON Export/Import**: Create `serializeWorld` and `deserializeWorld` utilities.
2. **File System Integration**: Add "Save Project" to download a `.json` file and "Load Project" to restore it.
3. **Asset Metadata**: Basic structure to track external assets (textures/models) in the JSON schema.

### 2️⃣ Phase: Interaction (Medium Priority)
1. **Input Driver**: Map browser events to an `Input` component or global state in the ECS.
2. **Transform Refactor**: Separation of `LocalTransform` and `WorldTransform` to support parenting logic.
3. **Manual Reset**: Add a dedicated "Reset Scene" button in the UI to revert to the last snapshot without toggling Play.

### 3️⃣ Phase: Visual Tooling (Long Term)
1. **Transformation Gizmos**: On-screen handles for Translate, Rotate, and Scale.
2. **Viewport Raycasting**: Entity selection by clicking directly on 3D meshes.