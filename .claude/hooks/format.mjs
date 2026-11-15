// PostToolUse hook: run Prettier on the file Claude just edited or wrote.
// Claude Code sends the tool call as JSON on stdin; the path is tool_input.file_path.
// Exit 0 = fine. Any other non-2 exit only shows an error and does not block.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FORMATTABLE = new Set(['.js', '.jsx', '.mjs', '.json', '.css']);

let input = '';
for await (const chunk of process.stdin) input += chunk;

let file;
try {
  file = JSON.parse(input).tool_input?.file_path;
} catch {
  process.exit(0);
}

if (!file || !FORMATTABLE.has(path.extname(file)) || !existsSync(file)) process.exit(0);

const prettier = path.join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
execFileSync(process.execPath, [prettier, '--write', '--ignore-unknown', file], { cwd: root, stdio: 'inherit' });
