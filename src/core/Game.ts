import { Direction, ENTITY_TYPES } from '../constants';
import { IGameObserver } from '../interface/IGameObserver';
import { Creature } from '../models/Creature';
import { Zombie } from '../models/Zombie';
import { Grid } from './Grid';
import { Movement } from './Movement';
import { Position } from './Position';

export class Game {
    private grid: Grid;
    private zombieQueue: Zombie[] = [];
    private movement: Movement;
    private observers: IGameObserver[] = [];
    private moveSequence: Direction[] = [];

    constructor(gridSize: number, moveSequence: Direction[], movement?: Movement) {
        this.grid = new Grid(gridSize);
        this.moveSequence = moveSequence;
        this.movement = movement || new Movement();
    }

    addObserver(observer: IGameObserver): void {
        this.observers.push(observer);
    }

    removeObserver(observer: IGameObserver): void {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    getObservers(): IGameObserver[] {
        return this.observers;
    }

    initializeGame(zombiePosition: Position, creaturePositions: Position[]): void {
        this.zombieQueue = [];

        const initialZombie = new Zombie(zombiePosition);
        this.grid.addEntity(initialZombie);
        this.zombieQueue.push(initialZombie);

        for (const position of creaturePositions) {
            const creature = new Creature(position);
            this.grid.addEntity(creature);
        }
    }

    run(): void {
        let currentZombieIndex = 0;

        while (currentZombieIndex < this.zombieQueue.length) {
            const zombie = this.zombieQueue[currentZombieIndex];
            this.processZombieMovement(zombie);
            currentZombieIndex += 1;
        }

        this.notifySimulationEnd();
    }

    private processZombieMovement(zombie: Zombie): void {
        const moves = this.moveSequence;
        for (const direction of moves) {
            const currentPosition = zombie.getPosition();
            const nextPosition = this.movement.move(currentPosition, direction, this.grid.getSize());

            this.notifyZombieMovement(zombie.getZombieIndex(), currentPosition, direction, nextPosition);
            this.checkAndProcessInfection(zombie.getZombieIndex(), nextPosition);
            zombie.setPosition(nextPosition);
        }
    }

    private notifyZombieMovement(
        zombieIndex: string,
        currentPosition: Position,
        direction: Direction,
        nextPosition: Position,
    ): void {
        for (const observer of this.observers) {
            observer.onZombieMove(zombieIndex, currentPosition, direction, nextPosition);
        }
    }

    private checkAndProcessInfection(zombieIndex: string, nextPosition: Position): void {
        const entity = this.grid.getEntityByPosition(nextPosition);
        if (!entity) {
            return;
        }

        if (entity.getType() !== ENTITY_TYPES.CREATURE) {
            return;
        }

        this.grid.removeEntity(entity.getId());

        const newZombie = new Zombie(nextPosition);
        this.grid.addEntity(newZombie);
        this.zombieQueue.push(newZombie);

        this.notifyInfection(zombieIndex, nextPosition);
    }

    private notifyInfection(zombieIndex: string, position: Position): void {
        for (const observer of this.observers) {
            observer.onInfection(zombieIndex, position);
        }
    }

    private notifySimulationEnd(): void {
        const zombiePositions = this.zombieQueue.map((zombie) => zombie.getPosition());
        const creaturePositions = this.grid
            .getEntitiesByType(ENTITY_TYPES.CREATURE)
            .map((creature) => creature.getPosition());

        for (const observer of this.observers) {
            observer.onSimulationEnd(zombiePositions, creaturePositions);
        }
    }

    getGrid(): Grid {
        return this.grid;
    }

    getZombieQueue(): Zombie[] {
        return this.zombieQueue;
    }
}
