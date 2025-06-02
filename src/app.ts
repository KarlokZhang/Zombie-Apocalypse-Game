import readline from 'readline/promises';

import { Game } from './core/Game';
import { LoggerService } from './services/LoggerService';
import { getValidSimulationInputs } from './utils/inputParser';

export const runGame = async (rl: readline.Interface): Promise<void> => {
    const gameInputs = await getValidSimulationInputs(rl);
    const { gridSize, moves, zombiePosition, creaturePositions } = gameInputs;

    console.log('\nStarting the zombie game simulation...\n');

    const game = new Game(gridSize, moves);
    const logger = LoggerService.getInstance();

    game.addObserver(logger);
    game.initializeGame(zombiePosition, creaturePositions);
    game.run();

    console.log('\nGame simulation completed.\n');
};

export const askToContinue = async (rl: readline.Interface, question: string): Promise<boolean> => {
    const response = await rl.question(question);
    return response.trim().toLowerCase().startsWith('y');
};

export const startGame = async (): Promise<void> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let continueRunning = true;

    while (continueRunning) {
        try {
            await runGame(rl);
            continueRunning = await askToContinue(rl, '\nDo you want to run another simulation? (y/n): ');
        } catch (error) {
            console.error('\nError:', error instanceof Error ? error.message : 'Unknown error');
            console.error('Please try again with valid input.\n');

            continueRunning = await askToContinue(rl, 'Do you want to try again? (y/n): ');
        }
    }

    console.log('\nThank you for playing the zombie game simulation!');

    rl.close();
};
