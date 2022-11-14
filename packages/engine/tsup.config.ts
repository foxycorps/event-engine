import { defineConfig } from 'tsup';
import tsconfig from './tsconfig.json';
const { target } = tsconfig.compilerOptions;

const options = {
    noExternal: ['@foxycorps/nanoevent'],
    format: 'cjs',
    dts: true,
    target
}

export default defineConfig([
    {
        name: "event-engine",
        entry: ['src/index.ts'],
        ...options
    },
    {
        name: "event-engine-inputs",
        entry: ['src/strategies/inputs.ts'],
        ...options
    },
    {
        name: "event-engine-outputs",
        entry: ['src/strategies/outputs.ts'],
        ...options
    }
])