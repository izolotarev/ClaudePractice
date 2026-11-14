import { useEffect, useState } from 'react';

const GENERIC_ERROR = 'Something went wrong. Please try again.';

async function api(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api('/api/todos')
      .then(setTodos)
      .catch(() => setError(GENERIC_ERROR))
      .finally(() => setLoaded(true));
  }, []);

  async function add(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return setError('Please enter some text.');
    if (t.length > 200) return setError('Text must be 200 characters or fewer.');
    try {
      const todo = await api('/api/todos', { method: 'POST', body: JSON.stringify({ text: t }) });
      setTodos((l) => [...l, todo]);
      setText('');
      setError('');
    } catch { setError(GENERIC_ERROR); }
  }

  async function toggle(todo) {
    try {
      const updated = await api(`/api/todos/${todo.id}`, { method: 'PATCH', body: JSON.stringify({ done: !todo.done }) });
      setTodos((l) => l.map((x) => (x.id === todo.id ? updated : x)));
      setError('');
    } catch { setError(GENERIC_ERROR); }
  }

  async function remove(todo) {
    try {
      await api(`/api/todos/${todo.id}`, { method: 'DELETE' });
      setTodos((l) => l.filter((x) => x.id !== todo.id));
      setError('');
    } catch { setError(GENERIC_ERROR); }
  }

  return (
    <main>
      <h1>Todos</h1>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs doing?" aria-label="New todo" />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {loaded && todos.length === 0 && <p>No todos yet</p>}
      <ul>
        {todos.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t)} aria-label={`Toggle ${t.text}`} />
            <span>{t.text}</span>
            <button onClick={() => remove(t)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
