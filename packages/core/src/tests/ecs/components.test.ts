import { describe, it, expect, beforeEach } from 'vitest';
import { createWorld, World } from '../../ecs/world';
import { createEntity } from '../../ecs/entity';
import { addComponent, getComponent, hasComponent, removeComponent, updateComponent } from '../../ecs/component';

describe('ECS: Component Management', () => {
    let world: World;
    let entity: number;

    beforeEach(() => {
        world = createWorld();
        entity = createEntity(world);
    });

    it('should add a component to an entity', () => {
        addComponent(world, entity, 'health', { current: 100 });
        
        expect(hasComponent(world, entity, 'health')).toBe(true);
        expect(getComponent<{ current: number }>(world, entity, 'health')).toEqual({ current: 100 });
    });

    it('should correctly report missing components', () => {
        expect(hasComponent(world, entity, 'velocity')).toBe(false);
        expect(getComponent(world, entity, 'velocity')).toBeUndefined();
    });

    it('should overwrite component data when added again', () => {
        addComponent(world, entity, 'position', { x: 0, y: 0 });
        addComponent(world, entity, 'position', { x: 10, y: 5 });

        expect(getComponent<{ x: number, y: number }>(world, entity, 'position')).toEqual({ x: 10, y: 5 });
    });

    it('should update component using updateComponent safely', () => {
        addComponent(world, entity, 'mana', { current: 50 });
        
        updateComponent<{ current: number }>(world, entity, 'mana', (data) => {
            data.current += 10;
        });

        expect(getComponent<{ current: number }>(world, entity, 'mana')).toEqual({ current: 60 });
    });

    it('should ignore update requests for missing components', () => {
        // This should not throw an error
        updateComponent(world, entity, 'ghost-stat', (data: any) => {
            data.value = 999;
        });

        expect(hasComponent(world, entity, 'ghost-stat')).toBe(false);
    });

    it('should remove components from entities', () => {
        addComponent(world, entity, 'shield', { strength: 10 });
        expect(hasComponent(world, entity, 'shield')).toBe(true);
        
        removeComponent(world, entity, 'shield');
        expect(hasComponent(world, entity, 'shield')).toBe(false);
    });

    it('should safely ignore removing a missing component', () => {
        // No errors should be thrown
        removeComponent(world, entity, 'not-here');
        expect(world._components.get('not-here')).toBeUndefined();
    });
});
