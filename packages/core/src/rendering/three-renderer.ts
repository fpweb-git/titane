import * as THREE from 'three';
import { IRenderer } from '../runtime/renderer-interface';
import { World } from '../ecs/kernel/world';
import { query } from '../ecs/kernel/query';
import { getComponent } from '../ecs/kernel/component';
import { TRANSFORM_ID, Transform } from '../ecs/components/transform';
import { MESH_ID, MeshData } from '../ecs/components/mesh';

/**
 * Three.js implementation of the Titane Renderer.
 * Handles the mapping between ECS data and Three.js Object3D instances.
 */
export class ThreeRenderer implements IRenderer {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private gridHelper!: THREE.GridHelper;
    /** Internal cache to link ECS entities to Three.js objects */
    private entityObjectMap = new Map<number, THREE.Mesh>();

    public init(canvas: HTMLCanvasElement): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0a0a0a');

        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        // Lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040, 0.8));

        // Grid
        this.gridHelper = new THREE.GridHelper(20, 20, '#444444', '#222222');
        this.scene.add(this.gridHelper);
    }

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

    public setSize(width: number, height: number): void {
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    public setGridVisible(visible: boolean): void {
        this.gridHelper.visible = visible;
    }

    public render(world: World): void {
        const activeEntities = query(world, [TRANSFORM_ID, MESH_ID]);
        const activeEntitiesSet = new Set(activeEntities);

        // 1. PHASE DE NETTOYAGE (Cleanup)
        for (const [entityId, threeMesh] of this.entityObjectMap.entries()) {
            if (!activeEntitiesSet.has(entityId)) {
                this.scene.remove(threeMesh);

                // Clean up GPU memory
                threeMesh.geometry.dispose();
                if (Array.isArray(threeMesh.material)) {
                    threeMesh.material.forEach(m => m.dispose());
                } else {
                    threeMesh.material.dispose();
                }

                this.entityObjectMap.delete(entityId);
            }
        }

        // 2. UPDATE & SYNC
        for (const entityId of activeEntities) {
            const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
            const meshData = getComponent<MeshData>(world, entityId, MESH_ID);
            if (!transform || !meshData) continue;

            // Creation if new
            if (!this.entityObjectMap.has(entityId)) {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshStandardMaterial({ color: meshData.color });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.matrixAutoUpdate = false;
                this.scene.add(mesh);
                this.entityObjectMap.set(entityId, mesh);
            }

            // Sync transformations exclusively using the DOD calculated World Matrix
            const mesh = this.entityObjectMap.get(entityId)!;
            mesh.matrix.fromArray(transform.worldMatrix);
        }

        // 3. FINAL DRAW
        this.renderer.render(this.scene, this.camera);
    }

    public dispose(): void {
        this.renderer.dispose();
        // Clean up all remaining objects
        for (const mesh of this.entityObjectMap.values()) {
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
            else mesh.material.dispose();
        }
        this.entityObjectMap.clear();
    }
}