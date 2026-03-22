import { ref } from 'vue';
import { useTitane } from './useTitane';

const isPlaying = ref(true);

/**
 * Controls the engine's execution state.
 */
export function useRuntime() {
    const { engine } = useTitane();

    /**
     * Toggles between Play and Pause states.
     */
    const togglePlay = () => {
        if (!engine.value) return;

        isPlaying.value = !isPlaying.value;
        engine.value.isPaused = !isPlaying.value;
    };

    /**
     * Steps the simulation by exactly one frame (useful for debugging).
     */
    const stepFrame = () => {
        if (!engine.value) return;
        isPlaying.value = false;
        engine.value.isPaused = false;
        // Let the loop run once then pause again
        setTimeout(() => {
            if (engine.value) engine.value.isPaused = true;
        }, 16);
    };

    return {
        isPlaying,
        togglePlay,
        stepFrame
    };
}