import { World } from './world';
import { Entity, ComponentId } from './types';

/**
 * Associates a component data object with an entity.
 * Overwrites existing data if the component is already present.
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
    if (!world._components.has(componentId)) {
        world._components.set(componentId, new Map<Entity, any>());
    }
    world._components.get(componentId)!.set(entityId, data);
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
    return world._components.get(componentId)?.get(entityId) as T | undefined;
};

/**
 * Checks if an entity possesses a specific component.
 * @param world The world state.
 * @param entityId The target entity.
 * @param componentId The unique string ID of the component type.
 * @returns True if the component exists for this entity.
 */
export const hasComponent = (
    world: World,
    entityId: Entity,
    componentId: ComponentId
): boolean => {
    return world._components.get(componentId)?.has(entityId) ?? false;
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
    world._components.get(componentId)?.delete(entityId);
};

/**
 * Safely updates a component's data using a callback function.
 * This is the preferred way for the Editor to mutate state.
 * @param world The world state.
 * @param entityId The target entity.
 * @param componentId The unique string ID of the component type.
 * @param updater A function that receives the current data and modifies it.
 */
export const updateComponent = <T>(
    world: World,
    entityId: Entity,
    componentId: ComponentId,
    updater: (current: T) => void
): void => {
    const data = getComponent<T>(world, entityId, componentId);
    if (data) {
        updater(data);
    }
};