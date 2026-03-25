import { World } from './world';
import { System, Phase } from './system';

/**
 * Data structure representing the system execution pipeline.
 */
export type Scheduler = {
    readonly systems: Record<Phase, System[]>;
};

/**
 * Creates a fresh Scheduler with empty phases.
 * @returns A new Scheduler instance.
 */
export const createScheduler = (): Scheduler => ({
    systems: {
        [Phase.INPUT]: [],
        [Phase.UPDATE]: [],
        [Phase.PHYSICS]: [],
        [Phase.POST_PHYSICS]: [],
        [Phase.RENDER]: []
    }
});

/**
 * Registers a system into a specific execution phase.
 * @param scheduler The scheduler state.
 * @param phase The target execution phase.
 * @param system The system function to register.
 */
export const registerSystem = (
    scheduler: Scheduler,
    phase: Phase,
    system: System
): void => {
    scheduler.systems[phase].push(system);
};

/**
 * Executes all registered systems in the strict deterministic order of phases.
 * @param scheduler The scheduler state.
 * @param world The current world state.
 * @param deltaTime Time elapsed since the last frame.
 */
export const runScheduler = (
    scheduler: Scheduler,
    world: World,
    deltaTime: number
): void => {
    // We enforce the order via an array to avoid any JS object key ordering issues
    const phases = [
        Phase.INPUT,
        Phase.UPDATE,
        Phase.PHYSICS,
        Phase.POST_PHYSICS,
        Phase.RENDER
    ];

    for (const phase of phases) {
        const phaseSystems = scheduler.systems[phase];
        for (const system of phaseSystems) {
            system(world, deltaTime);
        }
    }
};