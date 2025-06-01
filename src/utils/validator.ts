import { DIRECTIONS, Direction } from '../constants';
import { Position } from '../core/Position';

export const isValidGridSize = (input: string): boolean => {
    const value = Number(input);

    return Number.isInteger(value) && value > 0;
};

export const isValidMoves = (input: string): boolean => {
    if (!input || input.trim() === '') {
        return false;
    }

    const validMoves = new Set(Object.values(DIRECTIONS));
    const moves = input
        .trim()
        .split('')
        .map((move) => move.trim());
    return moves.every((move) => validMoves.has(move as Direction));
};

export const isValidPosition = (input: string): boolean => {
    const trimmedInput = input.trim();

    if (!trimmedInput || (!trimmedInput.startsWith('(') && !trimmedInput.endsWith(')'))) {
        return false;
    }

    // remove the brackets (3, 1) => 3,1
    const positionString = trimmedInput.slice(1, -1).trim();

    // split by comma and trim each part 3,1 => ['3', '1']
    const [x, y] = positionString.split(',').map((part) => Number(part.trim()));

    return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0;
};

export const isValidPositionList = (input: string): boolean => {
    const inputWithoutSpaces = input.trim();

    if (!inputWithoutSpaces || !inputWithoutSpaces.startsWith('(') || !inputWithoutSpaces.endsWith(')')) {
        return false;
    }

    // convert postions to array (3,1)(2,2)(1,1) => ['3,1', '2,2', '1,1']
    const positionStrings = inputWithoutSpaces
        .slice(1, -1)
        .split(')(')
        .map((part) => part.trim());

    // check if each position is valid
    return positionStrings.every((positionString) => {
        const [x, y] = positionString.split(',').map((part) => Number(part.trim()));
        return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0;
    });
};

export const parseGridSize = (input: string): number => {
    if (!isValidGridSize(input)) {
        throw new Error(`Invalid grid size: ${input}`);
    }
    return Number(input);
};

export const parseMoves = (input: string): Direction[] => {
    if (!isValidMoves(input)) {
        throw new Error(`Invalid moves: ${input}`);
    }
    return input.split('').map((move) => move.trim() as Direction);
};

export const parsePosition = (input: string): Position => {
    const trimmedInput = input.trim();
    const positionString = trimmedInput.slice(1, -1).trim();
    const [x, y] = positionString.split(',').map((part) => Number(part.trim()));

    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
        throw new Error(`Invalid position format: ${input}`);
    }

    return new Position(x, y);
};

export const parsePositionList = (input: string): Position[] => {
    const inputWithoutSpaces = input.replace(/\s+/g, '');

    if (!isValidPositionList(inputWithoutSpaces)) {
        throw new Error(`Invalid position list format: ${input}`);
    }

    const positionStrings = inputWithoutSpaces
        .slice(1, -1)
        .split(')(')
        .map((part) => part.trim());

    return positionStrings.map((positionString) => {
        const [x, y] = positionString.split(',').map((part) => Number(part.trim()));
        return new Position(x, y);
    });
};
