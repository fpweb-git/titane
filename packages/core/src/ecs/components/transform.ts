import { ComponentId, Entity } from '../types';
import { mat4Create } from '../../utils/math';

/**
 * Unique identifier for the Transform component.
 */
export const TRANSFORM_ID: ComponentId = 'transform';

/**
 * Represents the spatial properties of an entity.
 */
export interface Transform {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    parent: Entity | null;
    worldMatrix: Float32Array;
    isDirty: boolean;
}

/**
 * Factory function to create a new Transform data object.
 * @param position Initial position.
 * @param rotation Initial rotation (in radians).
 * @param scale Initial scale.
 * @returns A clean Transform object.
 */
export const createTransform = (
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 }
): Transform => ({
    position: { ...position },
    rotation: { ...rotation },
    scale: { ...scale },
    parent: null,
    worldMatrix: mat4Create(),
    isDirty: true
});