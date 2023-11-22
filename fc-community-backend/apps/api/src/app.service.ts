import { Injectable } from "@nestjs/common";

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
}
