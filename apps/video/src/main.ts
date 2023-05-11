import { startMicroservice, VIDEO_SERVICE_NAME } from '@streams/transport';
import { AppModule } from "./app/app.module";

startMicroservice(AppModule, VIDEO_SERVICE_NAME);
