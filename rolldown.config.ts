import { builtinModules } from 'node:module';
import { defineConfig } from 'rolldown';

const nodeBuiltins = new Set(builtinModules.flatMap((m) => [m, `node:${m}`]));

export default defineConfig({
  input: {
    bin: "./src/bin.ts"
  },
  external(source) {
    return nodeBuiltins.has(source);
  },
  output: {
    format: 'esm',
    dir: './dist',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    cleanDir: true,
  },
});
