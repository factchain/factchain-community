import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Note } from './factchain-core/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/notes')
  async getNotes(@Query('postUrl') postUrl): Promise<Array<Note>> {
    const notes = await this.appService.geNotes(postUrl);
    return notes;
  }
}
