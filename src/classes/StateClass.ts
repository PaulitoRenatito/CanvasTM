import { IHighlightable } from "../interfaces/IHighlightable";
import { Vector2DClass } from "./Vector2DClass";

export class StateClass implements IHighlightable {
    name: string;
    position: Vector2DClass;
    isHightlight: boolean = false;

    constructor(name: string, position: Vector2DClass) {
        this.name = name;
        this.position = position;
    }

    toString(): string {
        return `name: {${this.name}} position: {${this.position}} isHightlight: {${this.isHightlight}}`;
    }
}