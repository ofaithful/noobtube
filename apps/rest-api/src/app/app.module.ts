import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TransportModule } from '@streams/transport';
import { AppService } from './app.service';
import { MediaModule } from './media';
import { AuthModule } from './auth/auth.module';
import { DbModule } from '@streams/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbModule.forRoot({
      mongoUri: process.env.MONGO_URI
    }),
    TransportModule,
    MediaModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
