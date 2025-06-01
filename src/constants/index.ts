export const DIRECTIONS = {
    UP: 'U',
    DOWN: 'D',
    LEFT: 'L',
    RIGHT: 'R',
} as const;
export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
