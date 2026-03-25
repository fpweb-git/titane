import { World, createWorld } from '../ecs/world';
import { movementSystem } from '../ecs/systems/movement';
import { Clock } from '../utils/clock';
import { IRenderer } from './renderer-interface';
import { Scheduler, createScheduler, registerSystem, runScheduler } from '../ecs/scheduler';
import { Phase } from '../ecs/system';

/**
 * The high-level runner for the Titane Engine.
 * Manages the execution pipeline via a functional Scheduler and delegates rendering to a driver.
 */
export class TitaneEngine {
    /** The single source of truth for the game state */
    public readonly world: World;

    /** Toggle to freeze logic systems without stopping the render loop */
    public isPaused: boolean = false;

    private scheduler: Scheduler;
    private renderer: IRenderer;
    private clock: Clock;
    private isRunning: boolean = false;

    /**
     * @param renderer - The renderer implementation (driver) to use.
     * @param canvasElement - The target canvas for rendering.
     */
    constructor(renderer: IRenderer, canvasElement: HTMLCanvasElement) {
        this.world = createWorld();
        this.clock = new Clock();
        this.renderer = renderer;

        // 1. Initialize the renderer driver
        this.renderer.init(canvasElement);

        // 2. Setup the functional scheduler pipeline
        this.scheduler = createScheduler();

        // 3. Register core systems into their respective phases
        this.setupSystems();
    }

    /**
     * Internal setup to link systems to the scheduler phases.
     */
    private setupSystems(): void {
        // Gameplay / Physics Phase
        registerSystem(this.scheduler, Phase.PHYSICS, (world, deltaTime) => {
            if (!this.isPaused) {
                movementSystem(world, deltaTime);
            }
        });

        // Rendering Phase (Always runs to keep the editor responsive)
        registerSystem(this.scheduler, Phase.RENDER, (world) => {
            this.renderer.render(world);
        });
    }

    /**
     * Starts the engine execution loop.
     */
    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clock.getDelta();
        this.loop();
    }

    /**
     * Stops the engine execution loop.
     */
    public stop(): void {
        this.isRunning = false;
    }

    /**
     * Triggers the renderer resize logic.
     */
    public handleResize(): void {
        this.renderer.handleResize();
    }

    /**
     * Toggles the visibility of the editor grid helper.
     * @param visible - Whether the grid should be shown.
     */
    public setGridVisible(visible: boolean): void {
        this.renderer.setGridVisible(visible);
    }

    /**
     * The main execution loop.
     * Delegates all system execution to the functional Scheduler.
     */
    private loop(): void {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();

        // Execution of the deterministic pipeline (Input -> Update -> Physics -> Render)
        runScheduler(this.scheduler, this.world, deltaTime);

        requestAnimationFrame(() => this.loop());
    }
}