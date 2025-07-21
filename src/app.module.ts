/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TraceMiddleware } from '@/middleware/tracing.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

import { AppController } from './modules/app.controller';

@Module({
  controllers: [AppController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line sonarjs/function-return-type
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
        const ttl = parseInt(
          configService.get<string>('THROTTLE_TTL') ?? '60',
          10,
        );
        const limit = parseInt(
          configService.get<string>('THROTTLE_LIMIT') ?? '5',
          10,
        );

        return {
          throttlers: [
            {
              ttl,
              limit,
            },
          ],
        };
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
