import { World } from '../world';
import { query } from '../query';
import { updateComponent } from '../component';
import { INPUT_ID, Input } from '../components/input';

/**
 * Executes strictly at the endgame of a cycle (typically POST_PHYSICS phase).
 * Obliterates `justPressed` impulses exactly ONE frame after they appeared.
 * @param world The current world state.
 */
export const clearInputSystem = (world: World): void => {
    // 1. Get the global input entity
    const entities = query(world, [INPUT_ID]);

    // 2. Clear justPressed hashes.
    for (const entityId of entities) {
        updateComponent<Input>(world, entityId, INPUT_ID, (inputData) => {
            // We empty the object safely simulating an aggressive sweep of the impulses Map
            inputData.justPressed = {}; 
        });
    }
};
