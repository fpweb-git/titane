/**
 * Simple clock to track delta time between frames.
 */
export class Clock {
    private lastTime: number = performance.now();

    /**
     * Calculates time elapsed since the last call in seconds.
     * @returns Delta time in seconds.
     */
    public getDelta(): number {
        const currentTime = performance.now();
        const delta = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Cap delta time to avoid huge jumps after tab switching (max 10 FPS equivalent)
        return Math.min(delta, 0.1);
    }
}