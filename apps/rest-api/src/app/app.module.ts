import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TransportModule } from '@streams/transport';
import { AppService } from './app.service';
import { MediaModule } from './media';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    // TransportModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
