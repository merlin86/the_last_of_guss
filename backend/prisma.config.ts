import { config as dotenvConfig } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenvConfig();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
