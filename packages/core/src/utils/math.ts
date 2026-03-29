/**
 * Minimalist Matrix 4x4 utilities for Data-Oriented processing.
 * Using Column-Major order (compatible with WebGL/Three.js).
 */

/** Creates a new Identity Matrix (4x4) */
export const mat4Create = (): Float32Array => {
    const out = new Float32Array(16);
    out[0] = 1; out[5] = 1; out[10] = 1; out[15] = 1;
    return out;
};

/**
 * Computes a transformation matrix from TRS (Translation, Rotation, Scale).
 * @param out - The target matrix to update.
 * @param pos - Position {x, y, z}
 * @param rot - Euler rotation in radians {x, y, z}
 * @param scale - Scale {x, y, z}
 */
export const mat4FromTRS = (
    out: Float32Array, 
    pos: {x: number, y: number, z: number}, 
    rot: {x: number, y: number, z: number}, 
    scale: {x: number, y: number, z: number}
): void => {
    const x = rot.x, y = rot.y, z = rot.z;
    
    // XYZ Order standard Euler
    const a = Math.cos(x), b = Math.sin(x);
    const c = Math.cos(y), d = Math.sin(y);
    const e = Math.cos(z), f = Math.sin(z);

    const ce = c * e, cf = c * f;
    const bd = b * d, ad = a * d;

    // Rotation * Scale
    out[0] = ce * scale.x;
    out[1] = (bd * e + a * f) * scale.x;
    out[2] = (-ad * e + b * f) * scale.x;
    out[3] = 0;

    out[4] = -cf * scale.y;
    out[5] = (-bd * f + a * e) * scale.y;
    out[6] = (ad * f + b * e) * scale.y;
    out[7] = 0;

    out[8] = d * scale.z;
    out[9] = -b * c * scale.z;
    out[10] = a * c * scale.z;
    out[11] = 0;

    // Translation
    out[12] = pos.x;
    out[13] = pos.y;
    out[14] = pos.z;
    out[15] = 1;
};

/**
 * Multiplies two matrices: out = a * b
 */
export const mat4Multiply = (out: Float32Array, a: Float32Array, b: Float32Array): void => {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
};
