import { vi, beforeEach } from 'vitest';

// We mock WebGL and Texture related classes from Three.js that fail in a strict Node environment.
// Math classes (Vector3, Matrix4, Quaternion, etc.) are INTENTIONALLY NOT MOCKED so ECS logic tests can operate correctly.
vi.mock('three', async (importOriginal) => {
    const actual = await importOriginal<typeof import('three')>();
    return {
        ...actual,
        WebGLRenderer: vi.fn(() => ({
            render: vi.fn(),
            setSize: vi.fn(),
            setPixelRatio: vi.fn(),
            dispose: vi.fn(),
            domElement: {}, // Mock DOM element
        })),
        TextureLoader: vi.fn(() => ({
            load: vi.fn(),
        })),
    };
});

// Provide a globally refreshed mock for window so the Node environment doesn't crash on browser API access
beforeEach(() => {
    const listeners: Record<string, Function[]> = {};
    (globalThis as { window: unknown }).window = {
        innerWidth: 1024,
        innerHeight: 768,
        addEventListener: vi.fn((event: string, cb: Function) => {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(cb);
        }),
        removeEventListener: vi.fn((event: string, cb: Function) => {
            if (!listeners[event]) return;
            listeners[event] = listeners[event].filter(l => l !== cb);
        }),
        dispatchEvent: vi.fn((event: any) => {
            if (listeners[event.type]) {
                listeners[event.type].forEach((cb: Function) => cb(event));
            }
        })
    };
});
