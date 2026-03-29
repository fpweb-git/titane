import type { World } from '../kernel/world';
/**
 * An Entity is a unique numeric identifier.
 * It serves as a key to associate different components together.
 */
export type Entity = number;

/**
 * A unique string identifier for a component type (e.g., 'transform', 'mesh').
 * Used for O(1) lookup in the World's storage.
 */
export type ComponentId = string;

/**
 * Basic structure for component data.
 * Components must be Plain Old JavaScript Objects (POJO) for easy serialization.
 */
export type ComponentData = Record<string, unknown>;

/**
 * A System is a pure function that processes entities and their components.
 * @param world The current world state.
 * @param deltaTime The time elapsed since the last frame in seconds.
 */
export type System = (world: World, deltaTime: number) => void;