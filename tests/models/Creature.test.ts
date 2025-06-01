import { ENTITY_TYPES } from '../../src/constants';
import { Position } from '../../src/core/Position';
import { Creature } from '../../src/models/Creature';

describe('Creature', () => {
    it('should create a Creature instance with creatureId and position', () => {
        const position = new Position(10, 20);
        const creature = new Creature(position);
        expect(creature).toBeInstanceOf(Creature);
        expect(creature.getPosition()).toEqual(position);
    });

    it('should return the correct type', () => {
        const creature = new Creature(new Position(0, 0));
        expect(creature.getType()).toBe(ENTITY_TYPES.CREATURE);
    });
});
