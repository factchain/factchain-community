import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { keccak256 } from "ethers";

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
  const urlb = new TextEncoder().encode(url);
  return parseInt(keccak256(urlb).substring(2, 10), 16);
}
