import { defineConfig, configDefaults } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    coverage: {
      exclude: [
        'src/**/*.spec.ts',
        'src/env',
        'src/utils/test',
        'prisma',
        'src/lib',
      ],
    },
  },
});
