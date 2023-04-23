/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { startMicroservice, USER_SERVICE_NAME } from '@streams/transport';
import { AppModule } from "./app/app.module";

startMicroservice(AppModule, USER_SERVICE_NAME);
