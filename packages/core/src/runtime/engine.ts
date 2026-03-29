import { World, createWorld } from '../ecs/world';
import { movementSystem } from '../ecs/systems/movement';
import { Clock } from '../utils/clock';
import { IRenderer } from './renderer-interface';
import { Scheduler, createScheduler, registerSystem, runScheduler } from '../ecs/scheduler';
import { Phase } from '../ecs/system';
import { cloneWorld } from '../ecs/world-utils';
import { createEntity } from '../ecs/entity';
import { addComponent } from '../ecs/component';
import { INPUT_ID, createDefaultInput } from '../ecs/components/input';
import { InputDriver } from './input-driver';
import { clearInputSystem } from '../ecs/systems/input-system';
import { Entity } from '../ecs/types';

/**
 * The high-level runner for the Titane Engine.
 * Manages the execution pipeline via a functional Scheduler and delegates rendering to a driver.
 */
export class TitaneEngine {
    /** The single source of truth for the game state */
    public world: World;

    /** Toggle to freeze logic systems without stopping the render loop */
    public isPaused: boolean = true;

    private snapshot: World | null = null;
    private scheduler: Scheduler;
    private renderer: IRenderer;
    private clock: Clock;
    private isRunning: boolean = false;
    private inputDriver: InputDriver;
    
    /** Public access to the singleton entity ID hosting tracking inputs */
    public globalInputEntity: Entity;

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

        // 2. Spawn the Core Global Input Entity dynamically
        this.globalInputEntity = createEntity(this.world);
        addComponent(this.world, this.globalInputEntity, INPUT_ID, createDefaultInput());

        // 3. Mount the Input Driver logic matching standard Editor Window APIs
        this.inputDriver = new InputDriver(this.world, this.globalInputEntity, canvasElement);

        // 4. Setup the functional scheduler pipeline
        this.scheduler = createScheduler();

        // 5. Register core systems into their respective phases
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

        // Frame Cleanup: Wipe inputs down that last one frame exactly
        registerSystem(this.scheduler, Phase.POST_PHYSICS, (world) => {
            if (!this.isPaused) {
                clearInputSystem(world);
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
     * Completely strip browser hook allocations allowing for clean editor garbage cleanup
     */
    public dispose(): void {
        this.stop();
        this.inputDriver.dispose();
    }

    /**
     * Captures the current state of the world.
     */
    public saveSnapshot(): void {
        this.snapshot = cloneWorld(this.world);
        console.log('Snapshot saved');
    }

    /**
     * Restores the world to its previously saved state.
     */
    public restoreSnapshot(): void {
        if (!this.snapshot) {
            console.warn('No snapshot found to restore');
            return;
        }
        // Replace the current world with the snapshot clone
        this.world = cloneWorld(this.snapshot);
        console.log('World restored from snapshot');
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