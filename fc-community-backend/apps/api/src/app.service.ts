import { Injectable, NotFoundException } from "@nestjs/common";
import { Note, XSignedNoteIDResponse } from "./factchain-core/types";
import { FactChainBackend } from "./factchain-core/web3";
import { NoteService } from "./factchain-core/noteService";
import { config } from "./factchain-core/env";

import { EventLog } from "ethers";

@Injectable()
export class AppService {
  getHello(): string {
    return "OK";
  }

  getVersion(): string {
    return "0.1.0";
  }

  async getNotesByPost(postUrl: string): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    const notes = await ns.getNotes((note: Note) => note.postUrl === postUrl);
    return notes;
  }

  async getAllNotesFrom(from: number): Promise<Array<Note>> {
    // Basic QuickNote Plan support 12 max lookback days
    if (!(from > 0 && from < 13)) {
      throw Error(
        `invalid lookbackdays: ${from} should be positive and less than 13`,
      );
    }
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    const notes = await ns.getNotes((note: Note) => note === note, from);
    return notes;
  }

  async getNotesByCreator(creator: string): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    const notes = await ns.getNotes((note: Note) => note.creator === creator);
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
