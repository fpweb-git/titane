import * as THREE from 'three';
import { World, createWorld } from '../ecs/world';
import { renderSystem } from '../rendering/render-system';
import { movementSystem } from '../ecs/systems/movement';
import { Clock } from '../utils/clock';

/**
 * The high-level runner for the Titane Engine.
 * Responsible for managing the ECS World, the Three.js rendering context,
 * and the main execution loop.
 */
export class TitaneEngine {
    /** The global ECS state containing all entities and components */
    public readonly world: World;
    public isPaused: boolean = false;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private clock: Clock;
    private isRunning: boolean = false;

    /**
     * Initializes the engine with a target canvas.
     * @param canvasElement The HTML5 Canvas to render into.
     */
    constructor(canvasElement: HTMLCanvasElement) {
        this.world = createWorld();
        this.clock = new Clock();

        // Initialize Three.js Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#1a1a1a');

        // Initialize Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvasElement.clientWidth / canvasElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);

        // Initialize Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            antialias: true,
            alpha: false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

        // Basic Lighting Setup
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);
        this.scene.add(new THREE.AmbientLight(0x404040, 0.5));
    }

    /**
     * Starts the engine loop and resets the clock.
     */
    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clock.getDelta(); // Reset clock to avoid jump on start
        this.loop();
    }

    /**
     * Stops the engine loop.
     */
    public stop(): void {
        this.isRunning = false;
    }

    /**
     * Updates the rendering dimensions and camera aspect ratio.
     * Should be called whenever the container size changes.
     */
    public handleResize(): void {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (canvas.width !== width || canvas.height !== height) {
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * The internal core loop triggered via requestAnimationFrame.
     * Orchestrates system execution and rendering.
     * @private
     */
    private loop(): void {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();

        // 1. Logic phase: Update entity data
        if (!this.isPaused) {
            movementSystem(this.world, deltaTime);
        }

        // 2. Rendering phase: Sync ECS to Three.js and Draw
        renderSystem(this.world, this.scene, this.camera, this.renderer);

        requestAnimationFrame(() => this.loop());
    }
}