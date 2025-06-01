export class Position {
    constructor(
        public readonly x: number,
        public readonly y: number,
    ) {}

    static getNextPosition(x: number, y: number, gridSize: number): Position {
        const nextX = ((x % gridSize) + gridSize) % gridSize;
        const nextY = ((y % gridSize) + gridSize) % gridSize;
        return new Position(nextX, nextY);
    }

    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}
