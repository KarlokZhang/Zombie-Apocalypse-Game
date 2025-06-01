import { randomUUID } from 'crypto';

import { ENTITY_TYPES } from '../constants';
import { Position } from '../core/Position';
import { Entity } from './Entity';

export class Creature extends Entity {
    constructor(position: Position) {
        const creatureId = randomUUID();
        super(creatureId, position);
    }

    getType(): string {
        return ENTITY_TYPES.CREATURE;
    }
}
