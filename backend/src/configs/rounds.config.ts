import { registerAs } from '@nestjs/config';

export default registerAs('rounds', () => {
  const { ROUND_DURATION, COOLDOWN_DURATION } = process.env;

  return {
    round_duration: Number.parseInt(ROUND_DURATION ?? '60', 10) ?? 60,
    cooldown_duration: Number.parseInt(COOLDOWN_DURATION ?? '30', 10) ?? 30,
  } as const;
});
