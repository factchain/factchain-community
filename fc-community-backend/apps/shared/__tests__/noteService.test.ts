import { Rating, Note } from "../src/types"; // Update the path to your module

import { NoteService } from "../src/noteService";
import { describe, it, expect } from "@jest/globals";

describe("getEligibleNotesFromRatings", () => {
  // what makes a note unique is postUrl + creator
  const ratings: Rating[] = [
    {
      postUrl: "postUrl1",
      noteCreatorAddress: "creator1",
      raterAddress: "rater",
      value: 4,
    },
    {
      postUrl: "postUrl1",
      noteCreatorAddress: "creator1",
      raterAddress: "rater",
      value: 5,
    },
    {
      postUrl: "postUrl1",
      noteCreatorAddress: "creator1",
      raterAddress: "rater",
      value: 6,
    },
    {
      postUrl: "postUrl1",
      noteCreatorAddress: "creator1",
      raterAddress: "rater",
      value: 7,
    },
    {
      postUrl: "postUrl1",
      noteCreatorAddress: "creator2",
      raterAddress: "rater",
      value: 5,
    },
    {
      postUrl: "postUrl2",
      noteCreatorAddress: "creator1",
      raterAddress: "rater",
      value: 3,
    },
  ];

  it("should filter eligible notes based on minimum ratings", () => {
    const minimumRatingsPerNote = 2;
    const expectedEligibleNotes: Note[] = [
      {
        postUrl: "postUrl1",
        creatorAddress: "creator1",
        ratings: [4, 5, 6, 7],
      },
    ];
    const result = NoteService.getEligibleNotesFromRatings(
      ratings,
      minimumRatingsPerNote,
    );
    expect(result).toEqual(expectedEligibleNotes);
  });

  it("should handle notes with one rating", () => {
    const minimumRatingsPerNote = 1;
    const ratingsWithEmptyNotes: Rating[] = [
      {
        postUrl: "postUrl3",
        noteCreatorAddress: "creator3",
        raterAddress: "salut",
        value: 5,
      },
    ];

    const expectedEligibleNotes: Note[] = [
      { postUrl: "postUrl3", creatorAddress: "creator3", ratings: [5] },
    ];

    const result = NoteService.getEligibleNotesFromRatings(
      ratingsWithEmptyNotes,
      minimumRatingsPerNote,
    );
    expect(result).toEqual(expectedEligibleNotes);
  });

  it("should handle edge case with no eligible notes", () => {
    const minimumRatingsPerNote = 5;
    const expectedEligibleNotes: Note[] = [];

    const result = NoteService.getEligibleNotesFromRatings(
      ratings,
      minimumRatingsPerNote,
    );
    expect(result).toEqual(expectedEligibleNotes);
  });
});
