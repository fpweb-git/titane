import { World } from './world';
import { Entity, ComponentId } from './types';

/**
 * Associates a component data object with an entity.
 * @param world The world state.
 * @param entityId The target entity.
 * @param componentId The unique string ID of the component type.
 * @param data The initial data for this component.
 */
export const addComponent = <T>(
    world: World,
    entityId: Entity,
    componentId: ComponentId,
    data: T
): void => {
    if (!world.components.has(componentId)) {
        world.components.set(componentId, new Map<Entity, any>());
    }
    world.components.get(componentId)!.set(entityId, data);
};

/**
 * Retrieves a component's data for a specific entity.
 * @param world The world state.
 * @param entityId The target entity.
 * @param componentId The unique string ID of the component type.
 * @returns The component data or undefined if not present.
 */
export const getComponent = <T>(
    world: World,
    entityId: Entity,
    componentId: ComponentId
): T | undefined => {
    return world.components.get(componentId)?.get(entityId) as T | undefined;
};

/**
 * Removes a component of a specific type from an entity.
 * @param world The world state.
 * @param entityId The target entity.
 * @param componentId The ID of the component type to remove.
 */
export const removeComponent = (
    world: World,
    entityId: Entity,
    componentId: ComponentId
): void => {
    world.components.get(componentId)?.delete(entityId);
};