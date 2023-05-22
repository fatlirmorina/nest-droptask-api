import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  configSchema,
  getPinoLokiConfig,
  getPinoPrettyConfig,
} from './schemas/configuration.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from './schemas/bull-config-service.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT') || 3306,
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        try {
          return await new DataSource(options).initialize();
        } catch (e) {
          // TODO send email/log
          console.log(e);
        }
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('LOKI_URL');
        const name = configService.get<string>('APP_NAME');
        const user = configService.get<string>('LOKI_USER');
        const pass = configService.get<string>('GRAFANA_API_PASSWORD');
        return {
          pinoHttp: {
            transport: {
              targets: [
                getPinoPrettyConfig(),
                getPinoLokiConfig(host, name, user, pass),
              ],
            },
          },
        };
      },
    }),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
