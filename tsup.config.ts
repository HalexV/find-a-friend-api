import { defineConfig } from 'tsup';

const ignoredPaths = ['!src/@types', '!src/**/*.spec.ts', '!src/utils/images'];

export default defineConfig({
  entry: ['src/**/*.ts', ...ignoredPaths],
});
