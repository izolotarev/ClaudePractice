import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { openDb } from '../src/db.js';
import { createApp } from '../src/app.js';

let app;
beforeEach(() => {
  app = createApp(openDb(':memory:'));
});

describe('API', () => {
  it('health', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ status: 'ok' });
  });

  it('lists empty, then todos oldest first', async () => {
    expect((await request(app).get('/api/todos')).body).toEqual([]);
    await request(app).post('/api/todos').send({ text: 'a' });
    await request(app).post('/api/todos').send({ text: 'b' });
    const r = await request(app).get('/api/todos');
    expect(r.status).toBe(200);
    expect(r.body.map((t) => t.text)).toEqual(['a', 'b']);
  });

  it('POST creates and trims', async () => {
    const r = await request(app).post('/api/todos').send({ text: '  hi  ' });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ id: 1, text: 'hi', done: false });
    expect(r.body.created_at).toBeTruthy();
  });

  it('POST accepts 200 chars', async () => {
    expect(
      (
        await request(app)
          .post('/api/todos')
          .send({ text: 'x'.repeat(200) })
      ).status,
    ).toBe(201);
  });

  it.each([[{}], [{ text: '' }], [{ text: '   ' }], [{ text: 5 }], [{ text: 'x'.repeat(201) }]])(
    'POST rejects %j',
    async (body) => {
      expect((await request(app).post('/api/todos').send(body)).status).toBe(400);
    },
  );

  it('POST rejects invalid JSON', async () => {
    const r = await request(app).post('/api/todos').set('Content-Type', 'application/json').send('{bad');
    expect(r.status).toBe(400);
  });

  it('PATCH toggles done', async () => {
    await request(app).post('/api/todos').send({ text: 'a' });
    let r = await request(app).patch('/api/todos/1').send({ done: true });
    expect(r.status).toBe(200);
    expect(r.body.done).toBe(true);
    r = await request(app).patch('/api/todos/1').send({ done: false });
    expect(r.body.done).toBe(false);
  });

  it('PATCH updates only the todo with that id when ids have gaps', async () => {
    for (const text of ['a', 'b', 'c', 'd']) await request(app).post('/api/todos').send({ text });
    await request(app).delete('/api/todos/1');
    await request(app).delete('/api/todos/3');
    // Remaining rows: id 2 ('b') and id 4 ('d'), at list positions 1 and 2.
    const r = await request(app).patch('/api/todos/4').send({ done: true });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ id: 4, text: 'd', done: true });
    const list = await request(app).get('/api/todos');
    expect(list.body.map((t) => [t.id, t.done])).toEqual([
      [2, false],
      [4, true],
    ]);
    expect((await request(app).patch('/api/todos/3').send({ done: true })).status).toBe(404);
  });

  it('PATCH 400 on non-boolean, 404 on missing', async () => {
    await request(app).post('/api/todos').send({ text: 'a' });
    expect((await request(app).patch('/api/todos/1').send({ done: 'yes' })).status).toBe(400);
    expect((await request(app).patch('/api/todos/1').send({})).status).toBe(400);
    expect((await request(app).patch('/api/todos/99').send({ done: true })).status).toBe(404);
  });

  it('DELETE removes the todo with that id when ids have gaps', async () => {
    for (const text of ['a', 'b', 'c', 'd']) await request(app).post('/api/todos').send({ text });
    expect((await request(app).delete('/api/todos/1')).status).toBe(204);
    expect((await request(app).delete('/api/todos/3')).status).toBe(204);
    const r = await request(app).get('/api/todos');
    expect(r.body.map((t) => [t.id, t.text])).toEqual([
      [2, 'b'],
      [4, 'd'],
    ]);
    expect((await request(app).delete('/api/todos/4')).status).toBe(204);
    expect((await request(app).delete('/api/todos/3')).status).toBe(404);
  });

  it('DELETE removes, 404 on missing', async () => {
    await request(app).post('/api/todos').send({ text: 'a' });
    expect((await request(app).delete('/api/todos/1')).status).toBe(204);
    expect((await request(app).get('/api/todos')).body).toEqual([]);
    expect((await request(app).delete('/api/todos/1')).status).toBe(404);
  });
});
