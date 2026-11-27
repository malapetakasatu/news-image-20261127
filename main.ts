import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Entrypoint for makefun competition entry: news-image-20261127
 * Theme: Friday 27 November 2026 world news broadsheet.
 * Copies verified entry.png to MAKEFUN_OUTPUT_DIR ?? '/output'.
 */
async function run(): Promise<void> {
  const baseDir = import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);
  const sourcePath = path.resolve(baseDir, 'entry.png');
  const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const targetPath = path.resolve(targetDir, 'entry.png');

  console.log(`[makefun] Validating source image at: ${sourcePath}`);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source image not found: ${sourcePath}`);
  }

  const stat = fs.statSync(sourcePath);
  console.log(`[makefun] Source image confirmed present: ${stat.size} bytes`);

  // Extra verification: enforce gate limit of <= 1 MiB (1,048,576 bytes)
  const MAX_ALLOWED_BYTES = 1048576;
  if (stat.size <= 0) {
    throw new Error(`Source image is empty (0 bytes).`);
  }
  if (stat.size > MAX_ALLOWED_BYTES) {
    throw new Error(`Source image exceeds 1 MiB limit: ${stat.size} bytes > ${MAX_ALLOWED_BYTES} bytes`);
  }
  console.log(`[makefun] Size verification passed: ${stat.size} bytes <= ${MAX_ALLOWED_BYTES} bytes`);

  console.log(`[makefun] Preparing destination directory: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });

  console.log(`[makefun] Copying ${sourcePath} -> ${targetPath}`);
  fs.copyFileSync(sourcePath, targetPath);

  console.log(`[makefun] Verified copied file successfully: ${targetPath}`);
}

run().catch((error: unknown) => {
  console.error('[makefun] Execution error:', error);
  process.exit(1);
});
