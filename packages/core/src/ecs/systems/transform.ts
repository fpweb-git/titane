import { World } from '../kernel/world';
import { query } from '../kernel/query';
import { getComponent } from '../kernel/component';
import { TRANSFORM_ID, Transform } from '../components/transform';
import { mat4FromTRS, mat4Multiply } from '../../utils/math';
import { Entity } from '../types';

// Pre-allocate a single matrix for local computations to prevent GC pauses
const TEMP_LOCAL_MATRIX = new Float32Array(16);

/**
 * Calculates world matrices for all transforms iteratively.
 * Uses Breadth-First Search (BFS) to compute parents before children reliably.
 * In-place math ensures zero allocations during the loop.
 * @param world - The current world state.
 */
export const transformSystem = (world: World): void => {
    const allTransforms = query(world, [TRANSFORM_ID]);
    if (allTransforms.length === 0) return;

    // 1. Build a fast mapping for children and identify roots
    const roots: Entity[] = [];
    const childrenMap = new Map<Entity, Entity[]>();

    for (const entityId of allTransforms) {
        const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
        if (!transform) continue;

        if (transform.parent === null) {
            roots.push(entityId);
        } else {
            let siblings = childrenMap.get(transform.parent);
            if (!siblings) {
                siblings = [];
                childrenMap.set(transform.parent, siblings);
            }
            siblings.push(entityId);
        }
    }

    // 2. BFS Iterative calculation
    // Queue stores { id, parentDirty }
    // Using a dynamic array is fast enough and avoids recursion stack overflow.
    const queue: { id: Entity, parentDirty: boolean }[] = [];
    
    // Enqueue roots
    for (const root of roots) {
        queue.push({ id: root, parentDirty: false });
    }

    let head = 0; // Simulate queue without shift() performance cost
    while (head < queue.length) {
        const { id, parentDirty } = queue[head++];
        
        const transform = getComponent<Transform>(world, id, TRANSFORM_ID);
        if (!transform) continue;

        const isDirty = transform.isDirty || parentDirty;

        if (isDirty) {
            // Compute Local Matrix into our reusable TEMP_LOCAL_MATRIX
            mat4FromTRS(TEMP_LOCAL_MATRIX, transform.position, transform.rotation, transform.scale);

            if (transform.parent === null) {
                // If it's a root, world Matrix IS local Matrix
                for(let i = 0; i < 16; i++) {
                    transform.worldMatrix[i] = TEMP_LOCAL_MATRIX[i];
                }
            } else {
                const parentTransform = getComponent<Transform>(world, transform.parent, TRANSFORM_ID);
                if (parentTransform) {
                    // M_world = M_parent * M_local
                    mat4Multiply(transform.worldMatrix, parentTransform.worldMatrix, TEMP_LOCAL_MATRIX);
                }
            }
            transform.isDirty = false;
        }

        // Add children to queue 
        const children = childrenMap.get(id);
        if (children) {
            for (const childId of children) {
                // Pass the dirty state down
                queue.push({ id: childId, parentDirty: isDirty });
            }
        }
    }
};
