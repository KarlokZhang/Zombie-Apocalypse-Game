import { Position } from '../core/Position';

export abstract class Entity {
    protected position: Position;
    protected readonly id: string;

    constructor(id: string, position: Position) {
        this.id = id;
        this.position = position;
    }

    getId(): string {
        return this.id;
    }

    getPosition(): Position {
        return this.position;
    }

    setPosition(position: Position): void {
        this.position = position;
    }

    abstract getType(): string;
}
