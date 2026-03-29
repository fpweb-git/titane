import { World } from '../kernel/world';
import { query } from '../kernel/query';
import { getComponent } from '../kernel/component';
import { TRANSFORM_ID, Transform } from '../components/transform';
import { VELOCITY_ID, Velocity } from '../components/velocity';
import { INPUT_ID, Input } from '../components/input';
import { PLAYER_CONTROLLED_ID } from '../components/player-controlled';

/**
 * Updates entity positions based on their velocity and the elapsed time.
 * * Logic:
 * 1. Queries all entities with Transform and Velocity for universal movement.
 * 2. If an entity also has PlayerControlled, its velocity is updated via Keyboard Inputs.
 * * @param world - The current world state to process.
 * @param deltaTime - Time elapsed since the last frame in seconds.
 */
export const movementSystem = (world: World, deltaTime: number): void => {
    // 0. Extract the global input state
    const inputEntities = query(world, [INPUT_ID]);
    const globalInput = inputEntities.length > 0
        ? getComponent<Input>(world, inputEntities[0], INPUT_ID)
        : null;

    // 1. Get all entities that have a Transform and a Velocity (Universal Query)
    const entities = query(world, [TRANSFORM_ID, VELOCITY_ID]);

    // 2. Iterate over each entity to update its position
    for (const entityId of entities) {
        const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
        const velocity = getComponent<Velocity>(world, entityId, VELOCITY_ID);

        if (!transform || !velocity) continue;

        // 3. Handle Keyboard Input for PlayerControlled entities
        const playerControlledEntities = query(world, [PLAYER_CONTROLLED_ID]);
        const isPlayer = playerControlledEntities.includes(entityId);

        if (isPlayer && globalInput) {
            const speed = 5.0; // Base movement speed

            // Forward / Backward (Z axis)
            const forward = globalInput.keys['ArrowUp'] || globalInput.keys['KeyW'] ? 1 : 0;
            const backward = globalInput.keys['ArrowDown'] || globalInput.keys['KeyS'] ? 1 : 0;
            velocity.z = (backward - forward) * speed;

            // Left / Right (X axis)
            const left = globalInput.keys['ArrowLeft'] || globalInput.keys['KeyA'] ? 1 : 0;
            const right = globalInput.keys['ArrowRight'] || globalInput.keys['KeyD'] ? 1 : 0;
            velocity.x = (right - left) * speed;
        }

        // 4. Apply velocity to position if there is movement
        if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0) {
            transform.position.x += velocity.x * deltaTime;
            transform.position.y += velocity.y * deltaTime;
            transform.position.z += velocity.z * deltaTime;
            transform.isDirty = true;
        }
    }
};