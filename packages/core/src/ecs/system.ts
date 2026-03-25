import { World } from './world';

/**
 * A System is a simple function that operates on the World.
 */
export type System = (world: World, deltaTime: number) => void;

/**
 * Deterministic execution phases for the engine pipeline.
 */
export enum Phase {
    INPUT = 'INPUT',           // Gather keyboard/mouse
    UPDATE = 'UPDATE',         // Gameplay logic
    PHYSICS = 'PHYSICS',       // Movement & Collision
    POST_PHYSICS = 'POST_PHYSICS', // Sync after physics step
    RENDER = 'RENDER'          // Final draw call
}