import { World, createWorld } from '../ecs/kernel/world';
import { Clock } from '../utils/clock';
import { IRenderer } from './renderer-interface';
import { Scheduler, createScheduler, runScheduler } from '../ecs/pipeline/scheduler';
import { createEntity } from '../ecs/kernel/entity';
import { addComponent } from '../ecs/kernel/component';
import { INPUT_ID, createDefaultInput } from '../ecs/components/input';
import { InputDriver } from './input-driver';
import { Entity } from '../ecs/types';
import { setupDefaultPipeline } from '../ecs/pipeline/setup';
import { captureWorldState } from '../ecs/kernel/state-manager';
import { NAME_ID } from '../ecs/components/name';

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
    public scheduler: Scheduler;
    public renderer: IRenderer;
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
        // Ajoute ceci pour que l'éditeur l'affiche correctement :
        addComponent(this.world, this.globalInputEntity, NAME_ID, { value: 'System (Global Input)' })

        // 3. Mount the Input Driver logic matching standard Editor Window APIs
        this.inputDriver = new InputDriver(this.world, this.globalInputEntity, canvasElement);

        // 4. Setup the functional scheduler pipeline
        this.scheduler = createScheduler();

        // 5. Build the deterministic engine pipeline functionally
        setupDefaultPipeline(this);
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
        this.snapshot = captureWorldState(this.world);
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
        this.world = captureWorldState(this.snapshot);
        console.log('World restored from snapshot');
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