import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerService } from './common/services/logger.service';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const logger = app.get(LoggerService);
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  
  // Global response interceptor - automatically wraps responses
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SkillGroww API')
    .setDescription('SkillGroww Backend API Documentation')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Cohorts', 'Public cohort endpoints')
    .addTag('Admin', 'Admin endpoints')
    .addTag('Courses', 'Course management endpoints')
    .addTag('Preferences', 'User preferences endpoints')
    .addTag('Notifications', 'Notification endpoints')
    .addTag('Modules', 'Module management endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Files', 'File upload endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger documentation available at: http://localhost:${port}/api-docs`, 'Bootstrap');
}
bootstrap();
