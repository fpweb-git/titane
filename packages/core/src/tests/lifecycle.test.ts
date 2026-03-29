import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TitaneEngine } from '../runtime/engine';
import { IRenderer } from '../runtime/renderer-interface';

describe('Engine Lifecycle', () => {
    let mockRenderer: IRenderer;
    let canvas: HTMLCanvasElement;
    let engine: TitaneEngine;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 16)));

        mockRenderer = {
            init: vi.fn(),
            render: vi.fn(),
            handleResize: vi.fn(),
            setGridVisible: vi.fn(),
        } as unknown as IRenderer;

        canvas = {} as HTMLCanvasElement; // Mock canvas
        engine = new TitaneEngine(mockRenderer, canvas);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('should initialize the renderer on creation', () => {
        expect(mockRenderer.init).toHaveBeenCalledWith(canvas);
        expect(engine.isPaused).toBe(true); // By default
    });

    it('should start and stop the loop gracefully', () => {
        expect((engine as any).isRunning).toBe(false);

        engine.start();
        expect((engine as any).isRunning).toBe(true);
        expect(vi.mocked(requestAnimationFrame)).toHaveBeenCalled();

        engine.stop();
        expect((engine as any).isRunning).toBe(false);
    });

    it('should render continuously even if engine logic is paused', () => {
        // Manually trigger the loop exactly once
        engine.start();
        engine.isPaused = true;

        // Let fake timers simulate passing of time (1 frame ~ 16ms)
        vi.advanceTimersByTime(16);

        // The render phase should always run
        expect(mockRenderer.render).toHaveBeenCalledWith(engine.world);

        engine.stop();
    });

    it('should save and restore world snapshots cleanly', () => {
        const initialWorld = engine.world;

        engine.saveSnapshot();

        // Mutate current world
        engine.world = {} as any;
        expect(engine.world).not.toBe(initialWorld);

        engine.restoreSnapshot();

        // The restored world should match the structure of the initial
        // Note: cloneWorld is used internally, we just ensure it restored a non-null object
        expect(engine.world).toBeDefined();
        // and shouldn't be the mutated garbage we just set
        expect(engine.world).not.toStrictEqual({});

        // Let's verify we didn't just point back to the same reference
        expect(engine.world).not.toBe(initialWorld); // Real clone
    });
});
