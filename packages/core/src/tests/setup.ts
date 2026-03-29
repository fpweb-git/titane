import { vi } from 'vitest';

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
