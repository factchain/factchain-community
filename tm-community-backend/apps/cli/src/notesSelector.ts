import { provider, getEvents } from "./commands";

type Rating = {
  url: string;
  creator: string;
  value: number;
};

export const getEligibleRatings = async (): Promise<Array<Rating>> => {
  const currentBlockNumber = await provider.getBlockNumber();
  const events = await getEvents("NoteRated", 5000, currentBlockNumber);
  const oldEnoughRatings = events.map((event) => ({
    url: event.args[0],
    creator: event.args[1],
    value: event.args[3],
  }));
  return oldEnoughRatings;
};

export type Note = {
  url: string;
  creator: string;
  ratings: Array<number>;
};

export const getEligibleNotesFromRatings = (
  oldEnoughRatings: Array<Rating>,
  minimumRatingsPerNote: number,
): Array<Note> => {
  const noteRatingsMap: Record<string, Note> = {};
  for (const rating of oldEnoughRatings) {
    const key = `${rating.url}-${rating.creator}`;
    if (!noteRatingsMap[key]) {
      noteRatingsMap[key] = {
        url: rating.url,
        creator: rating.creator,
        ratings: [],
      };
    }
    noteRatingsMap[key].ratings.push(rating.value);
  }
  const eligibleNotes = Object.values(noteRatingsMap).filter(
    (note) => note.ratings.length >= minimumRatingsPerNote,
  );
  return eligibleNotes;
};
