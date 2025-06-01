import {
    isValidGridSize,
    isValidMoves,
    isValidPosition,
    isValidPositionList,
    parseGridSize,
    parseMoves,
    parsePosition,
    parsePositionList,
} from '../../src/utils/validator';

describe('isValidGridSize', () => {
    it('should return true for valid grid sizes', () => {
        expect(isValidGridSize('1')).toBe(true);
        expect(isValidGridSize('10')).toBe(true);
        expect(isValidGridSize('100')).toBe(true);
    });

    it('should return false for invalid grid sizes', () => {
        expect(isValidGridSize('0')).toBe(false);
        expect(isValidGridSize('-1')).toBe(false);
        expect(isValidGridSize('abc')).toBe(false);
        expect(isValidGridSize('10.5')).toBe(false);
    });
});

describe('isValidMoves', () => {
    it('should return true for valid moves', () => {
        expect(isValidMoves('U')).toBe(true);
        expect(isValidMoves('D')).toBe(true);
        expect(isValidMoves('L')).toBe(true);
        expect(isValidMoves('R')).toBe(true);
        expect(isValidMoves('UDLR')).toBe(true);
    });

    it('should return false for invalid moves', () => {
        expect(isValidMoves('X')).toBe(false);
        expect(isValidMoves('NEZ')).toBe(false);
        expect(isValidMoves('U D L R')).toBe(false);
        expect(isValidMoves('')).toBe(false);
    });
});

describe('isValidPosition', () => {
    it.each([['(0, 0)'], ['(1, 2)'], ['(10,   10)'], ['  (10,   10)  ']])(
        'should return true for valid position %s',
        (input) => {
            expect(isValidPosition(input)).toBe(true);
        },
    );

    it.each([['(0, -1)'], ['0, -1)'], ['(0, -1'], ['(0, 1)(2, 3)'], ['(-1, 0)'], ['(1.5, 2)'], ['1, 2'], ['()'], ['']])(
        'should return false for invalid position %s',
        (input) => {
            expect(isValidPosition(input)).toBe(false);
        },
    );
});

describe('isValidPositionList', () => {
    it.each([['(0, 0)(1, 2)(3, 4)'], ['(10, 10)(20, 20)'], ['(1, 1)(2, 2)(3, 3)']])(
        'should return true for valid position list %s',
        (input) => {
            expect(isValidPositionList(input)).toBe(true);
        },
    );

    it.each([['(0, 0)(1, -1)'], ['(0, 0)(1, 2)(3, 4'], ['(0, 0)(1, 2))'], ['(1, 2) (3, 4)'], ['(1.5, 2.5)']])(
        'should return false for invalid position list %s',
        (input) => {
            expect(isValidPositionList(input)).toBe(false);
        },
    );
});

describe('parseGridSize', () => {
    it('should return the parsed grid size for valid input', () => {
        expect(parseGridSize('5')).toBe(5);
        expect(parseGridSize('10')).toBe(10);
    });

    it('should throw an error for invalid input', () => {
        expect(() => parseGridSize('0')).toThrow('Invalid grid size: 0');
        expect(() => parseGridSize('-1')).toThrow('Invalid grid size: -1');
        expect(() => parseGridSize('abc')).toThrow('Invalid grid size: abc');
        expect(() => parseGridSize('10.5')).toThrow('Invalid grid size: 10.5');
    });
});

describe('parseMoves', () => {
    it('should return the parsed moves for valid input', () => {
        expect(parseMoves('U')).toEqual(['U']);
        expect(parseMoves('D')).toEqual(['D']);
        expect(parseMoves('L')).toEqual(['L']);
        expect(parseMoves('R')).toEqual(['R']);
        expect(parseMoves('UDLR')).toEqual(['U', 'D', 'L', 'R']);
    });

    it('should throw an error for invalid input', () => {
        expect(() => parseMoves('X')).toThrow('Invalid moves: X');
        expect(() => parseMoves('NEZ')).toThrow('Invalid moves: NEZ');
        expect(() => parseMoves('U D L R')).toThrow('Invalid moves: U D L R');
        expect(() => parseMoves('')).toThrow('Invalid moves: ');
    });
});

describe('parsePosition', () => {
    it('should return the parsed position for valid input', () => {
        expect(parsePosition('(0, 0)')).toEqual({ x: 0, y: 0 });
        expect(parsePosition('(1, 2)')).toEqual({ x: 1, y: 2 });
        expect(parsePosition('(10,   10)')).toEqual({ x: 10, y: 10 });
    });

    it('should throw an error for invalid input', () => {
        expect(() => parsePosition('(0, -1)')).toThrow('Invalid position format: (0, -1)');
        expect(() => parsePosition('0, -1)')).toThrow('Invalid position format: 0, -1)');
        expect(() => parsePosition('(0, -1')).toThrow('Invalid position format: (0, -1');
        expect(() => parsePosition('(1.5, 2)')).toThrow('Invalid position format: (1.5, 2)');
        expect(() => parsePosition('()')).toThrow('Invalid position format: ()');
        expect(() => parsePosition('')).toThrow('Invalid position format: ');
    });
});

describe('parsePositionList', () => {
    it('should return the parsed position list for valid input', () => {
        expect(parsePositionList('(0, 0)(1, 2)(3, 4)')).toEqual([
            { x: 0, y: 0 },
            { x: 1, y: 2 },
            { x: 3, y: 4 },
        ]);
        expect(parsePositionList('(10, 10)(20, 20)')).toEqual([
            { x: 10, y: 10 },
            { x: 20, y: 20 },
        ]);
    });

    it('should throw an error for invalid input', () => {
        expect(() => parsePositionList('(0, 0)(1, -1)')).toThrow('Invalid position list format: (0, 0)(1, -1)');
        expect(() => parsePositionList('(0, 0)(1, 2)(3, 4')).toThrow('Invalid position list format: (0, 0)(1, 2)(3, 4');
        expect(() => parsePositionList('(0, 0)(1, 2))')).toThrow('Invalid position list format: (0, 0)(1, 2))');
        expect(() => parsePositionList('(1.5, 2.5)')).toThrow('Invalid position list format: (1.5, 2.5)');
    });
});
