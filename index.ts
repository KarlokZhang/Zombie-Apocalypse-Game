import { startGame } from './src/app';

startGame().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
