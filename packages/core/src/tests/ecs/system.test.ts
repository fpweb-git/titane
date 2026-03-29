import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWorld, World } from '../../ecs/kernel/world';
import { createEntity } from '../../ecs/kernel/entity';
import { addComponent, getComponent } from '../../ecs/kernel/component';
import { createScheduler, registerSystem, runScheduler } from '../../ecs/pipeline/scheduler';
import { Phase } from '../../ecs/pipeline/system';

describe('ECS: System Execution', () => {
    let world: World;

    beforeEach(() => {
        world = createWorld();
    });

    it('should execute registered systems in deterministic phase order', () => {
        const scheduler = createScheduler();
        const executionOrder: Phase[] = [];

        registerSystem(scheduler, Phase.PHYSICS, () => executionOrder.push(Phase.PHYSICS));
        registerSystem(scheduler, Phase.INPUT, () => executionOrder.push(Phase.INPUT));
        registerSystem(scheduler, Phase.UPDATE, () => executionOrder.push(Phase.UPDATE));
        registerSystem(scheduler, Phase.RENDER, () => executionOrder.push(Phase.RENDER));
        registerSystem(scheduler, Phase.POST_PHYSICS, () => executionOrder.push(Phase.POST_PHYSICS));

        // Let's run the scheduler
        runScheduler(scheduler, world, 0.16);

        expect(executionOrder).toEqual([
            Phase.INPUT,
            Phase.UPDATE,
            Phase.PHYSICS,
            Phase.POST_PHYSICS,
            Phase.RENDER
        ]);
    });

    it('should pass correct deltaTime and world to systems', () => {
        const scheduler = createScheduler();
        const systemA = vi.fn();

        registerSystem(scheduler, Phase.UPDATE, systemA);

        const dt = 0.016;
        runScheduler(scheduler, world, dt);

        expect(systemA).toHaveBeenCalledTimes(1);
        expect(systemA).toHaveBeenCalledWith(world, dt);
    });

    it('should allow system logic to mutate entities', () => {
        const scheduler = createScheduler();

        const entity = createEntity(world);
        addComponent(world, entity, 'position', { x: 0 });

        const moveSystem = (w: World, dt: number) => {
            const pos = getComponent<{ x: number }>(w, entity, 'position');
            if (pos) {
                pos.x += 10 * dt;
            }
        };

        registerSystem(scheduler, Phase.UPDATE, moveSystem);

        runScheduler(scheduler, world, 1); // 1 second elapsed

        expect(getComponent<{ x: number }>(world, entity, 'position')).toEqual({ x: 10 });
    });
});
