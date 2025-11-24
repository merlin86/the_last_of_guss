import { LoginModule } from '@modules/login/login.module';
import { Module } from '@nestjs/common';
import globalConfig from '@configs/global.config';
import pinoPrettyConfig from '@configs/pino-pretty.config';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from '@modules/logs/logs.module';
import { PrismaModule } from 'nestjs-prisma';
import loginConfig from '@configs/login.config';
import roundsConfig from '@configs/rounds.config';
import { RoundsModule } from '@modules/rounds/rounds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig, pinoPrettyConfig, loginConfig, roundsConfig],
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    LogsModule,
    LoginModule,
    RoundsModule,
  ],
})
export class AppModule {}
