import { Injectable, NotFoundException } from "@nestjs/common";
import { Note } from "./factchain-core/types";
import { FactChainBackend } from "./factchain-core/web3";
import { NoteService } from "./factchain-core/noteService";
import { config } from "./factchain-core/env";

@Injectable()
export class AppService {
  getHello(): string {
    return "OK";
  }

  getVersion(): string {
    return "0.1.0";
  }

  async getNotes(postUrl: string): Promise<Array<Note>> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    const notes = await ns.getNotes(postUrl);
    return notes;
  }

  async getXNoteID(noteUrl: string): Promise<number> {
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

  async createXNoteMetadata(noteUrl: string, content: string): Promise<number> {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    return await ns.createXNoteMetadata(noteUrl, content);
  }
}
