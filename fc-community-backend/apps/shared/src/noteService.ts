import { Note, NoteReader, NoteWriter, Rating, Config } from "./types";
import { config } from "./env";
import { sanitizeXUrl } from "./utils";

export class NoteService {
  reader: NoteReader;
  writer: NoteWriter;
  config: Config;

  constructor(r: NoteReader, w?: NoteWriter) {
    this.reader = r;
    this.writer = w;
    this.config = config;
  }

  static inferNotesFromRatings = (ratings: Array<Rating>): Array<Note> => {
    // pure function to infer "light notes" from ratings.
    // useful before notes finalisation to gather ratings.

    const noteRatingsMap: Record<string, Note> = {};
    for (const rating of ratings) {
      const key = `${rating.postUrl}-${rating.noteCreatorAddress}`;
      if (!noteRatingsMap[key]) {
        noteRatingsMap[key] = {
          postUrl: rating.postUrl,
          creatorAddress: rating.noteCreatorAddress,
          ratings: [],
        };
      }
      noteRatingsMap[key].ratings!.push(rating.value);
    }
    return Object.values(noteRatingsMap);
  };

  static getEligibleNotesFromRatings = (
    oldEnoughRatings: Array<Rating>,
    minimumRatingsPerNote: number,
  ): Array<Note> => {
    const notes = NoteService.inferNotesFromRatings(oldEnoughRatings);
    const eligibleNotes = notes.filter(
      (note) => note.ratings!.length >= minimumRatingsPerNote,
    );
    return eligibleNotes;
  };

  getNotesToFinalise = async (
    lookBackDays: number,
    minimumRatingsPerNote: number,
  ): Promise<Array<Note>> => {
    // get all ratings of FactChainCommunity within the given time period
    const eligibleRatings = await this.reader.getRatings(lookBackDays);
    // map ratings to note and filter out note below `minimumRatingsPerNote`
    const eligibleNotes = NoteService.getEligibleNotesFromRatings(
      eligibleRatings,
      minimumRatingsPerNote,
    );
    // read FactChainCommunity to get note's finalRating for all eligible notes
    // and to get note's content for the NFT generation
    const eligibleNotesWithFinalRating = await Promise.all(
      eligibleNotes.map(async (note) => {
        const noteWithFinalRating = await this.getNote(
          note.postUrl,
          note.creatorAddress,
        );
        return {
          ...noteWithFinalRating,
          ratings: note.ratings!,
        };
      }),
    );
    // filter out already finalised notes
    const notesToFinalise = eligibleNotesWithFinalRating.filter(
      (note) => !note.finalRating,
    );
    return notesToFinalise;
  };

  getNotesAwaitingRatingBy = async (
    predicate: (postUrl: string, creator: string) => boolean,
    byAddress: string,
    paramLookBackDays = 0,
  ): Promise<Note[]> => {
    const lookBackDays =
      paramLookBackDays || parseInt(this.config.LOOKBACK_DAYS);
    console.log(`Getting notes awaiting rating by ${byAddress} over the last ${lookBackDays} days`);
    const notes = await this.reader.getNotes(predicate, lookBackDays);
    // factchainer can't rate their own note
    const othersNotes = notes.filter(
      (note) => note.creatorAddress.toLowerCase() != byAddress.toLowerCase(),
    );
    console.log(`Getting ratings for ${othersNotes.length} notes`);
    // factchainer can rate the same note only once
    // and can't rate finalised notes
    const awaitingRatingBy = await Promise.all(
      othersNotes.map(async (note) => {
        const rating = await this.reader.getRating(
          note.postUrl,
          note.creatorAddress,
          byAddress,
        );
        if (!rating.value && !note.finalRating) {
          return note;
        }
        return null;
      }),
    );
    return awaitingRatingBy.filter((note) => note !== null) as Note[];
  };

  getNote = async (noteUrl: string, creator: string) => {
    return await this.reader.getNote(sanitizeXUrl(noteUrl), creator);
  };

  getNotes = async (
    predicate: (postUrl: string, creator: string) => boolean,
    paramLookBackDays = 0,
  ): Promise<Array<Note>> => {
    const lookBackDays =
      paramLookBackDays || parseInt(this.config.LOOKBACK_DAYS);
    const notes = await this.reader.getNotes(predicate, lookBackDays);
    return notes;
  };

  mintNote = async (postUrl: string, creator: string) => {
    const note = await this.reader.getNote(postUrl, creator);

    if (note.finalRating! == 0)
      throw new Error("mint failed: note isn't finalised!");

    return await this.writer.mintNote721({
      postUrl: postUrl,
      creatorAddress: creator,
      content: note.content,
    });
  };

  //Throw if doesn't exist
  getXNoteID = async (noteUrl: string) => {
    return await this.reader.getXNoteID({ url: sanitizeXUrl(noteUrl) });
  };

  createXNoteMetadata = async (noteUrl: string, content: string) => {
    return await this.writer.createXNoteMetadata({
      url: sanitizeXUrl(noteUrl),
      content: content,
    });
  };
}
