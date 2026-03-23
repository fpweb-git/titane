import { World, createWorld } from '../ecs/world';
import { movementSystem } from '../ecs/systems/movement';
import { Clock } from '../utils/clock';
import { IRenderer } from './renderer-interface';
import { ThreeRenderer } from '../rendering/three-renderer';

/**
 * The high-level runner for the Titane Engine.
 * Manages the execution pipeline and delegates rendering to a driver.
 */
export class TitaneEngine {
    public readonly world: World;
    public isPaused: boolean = false;

    private renderer: IRenderer;
    private clock: Clock;
    private isRunning: boolean = false;

    /**
     * @param canvasElement - The target canvas for rendering.
     */
    constructor(canvasElement: HTMLCanvasElement) {
        this.world = createWorld();
        this.clock = new Clock();

        // We use the Three.js implementation by default
        this.renderer = new ThreeRenderer();
        this.renderer.init(canvasElement);
    }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clock.getDelta();
        this.loop();
    }

    public stop(): void {
        this.isRunning = false;
    }

    public handleResize(): void {
        this.renderer.handleResize();
    }

    /**
     * Wrapper for renderer grid visibility.
     */
    public setGridVisible(visible: boolean): void {
        this.renderer.setGridVisible(visible);
    }

    private loop(): void {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();

        // Phase 1: Gameplay / Physics
        if (!this.isPaused) {
            movementSystem(this.world, deltaTime);
        }

        // Phase 2: Render (Delegated to the driver)
        this.renderer.render(this.world);

        requestAnimationFrame(() => this.loop());
    }
}