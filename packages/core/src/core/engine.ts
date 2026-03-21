import { WebGLRenderer, Scene, PerspectiveCamera, Color } from 'three';

/**
 * The main entry point for the Titane Engine.
 * Manages the Three.js rendering pipeline, the root scene, and the core game loop.
 */
export class TitaneEngine {
    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: PerspectiveCamera;

    private isRunning: boolean = false;
    private animationFrameId: number | null = null;

    constructor(canvasElement: HTMLCanvasElement) {
        this.renderer = new WebGLRenderer({
            canvas: canvasElement,
            antialias: true,
            alpha: false
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.scene = new Scene();
        this.scene.background = new Color('#1e1e2e');

        this.camera = new PerspectiveCamera(
            75,
            canvasElement.clientWidth / canvasElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);

        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Starts the main render loop.
     */
    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.executeLoop();
    }

    /**
     * Stops the loop and cleans up the animation frame request.
     */
    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Updates the renderer and camera aspect ratio to match the canvas size.
     */
    public handleResize(): void {
        const canvasElement = this.renderer.domElement;
        const width = canvasElement.clientWidth;
        const height = canvasElement.clientHeight;

        if (canvasElement.width !== width || canvasElement.height !== height) {
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * The internal game loop executing every frame.
     */
    private executeLoop(): void {
        if (!this.isRunning) return;

        // Note: Physics step and GameObject updates will be injected here later

        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(this.executeLoop.bind(this));
    }
}