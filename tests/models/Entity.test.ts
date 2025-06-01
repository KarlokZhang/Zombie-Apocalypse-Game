import { Position } from '../../src/core/Position';
import { Entity } from '../../src/models/Entity';

describe('Entity', () => {
    class TestEntity extends Entity {
        getType(): string {
            return 'TestEntity';
        }
    }

    it('should create an Entity instance with correct properties', () => {
        const position = new Position(10, 20);
        const entity = new TestEntity('test-id', position);
        expect(entity).toBeInstanceOf(TestEntity);
        expect(entity.getId()).toBe('test-id');
        expect(entity.getPosition()).toEqual(position);
    });

    it('should allow setting a new position', () => {
        const initialPosition = new Position(5, 10);
        const entity = new TestEntity('test-id', initialPosition);
        const newPosition = new Position(6, 10);

        entity.setPosition(newPosition);
        expect(entity.getPosition()).toEqual(newPosition);
    });

    it('should return the correct type', () => {
        const entity = new TestEntity('test-id', new Position(0, 0));
        expect(entity.getType()).toBe('TestEntity');
    });
});
