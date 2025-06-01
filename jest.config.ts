import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    verbose: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts', '!src/**/index.ts'],
};

export default config;
