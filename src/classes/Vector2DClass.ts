import Konva from 'konva';

export class Vector2DClass {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromKonvaVector2D(konvaVector: Konva.Vector2d): Vector2DClass {
        return new Vector2DClass(konvaVector.x, konvaVector.y);
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}