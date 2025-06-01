import readline from 'readline/promises';

import { Direction } from '../../src/constants';
import { Position } from '../../src/core/Position';
import {
    GameInputs,
    getValidSimulationInputs,
    promptGridSize,
    promptMoves,
    promptPosition,
    promptPositionList,
    promptUserInput,
} from '../../src/utils/inputParser';
import * as validator from '../../src/utils/validator';

jest.mock('readline/promises');
jest.mock('../../src/utils/validator');

describe('Input Prompt Utils', () => {
    let mockedReadline: jest.Mocked<readline.Interface>;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        mockedReadline = {
            question: jest.fn(),
            close: jest.fn(),
        } as any;

        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    describe('promptUserInput', () => {
        it('should return valid input on first try', async () => {
            const validInput = 'valid input';
            const validatorFn = jest.fn().mockReturnValue(true);
            mockedReadline.question.mockResolvedValueOnce(validInput);

            const result = await promptUserInput(mockedReadline, 'Enter input: ', validatorFn);

            expect(mockedReadline.question).toHaveBeenCalledTimes(1);
            expect(mockedReadline.question).toHaveBeenCalledWith('Enter input: ');
            expect(result).toBe(validInput);
            expect(validatorFn).toHaveBeenCalledWith(validInput);
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should retry on invalid input', async () => {
            const invalidInput = 'invalid';
            const validInput = 'valid';
            const validatorFn = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);

            mockedReadline.question.mockResolvedValueOnce(invalidInput).mockResolvedValueOnce(validInput);

            const result = await promptUserInput(mockedReadline, 'Enter input: ', validatorFn);

            expect(mockedReadline.question).toHaveBeenCalledTimes(2);
            expect(result).toBe(validInput);
            expect(validatorFn).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledWith('Invalid input. Please try again.');
        });

        it('should trim the input', async () => {
            const inputWithSpaces = '  valid input  ';
            const validatorFn = jest.fn().mockReturnValue(true);
            mockedReadline.question.mockResolvedValueOnce(inputWithSpaces);

            const result = await promptUserInput(mockedReadline, ' Enter input: ', validatorFn);

            expect(result).toBe('valid input');
        });

        it('should handle multiple retries', async () => {
            const validatorFn = jest
                .fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);

            mockedReadline.question
                .mockResolvedValueOnce('invalid1')
                .mockResolvedValueOnce('invalid2')
                .mockResolvedValueOnce('invalid3')
                .mockResolvedValueOnce('valid');

            const result = await promptUserInput(mockedReadline, 'Enter input: ', validatorFn);

            expect(consoleLogSpy).toHaveBeenCalledTimes(3);
            expect(result).toBe('valid');
        });
    });

    describe('promptGridSize', () => {
        beforeEach(() => {
            (validator.isValidGridSize as jest.Mock).mockReturnValue(true);
            (validator.parseGridSize as jest.Mock).mockReturnValue(10);
        });

        it('should prompt for grid size and return parsed value', async () => {
            mockedReadline.question.mockResolvedValueOnce('10');

            const result = await promptGridSize(mockedReadline);

            expect(result).toBe(10);
            expect(mockedReadline.question).toHaveBeenCalledWith(
                'Please enter the dimension of the grid (positive integer): ',
            );
            expect(validator.isValidGridSize).toHaveBeenCalledWith('10');
            expect(validator.parseGridSize).toHaveBeenCalledWith('10');
        });

        it('should handle invalid grid size input', async () => {
            (validator.isValidGridSize as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

            mockedReadline.question.mockResolvedValueOnce('abc').mockResolvedValueOnce('5');

            const result = await promptGridSize(mockedReadline);

            expect(result).toBe(10);
            expect(mockedReadline.question).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledWith('Invalid input. Please try again.');
        });
    });

    describe('promptMoves', () => {
        const mockMoves: Direction[] = ['U', 'D', 'L', 'R'];

        beforeEach(() => {
            (validator.isValidMoves as jest.Mock).mockReturnValue(true);
            (validator.parseMoves as jest.Mock).mockReturnValue(mockMoves);
        });

        it('should prompt for moves and return parsed directions', async () => {
            mockedReadline.question.mockResolvedValueOnce('UDLR');

            const result = await promptMoves(mockedReadline);

            expect(result).toEqual(mockMoves);
            expect(mockedReadline.question).toHaveBeenCalledWith(
                'Please enter a list of moves the zombies will make (list of U, D, L, R): ',
            );
            expect(validator.isValidMoves).toHaveBeenCalledWith('UDLR');
            expect(validator.parseMoves).toHaveBeenCalledWith('UDLR');
        });

        it('should handle lowercase input', async () => {
            mockedReadline.question.mockResolvedValueOnce('udlr');

            const result = await promptMoves(mockedReadline);

            expect(result).toEqual(mockMoves);
            expect(validator.parseMoves).toHaveBeenCalledWith('udlr');
        });

        it('should handle invalid moves', async () => {
            (validator.isValidMoves as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

            mockedReadline.question.mockResolvedValueOnce('UDLRX').mockResolvedValueOnce('UDLR');

            const result = await promptMoves(mockedReadline);

            expect(result).toEqual(mockMoves);
            expect(mockedReadline.question).toHaveBeenCalledTimes(2);
        });
    });

    describe('promptPosition', () => {
        const mockPosition = new Position(3, 4);

        beforeEach(() => {
            (validator.isValidPosition as jest.Mock).mockReturnValue(true);
            (validator.parsePosition as jest.Mock).mockReturnValue(mockPosition);
        });

        it('should prompt for position and return parsed Position', async () => {
            mockedReadline.question.mockResolvedValueOnce('(3,4)');

            const result = await promptPosition(mockedReadline);

            expect(result).toEqual(mockPosition);
            expect(mockedReadline.question).toHaveBeenCalledWith(
                'Please enter the initial position of the zombie (format: (x,y)): ',
            );
            expect(validator.isValidPosition).toHaveBeenCalledWith('(3,4)');
            expect(validator.parsePosition).toHaveBeenCalledWith('(3,4)');
        });

        it('should handle position with spaces', async () => {
            mockedReadline.question.mockResolvedValueOnce('( 3 , 4 )');

            const result = await promptPosition(mockedReadline);

            expect(result).toEqual(mockPosition);
            expect(validator.parsePosition).toHaveBeenCalledWith('( 3 , 4 )');
        });

        it('should handle invalid position format', async () => {
            (validator.isValidPosition as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

            mockedReadline.question.mockResolvedValueOnce('3,4').mockResolvedValueOnce('(3,4)');

            const result = await promptPosition(mockedReadline);

            expect(result).toEqual(mockPosition);
            expect(mockedReadline.question).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledWith('Invalid input. Please try again.');
        });
    });

    describe('promptPositionList', () => {
        const mockPositions = [new Position(0, 1), new Position(1, 2), new Position(1, 1)];

        beforeEach(() => {
            (validator.isValidPositionList as jest.Mock).mockReturnValue(true);
            (validator.parsePositionList as jest.Mock).mockReturnValue(mockPositions);
        });

        it('should prompt for position list and return parsed positions', async () => {
            mockedReadline.question.mockResolvedValueOnce('(0,1)(1,2)(1,1)');

            const result = await promptPositionList(mockedReadline);

            expect(result).toEqual(mockPositions);
            expect(mockedReadline.question).toHaveBeenCalledWith(
                'Please enter a list of initial positions of the creatures (format: (x1,y1)(x2,y2)...): ',
            );
            expect(validator.isValidPositionList).toHaveBeenCalledWith('(0,1)(1,2)(1,1)');
            expect(validator.parsePositionList).toHaveBeenCalledWith('(0,1)(1,2)(1,1)');
        });

        it('should handle empty position list', async () => {
            (validator.parsePositionList as jest.Mock).mockReturnValue([]);
            mockedReadline.question.mockResolvedValueOnce('');

            const result = await promptPositionList(mockedReadline);

            expect(result).toEqual([]);
            expect(validator.parsePositionList).toHaveBeenCalledWith('');
        });

        it('should handle position list with spaces', async () => {
            mockedReadline.question.mockResolvedValueOnce('(0,1) (1,2) (1,1)');

            const result = await promptPositionList(mockedReadline);

            expect(result).toEqual(mockPositions);
        });

        it('should handle invalid position list', async () => {
            (validator.isValidPositionList as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

            mockedReadline.question.mockResolvedValueOnce('(0,1)(1,2').mockResolvedValueOnce('(0,1)(1,2)(1,1)');

            const result = await promptPositionList(mockedReadline);

            expect(result).toEqual(mockPositions);
            expect(mockedReadline.question).toHaveBeenCalledTimes(2);
        });
    });

    describe('getValidSimulationInputs', () => {
        const mockGameInputs: GameInputs = {
            gridSize: 10,
            zombiePosition: new Position(5, 5),
            moves: ['U', 'D', 'L', 'R'],
            creaturePositions: [new Position(0, 1), new Position(1, 2)],
        };

        beforeEach(() => {
            (validator.isValidGridSize as jest.Mock).mockReturnValue(true);
            (validator.isValidPosition as jest.Mock).mockReturnValue(true);
            (validator.isValidMoves as jest.Mock).mockReturnValue(true);
            (validator.isValidPositionList as jest.Mock).mockReturnValue(true);

            (validator.parseGridSize as jest.Mock).mockReturnValue(mockGameInputs.gridSize);
            (validator.parsePosition as jest.Mock).mockReturnValue(mockGameInputs.zombiePosition);
            (validator.parseMoves as jest.Mock).mockReturnValue(mockGameInputs.moves);
            (validator.parsePositionList as jest.Mock).mockReturnValue(mockGameInputs.creaturePositions);
        });

        it('should collect all inputs in correct order', async () => {
            mockedReadline.question
                .mockResolvedValueOnce('10')
                .mockResolvedValueOnce('(5,5)')
                .mockResolvedValueOnce('UDLR')
                .mockResolvedValueOnce('(0,1)(1,2)');

            const result = await getValidSimulationInputs(mockedReadline);

            expect(result).toEqual(mockGameInputs);
            expect(mockedReadline.question).toHaveBeenCalledTimes(4);

            const calls = mockedReadline.question.mock.calls;
            expect(calls[0][0]).toContain('dimension of the grid');
            expect(calls[1][0]).toContain('initial position of the zombie');
            expect(calls[2][0]).toContain('list of initial positions of the creatures');
            expect(calls[3][0]).toContain('list of moves');
        });

        it('should handle validation failures at each step', async () => {
            (validator.isValidGridSize as jest.Mock).mockReturnValueOnce(false).mockReturnValue(true);

            mockedReadline.question
                .mockResolvedValueOnce('abc')
                .mockResolvedValueOnce('10')
                .mockResolvedValueOnce('(5,5)')
                .mockResolvedValueOnce('UDLR')
                .mockResolvedValueOnce('(0,1)(1,2)');

            const result = await getValidSimulationInputs(mockedReadline);

            expect(result).toEqual(mockGameInputs);
            expect(mockedReadline.question).toHaveBeenCalledTimes(5);
            expect(consoleLogSpy).toHaveBeenCalledWith('Invalid input. Please try again.');
        });

        it('should handle empty creature positions', async () => {
            const inputsWithNoCreatures = {
                ...mockGameInputs,
                creaturePositions: [],
            };

            (validator.parsePositionList as jest.Mock).mockReturnValue([]);

            mockedReadline.question
                .mockResolvedValueOnce('10')
                .mockResolvedValueOnce('(5,5)')
                .mockResolvedValueOnce('UDLR')
                .mockResolvedValueOnce('');

            const result = await getValidSimulationInputs(mockedReadline);

            expect(result).toEqual(inputsWithNoCreatures);
        });

        it('should trim all inputs', async () => {
            mockedReadline.question
                .mockResolvedValueOnce('  10  ')
                .mockResolvedValueOnce('  (5,5)  ')
                .mockResolvedValueOnce('  (0,1)(1,2)  ')
                .mockResolvedValueOnce('  UDLR  ');

            const result = await getValidSimulationInputs(mockedReadline);

            expect(result).toEqual(mockGameInputs);

            expect(validator.parseGridSize).toHaveBeenCalledWith('10');
            expect(validator.parsePosition).toHaveBeenCalledWith('(5,5)');
            expect(validator.parseMoves).toHaveBeenCalledWith('UDLR');
            expect(validator.parsePositionList).toHaveBeenCalledWith('(0,1)(1,2)');
        });
    });

    describe('Error handling', () => {
        it('should handle readline errors', async () => {
            const error = new Error('Readline error');
            mockedReadline.question.mockRejectedValueOnce(error);

            const validatorFn = jest.fn().mockReturnValue(true);

            await expect(promptUserInput(mockedReadline, 'Enter input: ', validatorFn)).rejects.toThrow(
                'Readline error',
            );
        });

        it('should propagate validator errors', async () => {
            const validatorError = new Error('Validator error');
            const validatorFn = jest.fn().mockImplementation(() => {
                throw validatorError;
            });

            mockedReadline.question.mockResolvedValueOnce('input');

            await expect(promptUserInput(mockedReadline, 'Enter input: ', validatorFn)).rejects.toThrow(
                'Validator error',
            );
        });
    });
});
