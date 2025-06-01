import { EntityType } from '../constants';
import { Entity } from '../models/Entity';
import { Position } from './Position';

export class Grid {
    private readonly size: number;
    private entities: Map<string, Entity> = new Map();

    constructor(size: number) {
        if (size <= 0) {
            throw new Error('Grid size must be a positive number.');
        }
        this.size = size;
    }

    addEntity(entity: Entity): void {
        this.entities.set(entity.getId(), entity);
    }

    removeEntity(entityId: string): void {
        this.entities.delete(entityId);
    }

    getEntityByPosition(position: Position): Entity | undefined {
        for (const entity of this.entities.values()) {
            if (entity.getPosition().equals(position)) {
                return entity;
            }
        }
        return undefined;
    }

    getEntitiesByType(type: EntityType): Entity[] {
        const result: Entity[] = [];
        for (const entity of this.entities.values()) {
            if (entity.getType() === type) {
                result.push(entity);
            }
        }
        return result;
    }

    getEntities(): Entity[] {
        return Array.from(this.entities.values());
    }

    getSize(): number {
        return this.size;
    }
}
