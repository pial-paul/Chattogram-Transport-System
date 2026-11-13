import { copyFile, mkdir, readdir } from 'node:fs/promises';

const files = ['index.html', 'styles.css', 'transit-data.js', 'planner.js', 'script.js', 'sw.js'];
const output = new URL('./dist/', import.meta.url);

await mkdir(output, { recursive: true });
const unexpected = (await readdir(output)).filter((file) => !files.includes(file));
if (unexpected.length) {
  throw new Error(`The build folder contains extra files: ${unexpected.join(', ')}. Move them before building.`);
}

await Promise.all(files.map((file) => copyFile(new URL(file, import.meta.url), new URL(file, output))));
console.log(`Built ${files.length} files in dist/.`);
