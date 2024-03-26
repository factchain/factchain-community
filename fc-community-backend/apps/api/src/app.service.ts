import { Injectable, NotFoundException } from "@nestjs/common";
import { Note, XSignedNoteIDResponse } from "./factchain-core/types";

import { DBConnector } from "./factchain-core/web2";
import { NoteService } from "./factchain-core/noteService";
import { config } from "./factchain-core/env";

import { sanitizeXUrl } from "./factchain-core/utils";
import { NetworkConfig } from "./factchain-core/networks/config";
import { BlockchainConnector } from "./factchain-core/web3";

@Injectable()
export class AppService {
  getHello(): string {
    return "OK";
  }

  getVersion(): string {
    return "0.1.0";
  }

  filterUsefulNotes(notes: Array<Note>): Array<Note> {
    return notes.filter(
      (note) => note.finalRating! >= parseInt(config.USEFUL_NOTE_THRESHOLD),
    );
  }

  async getNotesByPost(
    network: NetworkConfig,
    postUrl: string,
    from: number,
  ): Promise<Array<Note>> {
    const reader = new DBConnector(config, network);
    const ns = new NoteService(reader);

    const sanitizedPostUrl = sanitizeXUrl(postUrl);
    const notes = await ns.getNotes(
      (_postUrl, _) => _postUrl === sanitizedPostUrl,
      from,
    );
    return notes;
  }

  async getAllNotesFrom(
    network: NetworkConfig,
    from: number,
  ): Promise<Array<Note>> {
    const reader = new DBConnector(config, network);
    const ns = new NoteService(reader);
    const notes = await ns.getNotes((_postUrl, _creator) => true, from);
    return notes;
  }

  async getNotesByCreator(
    network: NetworkConfig,
    creator: string,
    from: number,
  ): Promise<Array<Note>> {
    const reader = new DBConnector(config, network);
    const ns = new NoteService(reader);
    // TODO: only push lowered address to contract
    // and remove the conversion here
    const notes = await ns.getNotes(
      (_, _creator) => _creator.toLowerCase() === creator.toLowerCase(),
      from,
    );
    return notes;
  }

  async getNotesAwaitingRatingBy(
    network: NetworkConfig,
    rater: string,
    from: number,
  ): Promise<Array<Note>> {
    const reader = new DBConnector(config, network);
    const ns = new NoteService(reader);
    const notes = await ns.getNotesAwaitingRatingBy(
      (_postUrl, _creator) => true,
      rater,
      from,
    );
    return notes;
  }

  async getNotesAwaitingRatingByOnGivenPost(
    network: NetworkConfig,
    postUrl: string,
    rater: string,
    from: number,
  ): Promise<Array<Note>> {
    const reader = new DBConnector(config, network);
    const ns = new NoteService(reader);
    const sanitizedPostUrl = sanitizeXUrl(postUrl);
    const notes = await ns.getNotesAwaitingRatingBy(
      (_postUrl, _) => _postUrl == sanitizedPostUrl,
      rater,
      from,
    );
    return notes;
  }

  async getXNoteID(
    network: NetworkConfig,
    noteUrl: string,
  ): Promise<XSignedNoteIDResponse> {
    const bc = new BlockchainConnector(config, network);
    const ns = new NoteService(bc, bc);
    try {
      return await ns.getXNoteID(noteUrl);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Not Found")) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async createXNoteMetadata(
    network: NetworkConfig,
    noteUrl: string,
    content: string,
  ): Promise<XSignedNoteIDResponse> {
    const bc = new BlockchainConnector(config, network);
    const ns = new NoteService(bc, bc);
    return await ns.createXNoteMetadata(noteUrl, content);
  }
}
