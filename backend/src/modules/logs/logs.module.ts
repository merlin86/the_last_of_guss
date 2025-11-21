import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pinoPrettyConfig from '@configs/pino-pretty.config';
import * as stdSerializers from 'pino-std-serializers';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (pinoConfig: ConfigType<typeof pinoPrettyConfig>) => {
        const globalConfig = pinoConfig.global;
        const pinoPrettyConfig = pinoConfig.pinoPretty;

        return {
          pinoHttp: {
            quietReqLogger: true,
            base: null,
            level: globalConfig.logLevel,
            timestamp: () => `,"time":"${new Date().toISOString()}"`,
            serializers: {
              error: stdSerializers.err,
            },
            formatters: {
              level: (label: string) => ({ level: label }),
              log: (msgObject: Record<string, unknown>) => {
                if (msgObject.context && msgObject.message) {
                  const { context, message, ...rest } = msgObject;
                  // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                  return { msg: `${context} > ${message}`, ...rest };
                }
                return msgObject;
              },
            },
            redact: {
              paths: ['req.id', 'req.headers', 'res.headers'],
              censor: '[Redacted]',
            },
            useLevelLabels: true,
            transport: pinoPrettyConfig.isUseLogPrettyTransport
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: pinoPrettyConfig.singleLine,
                    colorize: pinoPrettyConfig.colorize,
                    levelFirst: pinoPrettyConfig.levelFirst,
                    translateTime: pinoPrettyConfig.translateTime,
                  },
                }
              : undefined,
          },
        };
      },
      inject: [pinoPrettyConfig.KEY],
    }),
  ],
})
export class LogsModule {}
