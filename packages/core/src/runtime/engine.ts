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
    public readonly world: World;
    public isPaused: boolean = false;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private clock: Clock;
    private isRunning: boolean = false;

    // Editor Helpers
    private gridHelper: THREE.GridHelper;

    /**
     * Initializes the engine with a target canvas.
     * @param canvasElement The HTML5 Canvas to render into.
     */
    constructor(canvasElement: HTMLCanvasElement) {
        this.world = createWorld();
        this.clock = new Clock();

        // 1. Scene Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0a0a0a'); // Fond très sombre style "Engine"

        // 2. Camera Setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvasElement.clientWidth / canvasElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // 3. Renderer Setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

        // 4. Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040, 0.8));

        // 5. Grid Helper (Editor Layer)
        // Paramètres : Taille totale, Divisions, Couleur axe central, Couleur lignes
        this.gridHelper = new THREE.GridHelper(20, 20, '#444444', '#222222');
        this.scene.add(this.gridHelper);
    }

    /**
     * Toggles the visibility of the ground grid.
     */
    public setGridVisible(visible: boolean): void {
        this.gridHelper.visible = visible;
    }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clock.getDelta();
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

        // Phase 1: Logic (Only if not paused)
        if (!this.isPaused) {
            movementSystem(this.world, deltaTime);
        }

        // Phase 2: Render (Always running for the editor)
        renderSystem(this.world, this.scene, this.camera, this.renderer);

        requestAnimationFrame(() => this.loop());
    }
}