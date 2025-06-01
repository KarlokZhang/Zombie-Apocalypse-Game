import { DIRECTIONS } from '../../src/constants';
import { Movement } from '../../src/core/Movement';
import { Position } from '../../src/core/Position';

describe('Movement', () => {
    it('should move up correctly', () => {
        const movement = new Movement();
        const currentPosition = new Position(5, 5);
        const newPosition = movement.move(currentPosition, DIRECTIONS.UP, 10);
        expect(newPosition).toEqual(new Position(5, 4));
    });

    it('should move down correctly', () => {
        const movement = new Movement();
        const currentPosition = new Position(5, 5);
        const newPosition = movement.move(currentPosition, DIRECTIONS.DOWN, 10);
        expect(newPosition).toEqual(new Position(5, 6));
    });

    it('should move left correctly', () => {
        const movement = new Movement();
        const currentPosition = new Position(5, 5);
        const newPosition = movement.move(currentPosition, DIRECTIONS.LEFT, 10);
        expect(newPosition).toEqual(new Position(4, 5));
    });

    it('should move right correctly', () => {
        const movement = new Movement();
        const currentPosition = new Position(5, 5);
        const newPosition = movement.move(currentPosition, DIRECTIONS.RIGHT, 10);
        expect(newPosition).toEqual(new Position(6, 5));
    });

    it('should throw an error for invalid direction', () => {
        const movement = new Movement();
        const currentPosition = new Position(5, 5);
        expect(() => {
            movement.move(currentPosition, 'INVALID_DIRECTION' as any, 10);
        }).toThrow('Invalid direction: INVALID_DIRECTION');
    });
});
