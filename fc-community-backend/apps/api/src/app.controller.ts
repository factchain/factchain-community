import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { NotesResponse, XNoteIDResponse } from "./factchain-core/types";

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

  @Get("/x/note/id")
  async getXNoteID(@Query("noteUrl") noteUrl): Promise<XNoteIDResponse> {
    console.log(`Get factchain ID for X note URL ${noteUrl}`);
    const id = await this.appService.getXNoteID(noteUrl);
    return { id: id };
  }

  @Post("/x/note")
  async createXNoteMetadata(
    @Body("noteUrl") noteUrl: string,
    @Body("content") content: string,
  ): Promise<XNoteIDResponse> {
    const id = await this.appService.createXNoteMetadata(noteUrl, content);
    return { id: id };
  }
}
