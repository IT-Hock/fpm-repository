import type {Config} from 'jest';
import {defaults} from 'jest-config';

const config: Config = {
    testMatch: ['**/tests/**/*.mts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.mts$': 'ts-jest',
    }
};

export default config;