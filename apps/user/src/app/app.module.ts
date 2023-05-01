import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';

import { TransportModule } from '@streams/transport';
import { DbModule } from '@streams/db';

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbModule.forRoot({
      mongoUri: process.env.MONGO_URI
    }),
    TransportModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
