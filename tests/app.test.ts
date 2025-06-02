import readline from 'readline/promises';

import { askToContinue, runGame, startGame } from '../src/app';
import { DIRECTIONS } from '../src/constants';
import { Game } from '../src/core/Game';
import { Position } from '../src/core/Position';
import { getValidSimulationInputs } from '../src/utils/inputParser';

jest.mock('readline/promises');
jest.mock('../src/utils/inputParser', () => ({
    getValidSimulationInputs: jest.fn(),
}));
jest.mock('../src/core/Game');

const mockedGame = Game as jest.MockedClass<typeof Game>;
const mockedGetValidSimulationInputs = getValidSimulationInputs as jest.MockedFunction<typeof getValidSimulationInputs>;

const mockValidGameInputs = {
    gridSize: 5,
    moves: [DIRECTIONS.UP, DIRECTIONS.RIGHT],
    zombiePosition: new Position(1, 1),
    creaturePositions: [new Position(2, 2), new Position(3, 3)],
};

describe('startGame', () => {
    let mockedReadline: jest.Mocked<readline.Interface>;
    let mockedGameInstance: jest.Mocked<Game>;
    beforeEach(() => {
        mockedReadline = {
            question: jest.fn(),
            close: jest.fn(),
        } as any;

        (readline.createInterface as jest.Mock).mockReturnValue(mockedReadline);
        mockedGameInstance = {
            addObserver: jest.fn(),
            initializeGame: jest.fn(),
            run: jest.fn(),
        } as any;
        mockedGame.mockImplementation(() => mockedGameInstance);
        mockedGetValidSimulationInputs.mockResolvedValue(mockValidGameInputs);
        jest.clearAllMocks();
    });

    it('should run the game once and exit when user chooses not to continue', async () => {
        mockedReadline.question.mockResolvedValueOnce('n');

        await startGame();

        expect(readline.createInterface).toHaveBeenCalledWith({
            input: process.stdin,
            output: process.stdout,
        });
        expect(mockedGetValidSimulationInputs).toHaveBeenCalled();
        expect(mockedGame).toHaveBeenCalledWith(mockValidGameInputs.gridSize, mockValidGameInputs.moves);
        expect(mockedGameInstance.initializeGame).toHaveBeenCalledWith(
            mockValidGameInputs.zombiePosition,
            mockValidGameInputs.creaturePositions,
        );
        expect(mockedGameInstance.run).toHaveBeenCalled();
        expect(mockedReadline.close).toHaveBeenCalled();
    });

    it('should run the game multiple times if user chooses to continue', async () => {
        mockedReadline.question
            .mockResolvedValueOnce('y') // First run
            .mockResolvedValueOnce('n'); // Second run

        await startGame();

        expect(mockedGetValidSimulationInputs).toHaveBeenCalledTimes(2);
        expect(mockedGame).toHaveBeenCalledTimes(2);
        expect(mockedGameInstance.initializeGame).toHaveBeenCalledTimes(2);
        expect(mockedGameInstance.run).toHaveBeenCalledTimes(2);
        expect(mockedReadline.close).toHaveBeenCalled();
    });

    it('should handle errors gracefully and ask if user wants to try again', async () => {
        mockedGetValidSimulationInputs
            .mockRejectedValueOnce(new Error('Invalid input'))
            .mockResolvedValueOnce(mockValidGameInputs); // Second run after error

        mockedReadline.question.mockResolvedValueOnce('y').mockResolvedValueOnce('n'); // User chooses to try again
        console.error = jest.fn();
        console.log = jest.fn();

        await startGame();

        expect(mockedReadline.question).toHaveBeenCalledWith('Do you want to try again? (y/n): ');
        expect(mockedReadline.close).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('\nError:', 'Invalid input');
        expect(console.error).toHaveBeenCalledWith('Please try again with valid input.\n');
    });

    it('should log an error message if an unexpected error occurs', async () => {
        mockedGetValidSimulationInputs.mockRejectedValueOnce('Unexpected error');
        mockedReadline.question.mockResolvedValueOnce('n'); // User chooses not to continue

        console.error = jest.fn();

        await startGame();

        expect(console.error).toHaveBeenCalledWith('\nError:', 'Unknown error');
        expect(mockedReadline.close).toHaveBeenCalled();
    });
});

