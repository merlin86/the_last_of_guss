import { registerAs } from '@nestjs/config';

export default registerAs('login', () => {
  const { USER_PASSWORD_SALT_ROUNDS, JWT_SECRET, JWT_EXPIRATION_MIN } = process.env;

  return {
    user_password_salt_rounds: Number.parseInt(USER_PASSWORD_SALT_ROUNDS ?? '12', 10),
    jwt_secret: JWT_SECRET ?? '',
    jwt_expiration_min: Number.parseInt(JWT_EXPIRATION_MIN ?? '60', 10),
  } as const;
});
