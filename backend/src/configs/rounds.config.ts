import { registerAs } from '@nestjs/config';

export default registerAs('rounds', () => {
  const { ROLE_FOR_ROUND_CREATION, BLACKLISTED_ROLES, ROUND_DURATION, COOLDOWN_DURATION } = process.env;

  return {
    role_for_round_creation: ROLE_FOR_ROUND_CREATION ?? 'admin',
    blacklisted_roles: BLACKLISTED_ROLES ? JSON.parse(BLACKLISTED_ROLES) : [],
    round_duration: Number.parseInt(ROUND_DURATION ?? '60', 10) ?? 60,
    cooldown_duration: Number.parseInt(COOLDOWN_DURATION ?? '30', 10) ?? 30,
  } as const;
});
