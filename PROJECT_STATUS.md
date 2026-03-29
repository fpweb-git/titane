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
**Interaction Systems & Transform Hierarchy**

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
- [x] **File System Bridge**: Adding "Save" and "Open" buttons in the Editor TopBar.
- [x] **Auto-Save System**: Implementation of a "Recovery Buffer" in LocalStorage.
- [x] **Input System**: Capturing Keyboard/Mouse events into the ECS for system consumption (+ Vitest Coverage).
- [x] **Engine Orchestration Refactor**: Decoupled execution logic and state management from TitaneEngine into purely functional modules (state-manager, setup pipeline).

## ⏳ In Progress
- [ ] **Transform Refactor**: Implementing `LocalTransform` vs `WorldTransform` to support **Parenting** (Entity-Entity hierarchy).
- [ ] **Scene Persistence**: Finalizing the `.titane` file schema (versioning and metadata).

## 📋 Next Tasks

### 1️⃣ Phase: Interaction & Logic (High Priority)
1. **Input Driver**: Map browser events (`keydown`, `mousedown`) to a global `Input` state in the ECS.
2. **Parenting Logic**: Update the `TransformSystem` to calculate global matrices based on parent-child relationships.
3. **Manual Reset UI**: Add a dedicated "Reset Scene" button to revert to the initial snapshot without reloading the page.

### 2️⃣ Phase: Visual Tooling (Medium Priority)
1. **Viewport Raycasting**: Entity selection by clicking directly on 3D meshes (using Three.js Raycaster).
2. **Transformation Gizmos**: On-screen handles (Translation/Rotation/Scale) for the selected entity.
3. **Asset Metadata**: Structure for tracking external dependencies (textures, glTF models).

### 3️⃣ Phase: Native Integration (Deprioritized)
1. **File System Access API**: Native "Save" (CTRL+S) to overwrite files on disk without re-downloading.