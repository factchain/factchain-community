import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { AppService } from "./app.service";
import {
  NotesResponse,
  XSignedNoteIDResponse,
  ContractsResponse,
} from "./factchain-core/types";

import { ThrottlerGuard } from "@nestjs/throttler";

import { Throttle } from "@nestjs/throttler"
import { ParseBoolPipe, DefaultValuePipe, UseGuards } from "@nestjs/common";
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

  @Get("/_contracts")
  getContracts(): ContractsResponse {
    return { contracts: this.appService.getContracts() };
  }

  @Get("/notes")
  @UseGuards(ThrottlerGuard)
  async getNotes(
    @Query("postUrl") postUrl: string,
    @Query("from") from: number,
    @Query("creatorAddress") creatorAddress: string,
    @Query("awaitingRatingBy") awaitingRatingBy: string,
    @Query("onlyUseful", new DefaultValuePipe(false), ParseBoolPipe)
    onlyUseful: boolean,
  ): Promise<NotesResponse> {
    let notes = [];
    if (from) {
      // max 21 days of lookbackdays to be kind on quicknode!
      if (!(from > 0 && from <= 21)) {
        throw new BadRequestException(
          `invalid from: ${from} should be between 1 and 21 included`,
        );
      }
    }

    // Double Query Params
    if (postUrl && awaitingRatingBy) {
      console.log(
        `Get all notes awaiting for rating by ${awaitingRatingBy} on ${postUrl}`,
      );
      notes = await this.appService.getNotesAwaitingRatingByOnGivenPost(
        postUrl,
        awaitingRatingBy,
        from,
      );
      return { notes };
    }

    // simple QueryParam
    if (postUrl) {
      console.log(`Get notes for postUrl=${postUrl}`);
      notes = await this.appService.getNotesByPost(postUrl, from);
    } else if (creatorAddress) {
      console.log(`Get all notes created by ${creatorAddress}`);
      notes = await this.appService.getNotesByCreator(creatorAddress, from);
    } else if (awaitingRatingBy) {
      console.log(`Get all notes awaiting for rating by ${awaitingRatingBy}`);
      notes = await this.appService.getNotesAwaitingRatingBy(
        awaitingRatingBy,
        from,
      );
    } else {
      console.log(`Get all notes`);
      notes = await this.appService.getAllNotesFrom(from);
    }

    // final generic QueryParam
    // let's go live <3
    return onlyUseful
      ? { notes: this.appService.filterUsefulNotes(notes) }
      : { notes };
  }

  @Get("/x/note/id")
  @UseGuards(ThrottlerGuard)
  async getXNoteID(@Query("noteUrl") noteUrl): Promise<XSignedNoteIDResponse> {
    console.log(`Get factchain ID for X note URL ${noteUrl}`);
    const res = await this.appService.getXNoteID(noteUrl);
    return res;
  }

  @Post("/x/note")
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 1000 } })
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
