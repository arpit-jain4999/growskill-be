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

const CORS_ORIGIN = 'http://localhost:3000';

function addCorsHeaders(reply: { header: (name: string, value: string) => unknown }) {
  reply.header('Access-Control-Allow-Origin', CORS_ORIGIN);
  reply.header('Access-Control-Allow-Credentials', 'true');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-org-id');
}

async function bootstrap() {
  const adapter = new FastifyAdapter();
  const fastify = adapter.getInstance();

  // 1) OPTIONS catch-all – handle preflight before any Nest route (register first)
  fastify.options('/*', (request, reply) => {
    addCorsHeaders(reply);
    reply.code(204).send();
  });

  // 2) onRequest – add CORS headers to every response (for actual requests)
  fastify.addHook('onRequest', (request, reply, done) => {
    addCorsHeaders(reply);
    done();
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
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
    .addTag('Orders', 'Order and payment flows. Create order (POST), list/get (GET), update status (PATCH), confirm payment (POST :id/confirm-payment). Tenant-scoped when x-org-id is sent. Webhook: POST /v1/orders/webhook with x-webhook-secret.')
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
