import { DIRECTIONS, ENTITY_TYPES } from '../../src/constants';
import { Game } from '../../src/core/Game';
import { Position } from '../../src/core/Position';
import { Zombie } from '../../src/models/Zombie';

const mockObserver = {
    onZombieMove: jest.fn(),
    onInfection: jest.fn(),
    onSimulationEnd: jest.fn(),
};

describe('Game', () => {
    it('should create a Game instance with a grid and move sequence', () => {
        const game = new Game(10, [DIRECTIONS.UP]);
        expect(game).toBeInstanceOf(Game);
        expect(game.getGrid()).toBeDefined();
        expect(game.getGrid().getSize()).toBe(10);
    });

    it('should add an observer to the game', () => {
        const game = new Game(10, [DIRECTIONS.UP]);

        game.addObserver(mockObserver);
        expect(game.getObservers()).toContain(mockObserver);
    });

    it('should remove an observer from the game', () => {
        const game = new Game(10, [DIRECTIONS.UP]);

        game.addObserver(mockObserver);
        game.removeObserver(mockObserver);
        expect(game.getObservers()).not.toContain(mockObserver);
    });

    it('should return all observers of the game', () => {
        const game = new Game(10, [DIRECTIONS.UP]);
        const mockObserver1 = {
            onZombieMove: jest.fn(),
            onInfection: jest.fn(),
            onSimulationEnd: jest.fn(),
        };

        const mockObserver2 = {
            onZombieMove: jest.fn(),
            onInfection: jest.fn(),
            onSimulationEnd: jest.fn(),
        };
        game.addObserver(mockObserver1);
        game.addObserver(mockObserver2);
        expect(game.getObservers()).toEqual([mockObserver1, mockObserver2]);
    });

    it('should initialize the game with a zombie position and a list of creature positions', () => {
        const game = new Game(10, [DIRECTIONS.UP]);
        const grid = game.getGrid();
        const zombiePosition = new Position(0, 0);
        const creaturePositions = [new Position(1, 1), new Position(2, 2)];

        game.initializeGame(zombiePosition, creaturePositions);

        expect(game).toBeInstanceOf(Game);
        const zombies = grid.getEntitiesByType(ENTITY_TYPES.ZOMBIE);
        expect(zombies.length).toBe(1);
        expect(zombies[0].getPosition()).toEqual(zombiePosition);

        const creatures = grid.getEntitiesByType(ENTITY_TYPES.CREATURE);
        expect(creatures.length).toBe(2);
    });

    it('should run the game and process zombie movements without infacting any creatures', () => {
        const game = new Game(10, [DIRECTIONS.UP, DIRECTIONS.RIGHT]);
        const zombiePosition = new Position(0, 0);
        const creaturePositions = [new Position(1, 1), new Position(2, 2)];

        game.initializeGame(zombiePosition, creaturePositions);
        game.addObserver(mockObserver);
        game.run();

        const grid = game.getGrid();
        const zombies = grid.getEntitiesByType(ENTITY_TYPES.ZOMBIE);
        expect(zombies.length).toBe(1);
        expect(zombies[0].getPosition()).toEqual(new Position(1, 9));
        expect(mockObserver.onZombieMove).toHaveBeenCalled();
    });

    it('should run the game and process zombie movements with infection', () => {
        const game = new Game(10, [DIRECTIONS.DOWN, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.RIGHT]);
        const zombiePosition = new Position(0, 0);
        const creaturePositions = [new Position(1, 1), new Position(2, 2)];

        game.initializeGame(zombiePosition, creaturePositions);
        game.addObserver(mockObserver);
        game.run();

        const grid = game.getGrid();
        const zombies = grid.getEntitiesByType(ENTITY_TYPES.ZOMBIE);
        expect(zombies.length).toBe(3);
        expect(zombies[0].getPosition()).toEqual(new Position(2, 2));

        // all creatures should be infected and turned into zombies
        const creatures = grid.getEntitiesByType(ENTITY_TYPES.CREATURE);
        expect(creatures.length).toBe(0);

        expect(mockObserver.onZombieMove).toHaveBeenCalled();
        expect(mockObserver.onInfection).toHaveBeenCalledTimes(2);
        expect(mockObserver.onSimulationEnd).toHaveBeenCalled();
    });

    it('should return the correct zombie queue when there is no infection', () => {
        const game = new Game(10, [DIRECTIONS.UP]);
        const zombiePosition = new Position(0, 0);
        const creaturePositions = [new Position(1, 1)];

        game.initializeGame(zombiePosition, creaturePositions);
        game.run();

        const zombieQueue = game.getZombieQueue();
        expect(zombieQueue.length).toBe(1);
        expect(zombieQueue[0].getPosition()).toEqual(new Position(0, 9));
    });

    it('should return the correct zombie queue when it has infection', () => {
        const game = new Game(10, [DIRECTIONS.DOWN, DIRECTIONS.RIGHT]);
        const zombiePosition = new Position(0, 0);
        const creaturePositions = [new Position(1, 1)];

        game.initializeGame(zombiePosition, creaturePositions);
        game.run();

        const zombieQueue = game.getZombieQueue();
        expect(zombieQueue.length).toBe(2);
        expect(zombieQueue[0]).toBeInstanceOf(Zombie);
        expect(zombieQueue[1]).toBeInstanceOf(Zombie);
    });
});
