import { registerAs } from '@nestjs/config';

export default registerAs('pinoPretty', () => {
  const { LOG_SINGLE_LINE, LOG_COLORIZE, LOG_LEVEL_FIRST, LOG_TRANSLATE_TIME, IS_USE_LOG_PRETTY_TRANSPORT, LOG_LEVEL } =
    process.env;

  return {
    global: {
      logLevel: LOG_LEVEL ?? 'info',
    },
    pinoPretty: {
      isUseLogPrettyTransport: IS_USE_LOG_PRETTY_TRANSPORT?.toLowerCase() === 'true',
      singleLine: (LOG_SINGLE_LINE ?? 'true').toLowerCase() === 'true',
      colorize: (LOG_COLORIZE ?? 'true').toLowerCase() === 'true',
      levelFirst: (LOG_LEVEL_FIRST ?? 'true').toLowerCase() === 'true',
      translateTime: LOG_TRANSLATE_TIME ?? 'h:MM:ss',
    },
  } as const;
});
