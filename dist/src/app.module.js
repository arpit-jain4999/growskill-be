"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const logging_middleware_1 = require("./common/middlewares/logging.middleware");
const users_module_1 = require("./users/users.module");
const cohorts_module_1 = require("./cohorts/cohorts.module");
const courses_module_1 = require("./courses/courses.module");
const preferences_module_1 = require("./preferences/preferences.module");
const notifications_module_1 = require("./notifications/notifications.module");
const modules_module_1 = require("./modules/modules.module");
const chapters_module_1 = require("./chapters/chapters.module");
const orders_module_1 = require("./orders/orders.module");
const files_module_1 = require("./files/files.module");
const permissions_module_1 = require("./permissions/permissions.module");
const organizations_module_1 = require("./organizations/organizations.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logging_middleware_1.LoggingMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const dbUserName = configService.get('DB_USER_NAME');
                    const dbPassword = configService.get('DB_PASSWORD');
                    const dbClusterName = configService.get('DB_CLUSTER_NAME');
                    const dbName = configService.get('DB_NAME') || 'skillgroww';
                    const missingVars = [];
                    if (!dbUserName)
                        missingVars.push('DB_USER_NAME');
                    if (!dbPassword)
                        missingVars.push('DB_PASSWORD');
                    if (!dbClusterName)
                        missingVars.push('DB_CLUSTER_NAME');
                    if (missingVars.length > 0) {
                        throw new Error(`Missing required MongoDB environment variables: ${missingVars.join(', ')}. ` +
                            `Please check your .env file and ensure all required variables are set.`);
                    }
                    const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbClusterName}/${dbName}`;
                    return { uri };
                },
                inject: [config_1.ConfigService],
            }),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            cohorts_module_1.CohortsModule,
            courses_module_1.CoursesModule,
            preferences_module_1.PreferencesModule,
            notifications_module_1.NotificationsModule,
            modules_module_1.ModulesModule,
            chapters_module_1.ChaptersModule,
            orders_module_1.OrdersModule,
            files_module_1.FilesModule,
            permissions_module_1.PermissionsModule,
            organizations_module_1.OrganizationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map