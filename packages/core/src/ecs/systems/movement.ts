import { World } from '../world';
import { query } from '../query';
import { getComponent } from '../component';
import { TRANSFORM_ID, Transform } from '../components/transform';
import { VELOCITY_ID, Velocity } from '../components/velocity';
import { INPUT_ID, Input } from '../components/input';
import { PLAYER_CONTROLLED_ID } from '../components/player-controlled';

/**
 * Updates entity positions based on their velocity and the elapsed time.
 * This is a pure functional system.
 * @param world The world state to process.
 * @param deltaTime Time elapsed since the last frame in seconds.
 */
export const movementSystem = (world: World, deltaTime: number): void => {
    // 0. Extract the global input state
    const inputEntities = query(world, [INPUT_ID]);
    if (inputEntities.length === 0) return; // No Input Driver initialized
    
    const globalInput = getComponent<Input>(world, inputEntities[0], INPUT_ID);
    if (!globalInput) return;

    // 1. Get all entities that have a Transform, a Velocity, and are Player Controlled
    const entities = query(world, [TRANSFORM_ID, VELOCITY_ID, PLAYER_CONTROLLED_ID]);

    // 2. Iterate over each entity to update its position
    for (const entityId of entities) {
        const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
        const velocity = getComponent<Velocity>(world, entityId, VELOCITY_ID);

        // Apply velocity ONLY if ArrowUp or KeyW is pressed
        const isMovingForward = globalInput.keys['ArrowUp'] || globalInput.keys['KeyW'];

        if (transform && velocity && isMovingForward) {
            transform.position.x += velocity.x * deltaTime;
            transform.position.y += velocity.y * deltaTime;
            transform.position.z += velocity.z * deltaTime;
        }
    }
};