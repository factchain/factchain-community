import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { NotesResponse, StatusResponse } from './factchain-core/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): StatusResponse {
    return this.appService.getHello();
  }

  @Get('/notes')
  async getNotes(@Query('postUrl') postUrl): Promise<NotesResponse> {
    const notes = await this.appService.getNotes(postUrl);
    return { notes };
  }
}
