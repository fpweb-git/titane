import * as THREE from 'three';
import { World } from '../ecs/world';
import { query } from '../ecs/query';
import { getComponent } from '../ecs/component';
import { TRANSFORM_ID, Transform } from '../ecs/components/transform';
import { MESH_ID, MeshData } from '../ecs/components/mesh';

/**
 * Internal cache to map ECS Entity IDs to their respective Three.js Mesh objects.
 * This allows the renderer to track which 3D objects to update or remove.
 * @private
 */
const entityObjectMap = new Map<number, THREE.Mesh>();

/**
 * Synchronizes the ECS state with the Three.js scene and performs the render pass.
 * Includes a cleanup phase to remove meshes for destroyed entities.
 * * @param world - The current ECS world state.
 * @param scene - The Three.js scene instance.
 * @param camera - The Three.js camera instance.
 * @param renderer - The WebGL renderer instance.
 */
export const renderSystem = (
    world: World,
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): void => {
    // 1. Identify all entities that should have a 3D representation
    const activeEntities = query(world, [TRANSFORM_ID, MESH_ID]);

    // Create a Set for O(1) lookup during the cleanup phase
    const activeEntitiesSet = new Set(activeEntities);

    /**
     * PHASE 1: CLEANUP
     * Remove Three.js objects for entities that no longer exist in the ECS 
     * or no longer have the required components.
     */
    for (const [entityId, threeMesh] of entityObjectMap.entries()) {
        if (!activeEntitiesSet.has(entityId)) {
            // Remove from the visual scene
            scene.remove(threeMesh);

            // Critical: Dispose of GPU resources to prevent memory leaks
            threeMesh.geometry.dispose();
            if (Array.isArray(threeMesh.material)) {
                threeMesh.material.forEach(m => m.dispose());
            } else {
                threeMesh.material.dispose();
            }

            // Remove from our internal cache
            entityObjectMap.delete(entityId);
        }
    }

    /**
     * PHASE 2: UPDATE & CREATE
     * Iterate through active entities to sync data or instantiate new meshes.
     */
    for (const entityId of activeEntities) {
        const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
        const meshData = getComponent<MeshData>(world, entityId, MESH_ID);

        // Safety check (should be guaranteed by the query)
        if (!transform || !meshData) continue;

        // Create the mesh if it's new to the renderer
        if (!entityObjectMap.has(entityId)) {
            // TODO: Move geometry/material creation to a dedicated Registry or Factory
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({
                color: meshData.color,
                roughness: 0.7
            });
            const threeMesh = new THREE.Mesh(geometry, material);

            scene.add(threeMesh);
            entityObjectMap.set(entityId, threeMesh);
        }

        // Synchronize Transform data from ECS to Three.js Object3D
        const mesh = entityObjectMap.get(entityId)!;

        mesh.position.set(transform.position.x, transform.position.y, transform.position.z);
        mesh.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
        mesh.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
    }

    /**
     * PHASE 3: DRAW
     * Perform the final WebGL render call.
     */
    renderer.render(scene, camera);
};