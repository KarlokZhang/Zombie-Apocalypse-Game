import readline from 'readline/promises';

import { Direction } from '../constants';
import { Position } from '../core/Position';
import {
    isValidGridSize,
    isValidMoves,
    isValidPosition,
    isValidPositionList,
    parseGridSize,
    parseMoves,
    parsePosition,
    parsePositionList,
} from './validator';

export const promptUserInput = async (
    rl: readline.Interface,
    question: string,
    validatorFn: (input: string) => boolean,
): Promise<string> => {
    let input: string;
    let isValid: boolean;
    do {
        input = await rl.question(question);
        isValid = validatorFn(input);

        if (!isValid) {
            console.log('Invalid input. Please try again.');
        }
    } while (!isValid);

    return input.trim();
};

export const promptGridSize = async (rl: readline.Interface): Promise<number> => {
    const input = await promptUserInput(
        rl,
        'Please enter the dimension of the grid (positive integer): ',
        isValidGridSize,
    );
    return parseGridSize(input);
};

export const promptMoves = async (rl: readline.Interface): Promise<Direction[]> => {
    const input = await promptUserInput(
        rl,
        'Please enter a list of moves the zombies will make (list of U, D, L, R): ',
        isValidMoves,
    );
    return parseMoves(input);
};

export const promptPosition = async (rl: readline.Interface): Promise<Position> => {
    const input = await promptUserInput(
        rl,
        'Please enter the initial position of the zombie (format: (x,y)): ',
        isValidPosition,
    );
    return parsePosition(input);
};

export const promptPositionList = async (rl: readline.Interface): Promise<Position[]> => {
    const input = await promptUserInput(
        rl,
        'Please enter a list of initial positions of the creatures (format: (x1,y1)(x2,y2)...): ',
        isValidPositionList,
    );
    return parsePositionList(input);
};

export type GameInputs = {
    gridSize: number;
    moves: Direction[];
    zombiePosition: Position;
    creaturePositions: Position[];
};

export const getValidSimulationInputs = async (rl: readline.Interface): Promise<GameInputs> => {
    const gridSize = await promptGridSize(rl);
    const zombiePosition = await promptPosition(rl);
    const moves = await promptMoves(rl);
    const creaturePositions = await promptPositionList(rl);

    return {
        gridSize,
        moves,
        zombiePosition,
        creaturePositions,
    };
};
