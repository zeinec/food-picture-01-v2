// Copy the submission image to the configured output folder and check its size.
import { copyFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const sourcePath = new URL("./entry.png", import.meta.url);
const sourceFile = "entry.png";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const destinationPath = join(outputDir, sourceFile);

let source;
try {
  source = await stat(sourcePath);
} catch (error) {
  if (error instanceof Error && "code" in error && error.code === "ENOENT") {
    throw new Error(`Source entry.png is missing: ${sourcePath.pathname}`);
  }
  throw error;
}

if (source.size === 0) {
  throw new Error(`Source entry.png is empty (0 bytes): ${sourcePath.pathname}`);
}

await mkdir(outputDir, { recursive: true });
await copyFile(sourcePath, destinationPath);

const destination = await stat(destinationPath);

if (destination.size !== source.size) {
  throw new Error(
    `Copied file size mismatch: source is ${source.size} bytes, destination is ${destination.size} bytes (${destinationPath})`,
  );
}

console.log(`${destinationPath} source ${source.size} bytes, destination ${destination.size} bytes`);
