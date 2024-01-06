import { Note, NoteReader, NoteWriter, Rating, Config } from "./types";
import { config } from "./env";

export class NoteService {
  reader: NoteReader;
  writer: NoteWriter;
  config: Config;

  constructor(r: NoteReader, w: NoteWriter) {
    this.reader = r;
    this.writer = w;
    this.config = config;
  }

  static getEligibleNotesFromRatings = (
    oldEnoughRatings: Array<Rating>,
    minimumRatingsPerNote: number,
  ): Array<Note> => {
    const noteRatingsMap: Record<string, Note> = {};
    for (const rating of oldEnoughRatings) {
      const key = `${rating.postUrl}-${rating.creator}`;
      if (!noteRatingsMap[key]) {
        noteRatingsMap[key] = {
          postUrl: rating.postUrl,
          creator: rating.creator,
          ratings: [],
        };
      }
      noteRatingsMap[key].ratings!.push(rating.value);
    }
    const eligibleNotes = Object.values(noteRatingsMap).filter(
      (note) => note.ratings!.length >= minimumRatingsPerNote,
    );
    return eligibleNotes;
  };

  getNotesToFinalise = async (
    from: Date,
    to: Date,
    minimumRatingsPerNote: number,
  ): Promise<Array<Note>> => {
    // get all ratings of FactChainCommunity within the given time period
    const eligibleRatings = await this.reader.getRatings(from, to);
    // map ratings to note and filter out note below `minimumRatingsPerNote`
    const eligibleNotes = NoteService.getEligibleNotesFromRatings(
      eligibleRatings,
      minimumRatingsPerNote,
    );
    // read FactChainCommunity to get note's finalRating for all eligible notes
    const eligibleNotesWithFinalRating = await Promise.all(
      eligibleNotes.map(async (note) => {
        const noteWithFinalRating = await this.getNote(note.postUrl, note.creator);
        return {
          ...noteWithFinalRating,
          ratings: note.ratings!,
        }
      })
    );
    // filter out already finalised notes
    const notesToFinalise = eligibleNotesWithFinalRating.filter((note) => !note.finalRating);
    return notesToFinalise;
  };

  getNotes = async (
    predicate: (postUrl: string, creator: string) => boolean,
    paramLookBackDays = 0,
  ): Promise<Array<Note>> => {
    const configLookBackDays = parseInt(this.config.LOOKBACK_DAYS);
    const lookBackDays = paramLookBackDays || configLookBackDays;
    const notes = await this.reader.getNotes(predicate, lookBackDays);
    return notes;
  };

  mintNote = async (postUrl: string, creator: string) => {
    const note = await this.reader.getNote(postUrl, creator);

    if (note.finalRating! == 0)
      throw new Error("mint failed: note isn't finalised!");

    return await this.writer.mintNote721({
      postUrl: postUrl,
      creator: creator,
      content: note.content,
    });
  };

  getNote = async (noteUrl: string, creator: string) => {
    const XUrl = noteUrl.replace("twitter", "x");
    return await this.reader.getNote(XUrl, creator);
  };

  //Throw if doesn't exist
  getXNoteID = async (noteUrl: string) => {
    const XUrl = noteUrl.replace("twitter", "x");
    return await this.reader.getXNoteID({ url: XUrl });
  };

  createXNoteMetadata = async (noteUrl: string, content: string) => {
    const XUrl = noteUrl.replace("twitter", "x");
    return await this.writer.createXNoteMetadata({
      url: XUrl,
      content: content,
    });
  };
}
