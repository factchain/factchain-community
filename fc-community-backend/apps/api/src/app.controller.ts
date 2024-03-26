import {
  Controller,
  Get,
  Post,
  Query,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { NotesResponse, XSignedNoteIDResponse } from "./factchain-core/types";

import { ThrottlerGuard } from "@nestjs/throttler";

import { Throttle } from "@nestjs/throttler";
import {
  ParseBoolPipe,
  DefaultValuePipe,
  UseGuards,
  Headers,
} from "@nestjs/common";
import { getNetworkConfig } from "./factchain-core/networks/config";
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
  @UseGuards(ThrottlerGuard)
  async getNotes(
    @Query("postUrl") postUrl: string,
    @Query("from") from: number,
    @Query("creatorAddress") creatorAddress: string,
    @Query("awaitingRatingBy") awaitingRatingBy: string,
    @Query("onlyUseful", new DefaultValuePipe(false), ParseBoolPipe)
    onlyUseful: boolean,
    @Headers() headers: Record<string, any>,
  ): Promise<NotesResponse> {
    const network = getNetworkConfig(headers["network"]);
    let notes = [];

    // Double Query Params
    if (postUrl && awaitingRatingBy) {
      console.log(
        `Get all notes awaiting for rating by ${awaitingRatingBy} on ${postUrl}`,
      );
      notes = await this.appService.getNotesAwaitingRatingByOnGivenPost(
        network,
        postUrl,
        awaitingRatingBy,
        from,
      );
      return { notes };
    }

    // simple QueryParam
    if (postUrl) {
      console.log(`Get notes for postUrl=${postUrl}`);
      notes = await this.appService.getNotesByPost(network, postUrl, from);
    } else if (creatorAddress) {
      console.log(`Get all notes created by ${creatorAddress}`);
      notes = await this.appService.getNotesByCreator(
        network,
        creatorAddress,
        from,
      );
    } else if (awaitingRatingBy) {
      console.log(`Get all notes awaiting for rating by ${awaitingRatingBy}`);
      notes = await this.appService.getNotesAwaitingRatingBy(
        network,
        awaitingRatingBy,
        from,
      );
    } else {
      console.log(`Get all notes`);
      notes = await this.appService.getAllNotesFrom(network, from);
    }

    // final generic QueryParam
    // let's go live <3
    return onlyUseful
      ? { notes: this.appService.filterUsefulNotes(notes) }
      : { notes };
  }

  @Get("/x/note/id")
  @UseGuards(ThrottlerGuard)
  async getXNoteID(
    @Query("noteUrl") noteUrl: string,
    @Headers() headers: Record<string, any>,
  ): Promise<XSignedNoteIDResponse> {
    const network = getNetworkConfig(headers["Network"]);
    console.log(`Get factchain ID for X note URL ${noteUrl}`);
    const res = await this.appService.getXNoteID(network, noteUrl);
    return res;
  }

  @Post("/x/note")
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 1000 } })
  async createXNoteMetadata(
    @Body("noteUrl") noteUrl: string,
    @Body("content") content: string,
    @Headers() headers: Record<string, any>,
  ): Promise<XSignedNoteIDResponse> {
    const network = getNetworkConfig(headers["Network"]);
    const res = await this.appService.createXNoteMetadata(
      network,
      noteUrl,
      content,
    );
    console.log(
      `Create metadata for X note URL ${noteUrl}, Factchain ID ${res.id}`,
    );
    return res;
  }
}