describe('askToContinue', () => {
    let mockedReadline: jest.Mocked<readline.Interface>;

    beforeEach(() => {
        mockedReadline = {
            question: jest.fn(),
            close: jest.fn(),
        } as any;

        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    it.each(['Y', 'y', 'yes', 'YES', 'Yes', 'yay', 'YAAAAA'])(
        'should handle case-insensitive input strating with y: "%s"',
        async (input) => {
            mockedReadline.question.mockResolvedValue(input);

            const result = await askToContinue(mockedReadline, 'Mock question: (y/n):');
            expect(result).toBe(true);
        },
    );

    it.each(['N', 'n', 'no', 'NO', 'No', 'nay', 'NAAAAA'])(
        'should handle case-insensitive input strating with n: "%s"',
        async (input) => {
            mockedReadline.question.mockResolvedValue(input);

            const result = await askToContinue(mockedReadline, 'Mock question: (y/n):');
            expect(result).toBe(false);
        },
    );

    it.each(['', 'maybe', 'maybe not', '123', 'random input'])(
        'should return false for unexpected input: "%s"',
        async (input) => {
            mockedReadline.question.mockResolvedValue(input);

            const result = await askToContinue(mockedReadline, 'Mock question: (y/n):');
            expect(result).toBe(false);
        },
    );
});

describe('runGame', () => {
    let mockedReadline: jest.Mocked<readline.Interface>;
    let mockedGameInstance: jest.Mocked<Game>;

    beforeEach(() => {
        mockedReadline = {
            question: jest.fn(),
            close: jest.fn(),
        } as any;

        mockedGameInstance = {
            addObserver: jest.fn(),
            initializeGame: jest.fn(),
            run: jest.fn(),
        } as any;
        mockedGame.mockImplementation(() => mockedGameInstance);
        mockedGetValidSimulationInputs.mockResolvedValue(mockValidGameInputs);

        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should run the game with valid inputs', async () => {
        mockedGetValidSimulationInputs.mockResolvedValue(mockValidGameInputs);

        await runGame(mockedReadline);

        expect(mockedGetValidSimulationInputs).toHaveBeenCalledWith(mockedReadline);
    });

    it('should create a new Game instance and initialize the game with the valid game inputs', async () => {
        mockedGetValidSimulationInputs.mockResolvedValue(mockValidGameInputs);

        await runGame(mockedReadline);

        expect(mockedGame).toHaveBeenCalledWith(mockValidGameInputs.gridSize, mockValidGameInputs.moves);
        expect(mockedGameInstance.initializeGame).toHaveBeenCalledWith(
            mockValidGameInputs.zombiePosition,
            mockValidGameInputs.creaturePositions,
        );
        expect(mockedGameInstance.run).toHaveBeenCalled();
    });

    it('should add the logger observer to the game', async () => {
        mockedGetValidSimulationInputs.mockResolvedValue(mockValidGameInputs);

        const loggerMock = { addObserver: jest.fn() };
        mockedGameInstance.addObserver = loggerMock.addObserver;

        await runGame(mockedReadline);

        expect(loggerMock.addObserver).toHaveBeenCalled();
    });

    it('should log the start and end of the game simulation', async () => {
        mockedGetValidSimulationInputs.mockResolvedValue(mockValidGameInputs);

        console.log = jest.fn();

        await runGame(mockedReadline);

        expect(console.log).toHaveBeenCalledWith('\nStarting the zombie game simulation...\n');
        expect(console.log).toHaveBeenCalledWith('\nGame simulation completed.\n');
    });
});
