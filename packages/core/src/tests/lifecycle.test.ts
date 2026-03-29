import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TitaneEngine } from '../runtime/engine';
import { IRenderer } from '../runtime/renderer-interface';
import { Name, NAME_ID } from '../ecs/components/name';
import { addComponent, getComponent } from '../ecs/kernel/component';
import { createEntity } from '../ecs/kernel/entity';

/**
 * Mock Renderer to avoid WebGL dependencies in Node environment.
 */
const createMockRenderer = (): IRenderer => ({
    init: vi.fn(),
    render: vi.fn(),
    handleResize: vi.fn(),
    setSize: vi.fn(),
    setGridVisible: vi.fn(),
    dispose: vi.fn(),
});

describe('Engine Lifecycle & State Management', () => {
    let engine: TitaneEngine;
    let mockRenderer: IRenderer;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        vi.useFakeTimers();

        // 1. Mock requestAnimationFrame globally for Node.js
        // We use setTimeout to simulate a frame tick
        vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 16)));
        vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));

        mockRenderer = createMockRenderer();

        // 2. Updated Canvas Mock
        canvas = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            getBoundingClientRect: vi.fn(() => ({ width: 800, height: 600, top: 0, left: 0 })),
            getContext: vi.fn(),
        } as unknown as HTMLCanvasElement;

        engine = new TitaneEngine(mockRenderer, canvas);
    });

    it('should initialize with a valid world and global input entity', () => {
        expect(engine.world).toBeDefined();
        expect(engine.globalInputEntity).toBeDefined();
        // Entity 0 is usually the GlobalInput
        expect(engine.world.entities.active.has(engine.globalInputEntity)).toBe(true);
    });

    it('should capture and restore snapshots without changing the World reference', () => {
        // 1. Setup initial state
        const entity = createEntity(engine.world);
        addComponent(engine.world, entity, NAME_ID, { value: 'Original' } as Name);

        const originalWorldReference = engine.world;

        // 2. Save Snapshot
        engine.saveSnapshot();

        // 3. Mutate the world
        const nameComp = getComponent<Name>(engine.world, entity, NAME_ID);
        if (nameComp) nameComp.value = 'Modified During Play';

        // 4. Restore Snapshot
        engine.restoreSnapshot();

        // ASSERTIONS
        // Reference must be strictly the same for UI reactivity
        expect(engine.world).toBe(originalWorldReference);

        // Data must be restored to original values
        const restoredName = getComponent<Name>(engine.world, entity, NAME_ID);
        expect(restoredName?.value).toBe('Original');
    });

    it('should respect the isPaused flag in the execution loop', async () => {
        engine.start();

        // Case 1: Paused (Editor Mode)
        engine.isPaused = true;
        vi.advanceTimersByTime(16); // Simulate one frame

        // Renderer should be called even when paused
        expect(mockRenderer.render).toHaveBeenCalled();

        // Case 2: Playing (Simulation Mode)
        engine.isPaused = false;
        vi.advanceTimersByTime(16);

        // Bypass private access using bracket notation to avoid TS errors without changing source
        expect(engine['isRunning']).toBe(true);

        engine.stop();
        expect(engine['isRunning']).toBe(false);
    });

    it('should cleanup resources on dispose', () => {
        const stopSpy = vi.spyOn(engine, 'stop');

        engine.dispose();

        expect(stopSpy).toHaveBeenCalled();
        // This confirms the engine orchestration refactor keeps cleanup intact.
    });
});