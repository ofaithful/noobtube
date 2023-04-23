import { Module, Global } from '@nestjs/common';
import {
  UserTransportModule
} from './services';

const modules = [
  UserTransportModule
];

@Global()
@Module({
  imports: modules,
  exports: modules,
})
export class TransportModule {}
