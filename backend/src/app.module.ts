import { LoginModule } from '@modules/login/login.module';
import { Module } from '@nestjs/common';
import globalConfig from '@configs/global.config';
import pinoPrettyConfig from '@configs/pino-pretty.config';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from '@modules/logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig, pinoPrettyConfig],
    }),
    LogsModule,
    LoginModule,
  ],
})
export class AppModule {}
