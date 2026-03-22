import { ComponentId } from '../types';

/**
 * Unique identifier for the Velocity component.
 */
export const VELOCITY_ID: ComponentId = 'velocity';

/**
 * Data structure representing linear velocity.
 */
export interface Velocity {
    x: number;
    y: number;
    z: number;
}

/**
 * Factory function to create a new Velocity data object.
 * @returns A clean Velocity object.
 */
export const createVelocity = (x = 0, y = 0, z = 0): Velocity => ({ x, y, z });