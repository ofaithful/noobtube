import { Module } from '@nestjs/common'
import { MediaController } from './media.controller';
import { LocalUploaderService } from './local-uploader.service';

@Module({
    controllers: [MediaController],
    providers: [LocalUploaderService]
})
export class MediaModule {}