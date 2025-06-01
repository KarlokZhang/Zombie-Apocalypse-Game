import { randomUUID } from 'crypto';

import { ENTITY_TYPES } from '../constants';
import { Position } from '../core/Position';
import { Entity } from './Entity';

export class Zombie extends Entity {
    private readonly zombieId: string;

    constructor(position: Position) {
        const zombieId = randomUUID();
        super(zombieId, position);
        this.zombieId = zombieId;
    }

    getZombieId(): string {
        return this.zombieId;
    }

    getType(): string {
        return ENTITY_TYPES.ZOMBIE;
    }
}
