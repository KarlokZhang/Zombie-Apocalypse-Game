import { ENTITY_TYPES } from '../constants';
import { Position } from '../core/Position';
import { Entity } from './Entity';

export class Creature extends Entity {
    private static creatureCount = 0;

    constructor(position: Position) {
        const creatureIndex = Creature.creatureCount++;
        super(`creature-${creatureIndex}`, position);
    }

    getType(): string {
        return ENTITY_TYPES.CREATURE;
    }
}
