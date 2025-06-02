import { Direction } from '../constants';
import { Position } from '../core/Position';

export interface IGameObserver {
    onZombieMove(zombieIndex: string, currentPosition: Position, direction: Direction, nextPosition: Position): void;
    onInfection(zombieIndex: string, position: Position): void;
    onSimulationEnd(zombiePositions: Position[], creaturePositions: Position[]): void;
}
