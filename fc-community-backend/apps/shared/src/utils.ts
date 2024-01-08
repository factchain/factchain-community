import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { ethers, keccak256, getBytes } from "ethers";

export function timePeriodToBlockPeriods(
  from: Date,
  to: Date,
  currentBlock: number,
): Array<[number, number]> {
  // Ethereum block production time in milliseconds
  const ethAvgBlockTime = 12 * 1_000;
  // https://support.quicknode.com/hc/en-us/articles/10258449939473-Understanding-the-10-000-Block-Range-Limit-for-querying-Logs-and-Events
  const maxPeriodLength = 10_000;

  if (from > to) {
    const temp = from;
    from = to;
    to = temp;
  }

  const currentDate = new Date();
  const fromBlock =
    currentBlock -
    Math.floor((currentDate.getTime() - from.getTime()) / ethAvgBlockTime);
  const toBlock =
    currentBlock -
    Math.ceil((currentDate.getTime() - to.getTime()) / ethAvgBlockTime);
  const numberOfPeriods = Math.ceil((toBlock - fromBlock) / maxPeriodLength);

  return [...Array(numberOfPeriods).keys()].map((i) => {
    return [
      fromBlock + i * maxPeriodLength,
      Math.min(fromBlock + (i + 1) * maxPeriodLength, toBlock),
    ];
  });
}

export async function S3fileExists(
  client: S3Client,
  AWSBucket: string,
  key: string,
): Promise<boolean> {
  const params = {
    Bucket: AWSBucket,
    Key: key,
  };

  try {
    const command = new HeadObjectCommand(params);
    const response = await client.send(command);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "NotFound") {
      return false;
    } else {
      console.error("Error checking file existence in S3:", error);
      throw error;
    }
  }
}

export function makeS3Path(
  AWSBucket: string,
  AWSRegion: string,
  key: string,
): string {
  return `https://${AWSBucket}.s3.${AWSRegion}.amazonaws.com/${key}`;
}

export function urlToID(url: string): number {
  const textEncoder = new TextEncoder();
  const urlb = textEncoder.encode(url);
  return parseInt(keccak256(urlb).substring(2, 10), 16);
}

export function toEip191(id: number) {
  const idBuffer = Buffer.from(id.toString(), "utf-8");
  const idHash = keccak256(idBuffer).replace("0x", "");
  const prefix = Buffer.from("\x19Ethereum Signed Message:\n32");
  const messageBuffer = Buffer.concat([prefix, Buffer.from(idHash, "hex")]);
  // don't strip `0x` because getBytes from ethers needs the hex prefix
  const preparedMessage = keccak256(messageBuffer);
  return {
    idHash,
    preparedMessage,
  };
}

export async function getNoteSignature(id: number, signer: ethers.Wallet) {
  const eip191 = toEip191(id);
  const signature = await signer.signingKey.sign(
    getBytes(eip191["preparedMessage"]),
  ).serialized;
  return {
    hash: eip191["idHash"],
    signature: signature,
  };
}

export const sanitizeXUrl = (url: string) =>
  typeof url === "string"
    ? url.replace(/^(http(s)?):\/\/twitter.com/, "$1://x.com")
    : url;
