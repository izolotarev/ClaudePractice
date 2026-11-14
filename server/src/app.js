import express from 'express';
import path from 'node:path';
import fs from 'node:fs';

const toTodo = (r) => ({ id: r.id, text: r.text, done: !!r.done, created_at: r.created_at });

export function createApp(db, { staticDir } = {}) {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/todos', (_req, res) => {
    res.json(db.prepare('SELECT * FROM todos ORDER BY id ASC').all().map(toTodo));
  });

  app.post('/api/todos', (req, res) => {
    const raw = req.body?.text;
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (!text || text.length > 200) return res.status(400).json({ error: 'text must be 1-200 characters' });
    const info = db.prepare('INSERT INTO todos (text, created_at) VALUES (?, ?)').run(text, new Date().toISOString());
    res.status(201).json(toTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(info.lastInsertRowid)));
  });

  app.patch('/api/todos/:id', (req, res) => {
    const done = req.body?.done;
    if (typeof done !== 'boolean') return res.status(400).json({ error: 'done must be a boolean' });
    const info = db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(done ? 1 : 0, req.params.id);
    if (!info.changes) return res.status(404).json({ error: 'not found' });
    res.json(toTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id)));
  });

  app.delete('/api/todos/:id', (req, res) => {
    const info = db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
    if (!info.changes) return res.status(404).json({ error: 'not found' });
    res.status(204).end();
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'not found' }));

  if (staticDir && fs.existsSync(staticDir)) {
    app.use(express.static(staticDir));
    app.get('*', (_req, res) => res.sendFile(path.join(staticDir, 'index.html')));
  }

  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid JSON' });
    res.status(500).json({ error: 'server error' });
  });
  return app;
}
