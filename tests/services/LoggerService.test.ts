import { DIRECTIONS } from '../../src/constants';
import { Position } from '../../src/core/Position';
import { LoggerService } from '../../src/services/LoggerService';

describe('LoggerService', () => {
    let loggerService: LoggerService;

    beforeEach(() => {
        LoggerService.resetInstance();
        loggerService = LoggerService.getInstance();
    });

    it('should always return the only instance of LoggerService', () => {
        const firstInstance = LoggerService.getInstance();
        const secondInstance = LoggerService.getInstance();

        expect(firstInstance).toBe(secondInstance);
    });

    it('should clear the instance and logs on reset instance', () => {
        loggerService.onZombieMove('testID', new Position(1, 2), DIRECTIONS.DOWN, new Position(3, 4));
        expect(loggerService.getLogs().length).toBe(1);

        LoggerService.resetInstance();
        expect(loggerService.getLogs().length).toBe(0);
    });

    it('should log zombie movement', () => {
        loggerService.onZombieMove('testID', new Position(1, 2), DIRECTIONS.DOWN, new Position(3, 4));
        const logs = loggerService.getLogs();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe('Zombie testID from (1, 2) moved down to (3, 4).');
    });

    it('should log zombie infection', () => {
        loggerService.onInfection('testID', new Position(5, 6));
        const logs = loggerService.getLogs();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe('Zombie testID infected creature at (5, 6).');
    });

    it('should log simulation end with zombie and creature positions', () => {
        const zombiePositions = [new Position(5, 6), new Position(7, 8)];
        const creaturePositions = [new Position(9, 10)];
        loggerService.onSimulationEnd(zombiePositions, creaturePositions);
        const logs = loggerService.getLogs();
        expect(logs.length).toBe(2);
        expect(logs[0]).toBe("zombies' positions:\n(5, 6) (7, 8).");
        expect(logs[1]).toBe("creatures' positions:\n(9, 10).");
    });

    it('should log simulation end with no zombies and no creatures', () => {
        loggerService.onSimulationEnd([], []);
        const logs = loggerService.getLogs();
        expect(logs.length).toBe(2);
        expect(logs[0]).toBe("zombies' positions:\nnone.");
        expect(logs[1]).toBe("creatures' positions:\nnone.");
    });

    it('should return logs', () => {
        loggerService.onZombieMove('testID', new Position(1, 2), DIRECTIONS.DOWN, new Position(3, 4));
        const logs = loggerService.getLogs();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe('Zombie testID from (1, 2) moved down to (3, 4).');
    });

    it('should clear logs', () => {
        loggerService.onZombieMove('testID', new Position(1, 2), DIRECTIONS.DOWN, new Position(3, 4));
        loggerService.clearLogs();
        expect(loggerService.getLogs().length).toBe(0);
    });
});
