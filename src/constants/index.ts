export const DIRECTIONS = {
    UP: 'U',
    DOWN: 'D',
    LEFT: 'L',
    RIGHT: 'R',
} as const;
export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

export const directionMap: Record<Direction, string> = {
    [DIRECTIONS.UP]: 'up',
    [DIRECTIONS.DOWN]: 'down',
    [DIRECTIONS.LEFT]: 'left',
    [DIRECTIONS.RIGHT]: 'right',
};

export const ENTITY_TYPES = {
    ZOMBIE: 'zombie',
    CREATURE: 'creature',
} as const;
export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];
