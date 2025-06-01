import { ENTITY_TYPES } from '../../src/constants';
import { Position } from '../../src/core/Position';
import { Zombie } from '../../src/models/Zombie';

describe('Zombie', () => {
    it('should create a Zombie instance with zombieId and position', () => {
        const position = new Position(10, 20);
        const zombie = new Zombie(position);
        expect(zombie).toBeInstanceOf(Zombie);
        expect(zombie.getZombieId()).toBeDefined();
        expect(zombie.getPosition()).toEqual(position);
    });

    it('should return the zombieId', () => {
        const zombie = new Zombie(new Position(0, 0));
        expect(zombie.getZombieId()).toBeDefined();
    });

    it('should return the correct type', () => {
        const zombie = new Zombie(new Position(0, 0));
        expect(zombie.getType()).toBe(ENTITY_TYPES.ZOMBIE);
    });
});
