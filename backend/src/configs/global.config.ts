import { registerAs } from '@nestjs/config';

export default registerAs('global', () => {
  const { APP_PORT, ORIGINS, ENABLE_SWAGGER } = process.env;

  return {
    port: Number.parseInt(APP_PORT ?? '3000', 10) ?? 3000,
    origins: JSON.parse(ORIGINS ?? 'null'),
    enable_swagger: ENABLE_SWAGGER?.toLowerCase() === 'true',
  } as const;
});
