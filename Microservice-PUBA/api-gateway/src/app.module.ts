import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        const required = ['USERS_SERVICE_URL', 'BOOKS_SERVICE_URL', 'LOANS_SERVICE_URL'];
        const missing = required.filter((key) => !config[key]);

        if (missing.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missing.join(', ')}. Please check your .env file.`,
          );
        }

        return config;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
