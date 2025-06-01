import { Direction } from '../constants';
import { Position } from '../core/Position';

export interface IGameObserver {
    onZombieMove(zombieId: string, currentPosition: Position, direction: Direction, nextPosition: Position): void;
    onInfection(zombieId: string, position: Position): void;
    onSimulationEnd(zombiePositions: Position[], creaturePositions: Position[]): void;
}
