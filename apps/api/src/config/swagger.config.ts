import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Property Management API')
    .setDescription(
      'API for managing buildings, apartments, tenants, and payments',
    )
    .setVersion('1.0')
    .addTag('Buildings', 'Building management operations')
    .addTag('Apartments', 'Apartment management operations')
    .addTag('Users', 'User management operations')
    .addTag('Payments', 'Payment management operations')
    .addServer('http://localhost:3001', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
