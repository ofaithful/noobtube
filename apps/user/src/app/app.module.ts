import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { KafkaService } from 'libs/kafka/src/lib/kafka.service';

@Module({
  imports: [KafkaService],
  controllers: [AppController],
  providers: [AppService, KafkaService],
})
export class AppModule {}
