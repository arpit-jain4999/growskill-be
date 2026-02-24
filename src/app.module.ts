import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { UsersModule } from './users/users.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { CoursesModule } from './courses/courses.module';
import { PreferencesModule } from './preferences/preferences.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ModulesModule } from './modules/modules.module';
import { ChaptersModule } from './chapters/chapters.module';
import { OrdersModule } from './orders/orders.module';
import { FilesModule } from './files/files.module';
import { PermissionsModule } from './permissions/permissions.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbUserName = configService.get<string>('DB_USER_NAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbClusterName = configService.get<string>('DB_CLUSTER_NAME');
        const dbName = configService.get<string>('DB_NAME') || 'skillgroww';

        // Validate required environment variables
        const missingVars: string[] = [];
        if (!dbUserName) missingVars.push('DB_USER_NAME');
        if (!dbPassword) missingVars.push('DB_PASSWORD');
        if (!dbClusterName) missingVars.push('DB_CLUSTER_NAME');

        if (missingVars.length > 0) {
          throw new Error(
            `Missing required MongoDB environment variables: ${missingVars.join(', ')}. ` +
            `Please check your .env file and ensure all required variables are set.`
          );
        }

        // Build MongoDB connection URI dynamically
        const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbClusterName}/${dbName}`;

        return { uri };
      },
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    CohortsModule,
    CoursesModule,
    PreferencesModule,
    NotificationsModule,
    ModulesModule,
    ChaptersModule,
    OrdersModule,
    FilesModule,
    PermissionsModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
