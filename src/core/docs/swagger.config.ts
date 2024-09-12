import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setUpSwagger(app: INestApplication<any>): void {
  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const customOptions: SwaggerCustomOptions = {
    useGlobalPrefix: true,
    explorer: true,
    jsonDocumentUrl: 'docs/json',
    customSiteTitle: 'Antares Insight Docs',
  };

  const config = new DocumentBuilder()
    .setTitle('Antares Insight')
    .setDescription('The API documentation of Antares Insight IoT platform.')
    .setVersion('0.0.1')
    .addTag('typescript,iot,websocket')
    .addGlobalParameters({
      in: 'header',
      required: true,
      name: 'X-API-Key',
      description: 'API key to access all endpoints',
      schema: {
        type: 'string',
        example: 'somesupersecretapikey',
      },
    })
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, documentOptions);
  SwaggerModule.setup('docs', app, document, customOptions);
}
