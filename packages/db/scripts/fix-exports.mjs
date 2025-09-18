import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const files = ['index.js', 'index.d.ts'];
const pattern = /(['"])\.\/enums\1/g;

for (const file of files) {
  const filePath = resolve('dist', file);
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Skipping ${file} because it could not be read:`, error.message);
    continue;
  }

  const updated = content.replace(pattern, (_match, quote) => `${quote}./enums.js${quote}`);

  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf8');
  }
}
