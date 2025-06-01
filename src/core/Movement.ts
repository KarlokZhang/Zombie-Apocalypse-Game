import { DIRECTIONS, Direction } from '../constants';
import { Position } from './Position';

export class Movement {
    move(currentPosition: Position, direction: Direction, gridSize: number): Position {
        let nextX = currentPosition.x;
        let nextY = currentPosition.y;

        switch (direction) {
            case DIRECTIONS.UP:
                nextY -= 1;
                break;
            case DIRECTIONS.DOWN:
                nextY += 1;
                break;
            case DIRECTIONS.LEFT:
                nextX -= 1;
                break;
            case DIRECTIONS.RIGHT:
                nextX += 1;
                break;
            default:
                throw new Error(`Invalid direction: ${direction}`);
        }

        return Position.getNextPosition(nextX, nextY, gridSize);
    }
}
