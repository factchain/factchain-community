import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ContractAddresses,
  Note,
  XSignedNoteIDResponse,
} from "./factchain-core/types";
import { FactChainBackend } from "./factchain-core/web3";
import { NoteService } from "./factchain-core/noteService";
import { config } from "./factchain-core/env";

import { sanitizeXUrl } from "./factchain-core/utils";

@Injectable()
export class AppService {
  getHello(): string {
    return "OK";
  }

  getVersion(): string {
    return "0.1.0";
  }

  getContracts(): ContractAddresses {
    return {
      main: config.MAIN_CONTRACT_ADDRESS,
      nft: config.NFT_CONTRACT_ADDRESS,
      sft: config.SFT_CONTRACT_ADDRESS,
      x: config.X_CONTRACT_ADDRESS,
    };
  }

  filterUsefulNotes(notes: Array<Note>): Array<Note> {
    return notes.filter(
      (note) => note.finalRating! >= parseInt(config.USEFUL_NOTE_THRESHOLD),
    );
  }

  async getNotesByPost(postUrl: string, from: number): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);

    const sanitizedPostUrl = sanitizeXUrl(postUrl);
    const notes = await ns.getNotes(
      (_postUrl, _) => _postUrl === sanitizedPostUrl,
      from,
    );
    return notes;
  }

  async getAllNotesFrom(from: number): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    const notes = await ns.getNotes((_postUrl, _creator) => true, from);
    return notes;
  }

  async getNotesByCreator(creator: string, from: number): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    // TODO: only push lowered address to contract
    // and remove the conversion here
    const notes = await ns.getNotes(
      (_, _creator) => _creator.toLowerCase() === creator.toLowerCase(),
      from,
    );
    return notes;
  }

  async getNotesAwaitingRatingBy(
    rater: string,
    from: number,
  ): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    const notes = await ns.getNotesAwaitingRatingBy(
      (_postUrl, _creator) => true,
      rater,
      from,
    );
    return notes;
  }

  async getNotesAwaitingRatingByOnGivenPost(
    postUrl: string,
    rater: string,
    from: number,
  ): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);

    const sanitizedPostUrl = sanitizeXUrl(postUrl);
    const notes = await ns.getNotesAwaitingRatingBy(
      (_postUrl, _) => _postUrl == sanitizedPostUrl,
      rater,
      from,
    );
    return notes;
  }

  async getXNoteID(noteUrl: string): Promise<XSignedNoteIDResponse> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
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
    noteUrl: string,
    content: string,
  ): Promise<XSignedNoteIDResponse> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    return await ns.createXNoteMetadata(noteUrl, content);
  }
}
