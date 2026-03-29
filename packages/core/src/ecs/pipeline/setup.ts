import { TitaneEngine } from '../../runtime/engine';
import { registerSystem } from './scheduler';
import { Phase } from './system';
import { movementSystem } from '../systems/movement';
import { clearInputSystem } from '../systems/input-system';

/**
 * Configures the default execution pipeline for the Titane Engine.
 * Registers core systems into their respective lifecycle phases.
 * @param engine - The engine instance to configure.
 */
export const setupDefaultPipeline = (engine: TitaneEngine): void => {

    // Gameplay / Physics Phase
    registerSystem(engine.scheduler, Phase.PHYSICS, (world, deltaTime) => {
        if (!engine.isPaused) {
            movementSystem(world, deltaTime);
        }
    });

    // Frame Cleanup: Wipe inputs that last one frame exactly
    registerSystem(engine.scheduler, Phase.POST_PHYSICS, (world) => {
        if (!engine.isPaused) {
            clearInputSystem(world);
        }
    });

    // Rendering Phase (Always runs to keep the editor responsive)
    registerSystem(engine.scheduler, Phase.RENDER, (world) => {
        engine.renderer.render(world);
    });
};