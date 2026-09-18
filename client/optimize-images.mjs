// optimize-images.mjs
// Run: node optimize-images.mjs
// Requires: npm install sharp --save-dev
//
// Writes optimized images to public/assets-optimized/ (mirroring the
// original folder structure) instead of overwriting originals in place.
// This avoids Windows permission issues (e.g. Controlled Folder Access)
// that can block a script from modifying already-existing files.
//
// After running, manually swap the folders in File Explorer:
//   1. Rename public/assets       -> public/assets-old
//   2. Rename public/assets-optimized -> public/assets
//   3. Once you've confirmed everything loads fine, delete assets-old

import sharp from "sharp";
import { readdirSync, statSync, mkdirSync } from "fs";
import path from "path";

const OUTPUT_ROOT = "public/assets-optimized";

// Map source folder -> target display width/height (px) and quality
// Bump width ~1.5-2x the CSS display size to cover retina screens
const CONFIG = {
  // Hero carousel — full-bleed, h-87.5 (350px tall)
  "public/assets/crousal": { width: 2400, height: 700, quality: 78 },
  // CardHome default (h-48, grid-cols-6) — ~183x192 on screen, exported @2x
  "public/assets/Phones": { width: 400, height: 420, quality: 75 },
  "public/assets/Trending-Outfits": { width: 400, height: 420, quality: 75 },
  "public/assets/Books": { width: 400, height: 420, quality: 75 }, // consider object-cover in JSX too
  "public/assets/Populars": { width: 400, height: 420, quality: 75 },
  // CardHome h-34 (grid-cols-4 > grid-cols-2) — ~132x136 on screen, exported @2x
  "public/assets/Toys": { width: 280, height: 280, quality: 75 },
  "public/assets/Travel": { width: 280, height: 280, quality: 75 },
  "public/assets/College": { width: 280, height: 280, quality: 75 },
  "public/assets/Beauty": { width: 280, height: 280, quality: 75 },
};

const STANDALONE_FILES = [
  {
    input: "public/assets/summersale.jpg",
    output: path.join(OUTPUT_ROOT, "summersale.webp"), // update <img src> in Home.jsx afterward
    width: 2320,
    height: 600,
    quality: 78,
  },
];

const failures = [];

for (const [dir, opts] of Object.entries(CONFIG)) {
  if (!statSync(dir, { throwIfNoEntry: false })) continue;

  const outDir = path.join(OUTPUT_ROOT, path.basename(dir));
  mkdirSync(outDir, { recursive: true });

  const files = readdirSync(dir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(outDir, file);
    try {
      const before = statSync(inputPath).size;

      const buffer = await sharp(inputPath)
        .resize({
          width: opts.width,
          height: opts.height, // omit for aspect-ratio-preserving resize
          fit: opts.height ? "cover" : "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: opts.quality })
        .toBuffer();

      await sharp(buffer).toFile(outputPath); // brand-new file, no overwrite involved

      const after = buffer.length;
      console.log(
        `${outputPath}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`
      );
    } catch (err) {
      console.error(`FAILED: ${inputPath} — ${err.code || err.message}`);
      failures.push(inputPath);
    }
  }
}

// Standalone files (e.g. the summer sale banner)
for (const item of STANDALONE_FILES) {
  if (!statSync(item.input, { throwIfNoEntry: false })) continue;
  try {
    const before = statSync(item.input).size;

    const buffer = await sharp(item.input)
      .resize({
        width: item.width,
        height: item.height,
        fit: "cover",
        withoutEnlargement: true,
      })
      .webp({ quality: item.quality })
      .toBuffer();

    await sharp(buffer).toFile(item.output);
    const after = buffer.length;
    console.log(
      `${item.input} -> ${item.output}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`
    );
  } catch (err) {
    console.error(`FAILED: ${item.input} — ${err.code || err.message}`);
    failures.push(item.input);
  }
}

if (failures.length) {
  console.log(`\n${failures.length} file(s) failed:`);
  failures.forEach(f => console.log(`  - ${f}`));
} else {
  console.log(`\nAll files processed successfully into ${OUTPUT_ROOT}/`);
  console.log("Next: rename public/assets -> public/assets-old, then public/assets-optimized -> public/assets");
}
