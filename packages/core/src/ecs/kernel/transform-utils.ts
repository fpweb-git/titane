import { World } from './world';
import { Entity } from '../types';
import { getComponent } from './component';
import { TRANSFORM_ID, Transform } from '../components/transform';
import { query } from './query';

/**
 * Sets a parent-child relationship between two entities.
 * @param world - The ECS world instance.
 * @param childId - The entity that will become the child.
 * @param parentId - The entity that will become the parent (or null).
 */
export const setParent = (world: World, childId: Entity, parentId: Entity | null): void => {
    const transform = getComponent<Transform>(world, childId, TRANSFORM_ID);
    if (transform) {
        transform.parent = parentId;
        transform.isDirty = true;
    }
};

/**
 * Retrieves all direct children of a given entity.
 * @param world - The ECS world instance.
 * @param parentId - The parent entity ID.
 */
export const getChildren = (world: World, parentId: Entity | null): Entity[] => {
    // This is a query: Find all transforms where transform.parent === parentId
    return query(world, [TRANSFORM_ID]).filter(id => {
        const t = getComponent<Transform>(world, id, TRANSFORM_ID);
        return t?.parent === parentId;
    });
};
