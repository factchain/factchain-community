import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { NotesResponse, XSignedNoteIDResponse } from "./factchain-core/types";

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
  async getNotes(
    @Query("postUrl") postUrl: string,
    @Query("from") from: number,
    @Query("creator") address: string,
  ): Promise<NotesResponse> {
    let notes = [];
    if (postUrl) {
      console.log(`Get notes for postUrl=${postUrl}`);
      notes = await this.appService.getNotesByPost(postUrl);
    } else if (from) {
      console.log(`Get all notes from ${from} days ago`);
      notes = await this.appService.getAllNotesFrom(from);
    } else if (address) {
      console.log(`Get all notes created by ${address}`);
      notes = await this.appService.getNotesByCreator(address);
    }
    return { notes };
  }

  @Get("/x/note/id")
  async getXNoteID(@Query("noteUrl") noteUrl): Promise<XSignedNoteIDResponse> {
    console.log(`Get factchain ID for X note URL ${noteUrl}`);
    const res = await this.appService.getXNoteID(noteUrl);
    return res;
  }

  @Post("/x/note")
  async createXNoteMetadata(
    @Body("noteUrl") noteUrl: string,
    @Body("content") content: string,
  ): Promise<XSignedNoteIDResponse> {
    const res = await this.appService.createXNoteMetadata(noteUrl, content);
    console.log(
      `Create metadata for X note URL ${noteUrl}, Factchain ID ${res.id}`,
    );
    return res;
  }
}
