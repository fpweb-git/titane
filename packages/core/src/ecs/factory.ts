import { World } from './world';
import { Entity } from './types';
import { createEntity } from './entity';
import { addComponent } from './component';
import { TRANSFORM_ID, createTransform } from './components/transform';
import { MESH_ID, createMesh } from './components/mesh';

/**
 * Helper functions to quickly spawn common entities.
 */
export const EntityFactory = {
    /**
     * Spawns a basic 3D mesh entity with a transform.
     */
    createBox: (world: World, color = '#4ade80', position = { x: 0, y: 0, z: 0 }): Entity => {
        const entity = createEntity(world);
        addComponent(world, entity, TRANSFORM_ID, createTransform(position));
        addComponent(world, entity, MESH_ID, createMesh('box', color));
        return entity;
    }
};