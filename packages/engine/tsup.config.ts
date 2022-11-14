import { defineConfig } from 'tsup';
import tsconfig from './tsconfig.json';
const { target } = tsconfig.compilerOptions;

const options = {
    format: 'cjs',
    dts: true,
    target
}

export default defineConfig([
    {
        name: "event-engine",
        entry: ['src/index.ts'],
        "noExternal": ['@foxycorps/nanoevent'],
        ...options
    }
])