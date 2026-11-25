// One Line, One Laugh — entry program (program/v1, node22 stdlib).
// Reads the joke from one-line.txt, validates it against the bounty caps,
// and writes it to /output/entry.txt for the sealed gate scorer.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Bounty cap for this competition: 1 to 140 characters (see competition.yaml).
const CAP = 140;

function fail(reason: string): never {
  console.error(`FAIL: ${reason}`);
  process.exit(1);
}

const text = readFileSync(new URL("./one-line.txt", import.meta.url), "utf8")
  .replace(/\r\n?/g, "\n")
  .replace(/\n$/, "");
const chars = [...text];

if (chars.length === 0) fail("the line is empty");
if (chars.length > CAP) fail(`line is ${chars.length} characters, cap is ${CAP}`);
if (text.trim() !== text) fail("leading or trailing whitespace");
if (text.includes("\n")) fail("more than one line");
// The gate scorer reads entry.txt as UTF-8 text; control characters would
// corrupt it, so reject them before writing.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(text)) fail("control character in the line");
if (!/[.!?]$/.test(text)) fail("line must end with . ! or ?");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), `${text}\n`);
console.log(text);
console.log(`OK: ${chars.length}/${CAP} chars written to ${join(outDir, "entry.txt")}`);
