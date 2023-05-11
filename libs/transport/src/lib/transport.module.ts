import { Module, Global } from '@nestjs/common';
import {
  UserTransportModule, VideoTransportModule
} from './services';

const modules = [
  UserTransportModule,
  VideoTransportModule
];

@Global()
@Module({
  imports: modules,
  exports: modules,
})
export class TransportModule {}
