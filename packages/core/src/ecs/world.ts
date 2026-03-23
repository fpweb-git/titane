import { Entity, ComponentId } from './types';

/**
 * The World interface holds the entire state of the engine.
 * It is a purely data-driven structure.
 */
export interface World {
    readonly entities: {
        nextId: number;
        active: Set<Entity>;
    };
    /** @internal Internal component storage - Use API functions to access */
    readonly _components: Map<ComponentId, Map<Entity, any>>;
}

/**
 * Creates a fresh, empty World state.
 * @returns A new World instance.
 */
export const createWorld = (): World => ({
    entities: {
        nextId: 0,
        active: new Set<Entity>(),
    },
    _components: new Map<ComponentId, Map<Entity, any>>(),
});