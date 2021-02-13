declare function createRadialGradient(ctx: CanvasRenderingContext2D, w: number, h: number, r: number, c0: string, c1: string): CanvasGradient;
declare class Particles {
    constructor(canvas: HTMLCanvasElement, numberOfParticles: number, particleRadius: number, c1: string, c2: string, radiusMultiplier: number, resolution?: number);
}
declare class Particle {
    radius: number;
    canvas: HTMLCanvasElement;
    speedY: number;
    speedX: number;
    y: number;
    x: number;
    constructor(rad: number, canvas: HTMLCanvasElement);
    update(deltaTime: number): void;
}
declare function random(min: number, max: number): number;
