import axios from "axios";
import FormData from "form-data";
import Replicate from "replicate";
import { Note } from "./types";

import { randomUUID } from "crypto";

const generateNoteImage = async (note: Note, count = 0): Promise<string> => {

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const replicateUrlObj = await replicate.run(
      // replicate identifier of the AI model to run
      "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
      {
        input: {
          width: 768,
          height: 768,
          prompt: note.content,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 25,
        },
      },
    );

    const replicateUrl = (replicateUrlObj as string[])[0];
    console.log(`replicate URL: ${replicateUrl}`);
    return replicateUrl;
  } catch (error) {
    // retry twice if the note generated NSFW image
    // experimentally, chance of success are close to zero after two failures for NSFW content
    if (
      error instanceof Error &&
      error.message.includes("NSFW") &&
      count < 3
    ) {
      return generateNoteImage(note, count + 1);
    } else {
      throw error;
    }
  }
};

const uploadImageToPinata = async (
  replicateUrl: string,
  noteUID: string
): Promise<string> => {
  const imageStream = (
    await axios.get(replicateUrl, { responseType: "stream" })
  ).data;
  const data = new FormData();
  data.append("file", imageStream, {
    filepath: `${noteUID}.png`, // required by the Pinata API
  });
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      },
    );
    console.log(res.data);
    return res.data["IpfsHash"];
  } catch (error) {
    throw new Error("Pinata: fails to pin file to IPFS");
  }
};


const uploadMetadataToPinata = async (
  note: Note,
  noteUID: string,
  CID: string,
): Promise<string> => {

  try {
    const noteNFTMetadata = JSON.stringify({
      pinataContent: {
        name: `${note.postUrl}`,
        description: `${note.content}`,
        external_url: "https://gateway.pinata.cloud/ipfs/",
        image: `ipfs://${CID}`,
      },
      pinataMetadata: {
        name: `Note-${noteUID}-Metadata`,
      },
    });

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      noteNFTMetadata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    )
    console.log("Metadata uploaded, CID:", res.data);
    return res.data["IpfsHash"];
  } catch (error) {
    console.log(error);
    throw new Error("Pinata: fails to pin file metadata to IPFS");
  }
};

export const createNFTDataFromNote = async (note: Note): Promise<string> => {
  if (!note.content) {
    throw new Error("Can't generate image from empty note!");
  }

  const replicateUrl = await generateNoteImage(note);
  const noteUID = randomUUID();
  const pinataImageCID = await uploadImageToPinata(replicateUrl, noteUID);
  const pinataMetadataCID = await uploadMetadataToPinata(
    note,
    noteUID,
    pinataImageCID
  );
  return pinataMetadataCID;
};