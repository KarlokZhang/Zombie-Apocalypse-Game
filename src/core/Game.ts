import { Direction, ENTITY_TYPES } from '../constants';
import { Creature } from '../models/Creature';
import { Zombie } from '../models/Zombie';
import { Grid } from './Grid';
import { Movement } from './Movement';
import { Position } from './Position';

export class Game {
    private grid: Grid;
    private zombieQueue: Zombie[] = [];
    private movement: Movement;
    private moveSequence: Direction[] = [];

    constructor(gridSize: number, moveSequence: Direction[], movement?: Movement) {
        this.grid = new Grid(gridSize);
        this.moveSequence = moveSequence;
        this.movement = movement || new Movement();
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
    }

    private processZombieMovement(zombie: Zombie): void {
        const moves = this.moveSequence;
        for (const direction of moves) {
            const currentPosition = zombie.getPosition();
            const nextPosition = this.movement.move(currentPosition, direction, this.grid.getSize());

            this.checkAndProcessInfection(nextPosition);
            zombie.setPosition(nextPosition);
        }
    }

    private checkAndProcessInfection(nextPosition: Position): void {
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
    }

    getGrid(): Grid {
        return this.grid;
    }

    getZombieQueue(): Zombie[] {
        return this.zombieQueue;
    }
}
