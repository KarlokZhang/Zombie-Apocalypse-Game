import { ENTITY_TYPES } from '../../src/constants';
import { Grid } from '../../src/core/Grid';
import { Position } from '../../src/core/Position';
import { Creature } from '../../src/models/Creature';
import { Zombie } from '../../src/models/Zombie';

describe('Grid', () => {
    it('should create a Grid instance with a positive size', () => {
        const grid = new Grid(10);
        expect(grid).toBeInstanceOf(Grid);
        expect(grid.getSize()).toBe(10);
    });
    it('should throw an error when created with a non-positive size', () => {
        expect(() => new Grid(0)).toThrow('Grid size must be a positive number.');
        expect(() => new Grid(-5)).toThrow('Grid size must be a positive number.');
    });

    it('should add an zombie entity to the grid', () => {
        const grid = new Grid(10);
        const zombieEntity = new Zombie(new Position(0, 0));
        grid.addEntity(zombieEntity);
        expect(grid.getEntities().length).toBe(1);
        expect(grid.getEntityByPosition(new Position(0, 0))).toEqual(zombieEntity);
    });

    it('should add an creature entity to the grid', () => {
        const grid = new Grid(10);
        const creatureEntity = new Creature(new Position(1, 1));
        grid.addEntity(creatureEntity);
        expect(grid.getEntities().length).toBe(1);
        expect(grid.getEntityByPosition(new Position(1, 1))).toEqual(creatureEntity);
    });

    it('should remove an entity from the grid', () => {
        const grid = new Grid(10);
        const zombieEntity = new Zombie(new Position(0, 0));
        grid.addEntity(zombieEntity);
        expect(grid.getEntities().length).toBe(1);
        grid.removeEntity(zombieEntity.getId());
        expect(grid.getEntities().length).toBe(0);
        expect(grid.getEntityByPosition(new Position(0, 0))).toBeUndefined();
    });

    it('should return entities by type', () => {
        const grid = new Grid(10);
        const zombieEntity1 = new Zombie(new Position(0, 0));
        const zombieEntity2 = new Zombie(new Position(1, 1));
        const creatureEntity = new Creature(new Position(2, 2));

        grid.addEntity(zombieEntity1);
        grid.addEntity(zombieEntity2);
        grid.addEntity(creatureEntity);

        const zombies = grid.getEntitiesByType(ENTITY_TYPES.ZOMBIE);
        expect(zombies.length).toBe(2);
        expect(zombies).toContain(zombieEntity1);
        expect(zombies).toContain(zombieEntity2);

        const creatures = grid.getEntitiesByType(ENTITY_TYPES.CREATURE);
        expect(creatures.length).toBe(1);
        expect(creatures).toContain(creatureEntity);
    });

    it('should return all entities in the grid', () => {
        const grid = new Grid(10);
        const zombieEntity1 = new Zombie(new Position(0, 0));
        const zombieEntity2 = new Zombie(new Position(1, 1));
        const creatureEntity = new Creature(new Position(2, 2));

        grid.addEntity(zombieEntity1);
        grid.addEntity(zombieEntity2);
        grid.addEntity(creatureEntity);

        const allEntities = grid.getEntities();
        expect(allEntities.length).toBe(3);
        expect(allEntities).toContain(zombieEntity1);
        expect(allEntities).toContain(zombieEntity2);
        expect(allEntities).toContain(creatureEntity);
    });

    it('should return undefined for an entity at a position with no entity', () => {
        const grid = new Grid(10);
        expect(grid.getEntityByPosition(new Position(5, 5))).toBeUndefined();
    });

    it('should return the correct size of the grid', () => {
        const grid = new Grid(10);
        expect(grid.getSize()).toBe(10);
    });
});
