import { ComponentId } from '../types';

/**
 * Unique identifier for the Mesh component.
 */
export const MESH_ID: ComponentId = 'mesh';

/**
 * Types of primitive shapes supported by the engine.
 */
export type PrimitiveType = 'box' | 'sphere' | 'plane';

/**
 * Data structure representing a 3D mesh.
 */
export interface MeshData {
    primitive: PrimitiveType;
    color: string;
}

/**
 * Factory function to create a new Mesh data object.
 * @param primitive The shape of the mesh.
 * @param color The hex color string.
 * @returns A clean MeshData object.
 */
export const createMesh = (primitive: PrimitiveType = 'box', color = '#ff0000'): MeshData => ({
    primitive,
    color
});