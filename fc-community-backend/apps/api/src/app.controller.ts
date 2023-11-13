import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { NotesResponse } from "./factchain-core/types";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/_version")
  getVersion(): string {
    return this.appService.getVersion();
  }

  @Get("/notes")
  async getNotes(@Query("postUrl") postUrl): Promise<NotesResponse> {
    console.log(`Get notes for postUrl=${postUrl}`);
    const notes = await this.appService.getNotes(postUrl);
    return { notes };
  }
}
