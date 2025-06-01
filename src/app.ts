import readline from 'readline/promises';

import { Game } from './core/Game';
import { LoggerService } from './services/LoggerService';
import { getValidSimulationInputs } from './utils/inputParser';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const startGame = async (): Promise<void> => {
    let continueRunning = true;

    while (continueRunning) {
        try {
            const gameInputs = await getValidSimulationInputs(rl);
            const { gridSize, moves, zombiePosition, creaturePositions } = gameInputs;
            const game = new Game(gridSize, moves);
            const logger = LoggerService.getInstance();

            game.addObserver(logger);
            game.initializeGame(zombiePosition, creaturePositions);
            game.run();

            const userResponse = await rl.question('Do you want to run another simulation? (y/n): ');
            continueRunning = userResponse.trim().toLowerCase().startsWith('y');
        } catch (error) {
            console.error('\nError:', error instanceof Error ? error.message : 'Unknown error');
            console.error('Please try again with valid input.\n');

            const userResponse = await rl.question('Do you want to try again? (y/n): ');
            continueRunning = userResponse.trim().toLowerCase().startsWith('y');
        }
    }

    rl.close();

    console.log('Game simulation completed.');
};

startGame();
