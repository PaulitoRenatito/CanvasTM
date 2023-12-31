import { Vector2DClass } from "./classes/Vector2DClass";

function calculateAngle(start: Vector2DClass, end: Vector2DClass): number {
    return Math.atan2(end.y - start.y, end.x - start.x);
}

function pointOnCircle(position: Vector2DClass, radius: number, angle: number): Vector2DClass {
    const x = position.x + radius * Math.cos(angle);
    const y = position.y + radius * Math.sin(angle);

    return new Vector2DClass(x, y);
}

export { calculateAngle, pointOnCircle }