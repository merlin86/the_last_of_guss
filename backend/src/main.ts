import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as packageJson from '../package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import globalConfig from '@configs/global.config';
import { ConfigType } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NullPipe } from '@common/pipes/null.pipe';
import { LogicalError } from '@common/exceptions/logical.error';
import { exceptionFactory } from '@common/utils/validation-exception-factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const globalConf = app.get<ConfigType<typeof globalConfig>>(globalConfig.KEY);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new NullPipe(),
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new LogicalError({ code: '400', message: exceptionFactory(errors) }, 400);
      },
    }),
  );

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
