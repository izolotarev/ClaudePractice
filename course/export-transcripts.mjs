import fs from 'node:fs';
import path from 'node:path';

const [srcDir, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

// Replace personal data so transcripts are safe to commit. Add your own patterns here.
const redact = (s) =>
  s
    // Emails, including grep-style escaped ones such as name@host\\.com, and partial ones such as name@host\\|
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\\*\.[A-Za-z0-9-]+)+/g, 'user@example.com')
    .replace(/[A-Za-z0-9._%+-]+@(?:hotmail|gmail|outlook|yahoo)\b/gi, 'user@example')
    // Fragments cut off by clip(), such as name@h at the end of a truncated command
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z]{1,3}(?![A-Za-z0-9.-])/g, 'user@example')
    .replace(/Users([\\/]+)Igor/g, 'Users$1USER');

const clip = (s, n) => (s.length > n ? s.slice(0, n) + `\n… [truncated ${s.length - n} chars]` : s);
const txt = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map((x) => x.text ?? '').join('\n') : '');

const sessions = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith('.jsonl'))
  .map((f) => {
    const lines = fs
      .readFileSync(path.join(srcDir, f), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l));
    const first = lines.find((l) => l.timestamp)?.timestamp ?? '';
    return { f, lines, first };
  })
  .sort((a, b) => a.first.localeCompare(b.first));

sessions.forEach((s, i) => {
  const out = [`# Session ${i + 1}`, `Source: ${s.f}`, `Started: ${s.first}`, ''];
  for (const l of s.lines) {
    if (l.type !== 'user' && l.type !== 'assistant') continue;
    const c = l.message?.content;
    const parts = typeof c === 'string' ? [{ type: 'text', text: c }] : (c ?? []);
    for (const p of parts) {
      if (p.type === 'text') {
        let t = p.text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim();
        if (!t) continue;
        out.push(`## ${l.type === 'user' ? 'You' : 'Claude'}`, '', clip(t, 6000), '');
      } else if (p.type === 'tool_use') {
        out.push(`> **Tool:** ${p.name} ${clip(JSON.stringify(p.input), 400)}`, '');
      } else if (p.type === 'tool_result') {
        const t = txt(p.content)
          .replace(/\x1b\[[0-9;]*m/g, '')
          .trim();
        out.push('> Result:', '```', clip(t, 800), '```', '');
      }
    }
  }
  const name = `session-${i + 1}.md`;
  fs.writeFileSync(path.join(outDir, name), redact(out.join('\n')));
  console.log(name, s.first, out.length, 'blocks');
});
