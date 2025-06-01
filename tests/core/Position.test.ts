import { Position } from '../../src/core/Position';

describe('Position', () => {
    it('should create a Position instance with correct properties', () => {
        const position = new Position(10, 20);
        expect(position).toBeInstanceOf(Position);
        expect(position.x).toBe(10);
        expect(position.y).toBe(20);
    });

    it('should return the correct string representation', () => {
        const position = new Position(5, 15);
        expect(position.toString()).toBe('(5, 15)');
    });

    it('should correctly compare two positions', () => {
        const pos1 = new Position(3, 4);
        const pos2 = new Position(3, 4);
        const pos3 = new Position(5, 6);

        expect(pos1.equals(pos2)).toBe(true);
        expect(pos1.equals(pos3)).toBe(false);
    });

    it('should calculate the next position correctly when it was inbound', () => {
        const gridSize = 4;
        const nextPosition = Position.getNextPosition(1, 2, gridSize);
        expect(nextPosition.x).toBe(1);
        expect(nextPosition.y).toBe(2);
    });

    it('should calculate the next position correctly when it was out of bounds on x', () => {
        const gridSize = 4;
        const nextPosition = Position.getNextPosition(4, 1, gridSize);
        expect(nextPosition.x).toBe(0);
        expect(nextPosition.y).toBe(1);
    });
});
