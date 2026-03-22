import * as THREE from 'three';
import { World } from '../ecs/world';
import { query } from '../ecs/query';
import { getComponent } from '../ecs/component';
import { TRANSFORM_ID, Transform } from '../ecs/components/transform';
import { MESH_ID, MeshData } from '../ecs/components/mesh';

/**
 * Internal map to keep track of Three.js objects associated with Entities.
 * This is hidden from the ECS core to maintain pure data separation.
 */
const entityObjectMap = new Map<number, THREE.Mesh>();

/**
 * Synchronizes ECS data with the Three.js scene and performs rendering.
 * @param world The current world state.
 * @param scene The Three.js scene instance.
 * @param camera The Three.js camera instance.
 * @param renderer The Three.js WebGL renderer instance.
 */
export const renderSystem = (
    world: World,
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): void => {
    // 1. Get all entities that have a Transform AND a Mesh
    const entities = query(world, [TRANSFORM_ID, MESH_ID]);

    for (const entityId of entities) {
        const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
        const meshData = getComponent<MeshData>(world, entityId, MESH_ID);

        if (!transform || !meshData) continue;

        // 2. If the Three.js object doesn't exist yet, create it (Pooling/Caching)
        if (!entityObjectMap.has(entityId)) {
            const geometry = new THREE.BoxGeometry(1, 1, 1); // Simplified for now
            const material = new THREE.MeshStandardMaterial({ color: meshData.color });
            const threeMesh = new THREE.Mesh(geometry, material);

            scene.add(threeMesh);
            entityObjectMap.set(entityId, threeMesh);
        }

        // 3. Synchronize ECS data to Three.js
        const mesh = entityObjectMap.get(entityId)!;
        mesh.position.set(transform.position.x, transform.position.y, transform.position.z);
        mesh.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
        mesh.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
    }

    // 4. Render the scene
    renderer.render(scene, camera);
};