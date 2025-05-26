import { deflate, inflate } from "zlib";
import { promisify } from "util";

const asyncDeflate = promisify(deflate);
const asyncInflate = promisify(inflate);

export async function compressDecompressCode(code: string) {
  const input = Buffer.from(code);

  try {
    const compressCode = await asyncDeflate(input);

    const decompressCode = await asyncInflate(compressCode);

    return { compressCode, decompressCode };
  } catch (error) {
    console.log("error occurred while compressing code", error);
  }
}
