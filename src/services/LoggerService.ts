import { Direction, directionMap } from '../constants';
import { Position } from '../core/Position';
import { IGameObserver } from '../interface/IGameObserver';

export class LoggerService implements IGameObserver {
    private static instance: LoggerService | null = null;
    private logs: string[] = [];

    private constructor() {}

    static getInstance(): LoggerService {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }

    static resetInstance(): void {
        if (LoggerService.instance) {
            LoggerService.instance.logs = [];
            LoggerService.instance = null;
        }
    }

    onZombieMove(zombieId: string, currentPosition: Position, direction: Direction, nextPosition: Position): void {
        const logMessage = `Zombie ${zombieId} from ${currentPosition.toString()} moved ${directionMap[direction]} to ${nextPosition.toString()}.`;
        this.logs.push(logMessage);
    }

    onInfection(zombieId: string, position: Position): void {
        const logMessage = `Zombie ${zombieId} infected creature at ${position.toString()}.`;
        this.logs.push(logMessage);
    }

    onSimulationEnd(zombiePositions: Position[], creaturePositions: Position[]): void {
        const zombiePositionsLog =
            zombiePositions.length > 0 ? zombiePositions.map((pos) => pos.toString()).join(' ') : 'none';
        const zombieLogMessage = `zombies' positions:\n${zombiePositionsLog}`;
        const creaturePositionsLog =
            creaturePositions.length > 0 ? creaturePositions.map((pos) => pos.toString()).join(', ') : 'none';
        const creatureLogMessage = `creatures' positions:\n${creaturePositionsLog}`;
        this.logs.push(zombieLogMessage, creatureLogMessage);
        console.log(zombieLogMessage);
        console.log(creatureLogMessage);
    }

    getLogs(): string[] {
        return this.logs;
    }

    clearLogs(): void {
        this.logs = [];
    }
}
