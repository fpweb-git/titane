import { World } from '../world';
import { query } from '../query';
import { getComponent } from '../component';
import { TRANSFORM_ID, Transform } from '../components/transform';
import { VELOCITY_ID, Velocity } from '../components/velocity';

/**
 * Updates entity positions based on their velocity and the elapsed time.
 * This is a pure functional system.
 * @param world The world state to process.
 * @param deltaTime Time elapsed since the last frame in seconds.
 */
export const movementSystem = (world: World, deltaTime: number): void => {
    // 1. Get all entities that have a Transform AND a Velocity
    const entities = query(world, [TRANSFORM_ID, VELOCITY_ID]);

    // 2. Iterate over each entity to update its position
    for (const entityId of entities) {
        const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
        const velocity = getComponent<Velocity>(world, entityId, VELOCITY_ID);

        if (transform && velocity) {
            transform.position.x += velocity.x * deltaTime;
            transform.position.y += velocity.y * deltaTime;
            transform.position.z += velocity.z * deltaTime;
        }
    }
};