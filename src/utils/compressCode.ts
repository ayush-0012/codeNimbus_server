import { deflate, inflate } from "zlib";
import { promisify } from "util";

const asyncDeflate = promisify(deflate); //for compressing
const asyncInflate = promisify(inflate); //for decompressing

export async function compressCode(code: string) {
  const input = Buffer.from(code);

  try {
    const compressCode = await asyncDeflate(input);

    return compressCode;
  } catch (error) {
    console.log("error occurred while compressing code", error);
  }
}

export async function decompressCode(compressCode: Buffer) {
  try {
    const decompressCode = await asyncInflate(compressCode);

    return decompressCode.toString();
  } catch (error) {
    console.log("error occurred while decompressing code", error);
  }
}
