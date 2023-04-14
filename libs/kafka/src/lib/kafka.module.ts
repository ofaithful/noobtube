import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Module({
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
