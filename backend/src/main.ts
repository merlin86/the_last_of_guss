import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as packageJson from '../package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import globalConfig from '@configs/global.config';
import { ConfigType } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const globalConf = app.get<ConfigType<typeof globalConfig>>(globalConfig.KEY);

  app.useLogger(app.get(Logger));

  if (globalConf.enable_swagger) {
    const app_version = `v${packageJson.version}`;
    const config = new DocumentBuilder().setTitle('The Last Of Guss Backend').setVersion(app_version).addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'Authorization',
    );
    const document = SwaggerModule.createDocument(app, config.build(), {});
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  if (globalConf.origins) {
    app.enableCors({
      origin: globalConf.origins,
      methods: 'GET,HEAD,POST',
      credentials: true,
    });
  }

  await app.listen(globalConf.port);
}

bootstrap();
