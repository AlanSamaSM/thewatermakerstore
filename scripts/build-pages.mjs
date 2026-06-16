import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

execFileSync(
  'bunx',
  [
    '--package',
    'esbuild',
    './app.jsx',
    '--bundle',
    '--outfile=./app.js',
    '--target=es2018',
    '--format=iife',
    '--minify',
    '--jsx-factory=React.createElement',
    '--jsx-fragment=React.Fragment',
    '--legal-comments=none',
  ],
  { cwd: root, stdio: 'inherit' },
);

for (const entry of ['index.html', 'app.js', 'admin', 'content', 'uploads']) {
  await cp(join(root, entry), join(dist, entry), { recursive: true });
}
