import { Controller, Get } from "@nestjs/common";
import { UserRepository } from '@streams/db';
import { AppService } from "./app.service";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly userRepository: UserRepository
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
