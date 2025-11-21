import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as packageJson from '../package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableVersioning({
    type: VersioningType.URI,
  });

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
