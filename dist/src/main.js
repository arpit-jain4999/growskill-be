"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logger_service_1 = require("./common/services/logger.service");
const transform_response_interceptor_1 = require("./common/interceptors/transform-response.interceptor");
const CORS_ORIGIN = 'http://localhost:3000';
function addCorsHeaders(reply) {
    reply.header('Access-Control-Allow-Origin', CORS_ORIGIN);
    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-org-id');
}
async function bootstrap() {
    const adapter = new platform_fastify_1.FastifyAdapter();
    const fastify = adapter.getInstance();
    fastify.options('/*', (request, reply) => {
        addCorsHeaders(reply);
        reply.code(204).send();
    });
    fastify.addHook('onRequest', (request, reply, done) => {
        addCorsHeaders(reply);
        done();
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    const logger = app.get(logger_service_1.LoggerService);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(logger));
    app.useGlobalInterceptors(new transform_response_interceptor_1.TransformResponseInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
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
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
    logger.log(`Swagger documentation available at: http://localhost:${port}/api-docs`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map