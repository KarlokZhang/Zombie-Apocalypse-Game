import { ENTITY_TYPES } from '../constants';
import { Position } from '../core/Position';
import { Entity } from './Entity';

export class Zombie extends Entity {
    private static zombieCount = 0;
    private readonly zombieId: string;
    private readonly zombieIndex: string;

    constructor(position: Position) {
        const zombieIndex = Zombie.zombieCount++;
        const zombieId = `zombie-${zombieIndex}`;
        super(zombieId, position);
        this.zombieId = zombieId;
        this.zombieIndex = zombieIndex.toString();
    }

    getZombieIndex(): string {
        return this.zombieIndex;
    }

    getZombieId(): string {
        return this.zombieId;
    }

    getType(): string {
        return ENTITY_TYPES.ZOMBIE;
    }
}
