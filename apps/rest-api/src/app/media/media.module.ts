import { Module } from '@nestjs/common'
import { MediaController } from './media.controller';
import { LocalUploaderService } from './local-uploader.service';
import { MediaService } from './media.service';

@Module({
    controllers: [MediaController],
    providers: [LocalUploaderService, MediaService]
})
export class MediaModule {}