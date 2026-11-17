import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, it, expect } from 'vitest';
import App from './App.jsx';

const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
let fetchMock;
beforeEach(() => { fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock); });

it('shows empty state', async () => {
  fetchMock.mockResolvedValueOnce(json([]));
  render(<App />);
  expect(await screen.findByText('No todos yet')).toBeInTheDocument();
});

it('adds a todo with Enter and clears input', async () => {
  fetchMock.mockResolvedValueOnce(json([]));
  fetchMock.mockResolvedValueOnce(json({ id: 1, text: 'milk', done: false, created_at: 'x' }, 201));
  render(<App />);
  await screen.findByText('No todos yet');
  const input = screen.getByLabelText('New todo');
  await userEvent.type(input, 'milk{Enter}');
  expect(await screen.findByText('milk')).toBeInTheDocument();
  expect(input).toHaveValue('');
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ text: 'milk' });
});

it('rejects whitespace-only input without a request', async () => {
  fetchMock.mockResolvedValueOnce(json([]));
  render(<App />);
  await screen.findByText('No todos yet');
  await userEvent.type(screen.getByLabelText('New todo'), '   ');
  await userEvent.click(screen.getByRole('button', { name: 'Add' }));
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('toggles a todo', async () => {
  fetchMock.mockResolvedValueOnce(json([{ id: 1, text: 'a', done: false, created_at: 'x' }]));
  fetchMock.mockResolvedValueOnce(json({ id: 1, text: 'a', done: true, created_at: 'x' }));
  render(<App />);
  const box = await screen.findByRole('checkbox');
  await userEvent.click(box);
  await waitFor(() => expect(box).toBeChecked());
  expect(fetchMock.mock.calls[1][0]).toBe('/api/todos/1');
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ done: true });
});

it('deletes a todo', async () => {
  fetchMock.mockResolvedValueOnce(json([{ id: 1, text: 'a', done: false, created_at: 'x' }]));
  fetchMock.mockResolvedValueOnce({ ok: true, status: 204 });
  render(<App />);
  await userEvent.click(await screen.findByRole('button', { name: 'Delete' }));
  expect(await screen.findByText('No todos yet')).toBeInTheDocument();
});

it('shows an error and keeps list when a request fails', async () => {
  fetchMock.mockResolvedValueOnce(json([{ id: 1, text: 'a', done: false, created_at: 'x' }]));
  fetchMock.mockResolvedValueOnce(json({}, 500));
  render(<App />);
  await userEvent.click(await screen.findByRole('button', { name: 'Delete' }));
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(screen.getByText('a')).toBeInTheDocument();
});

const mixed = () => [
  { id: 1, text: 'a', done: true, created_at: 'x' },
  { id: 3, text: 'c', done: false, created_at: 'x' },
  { id: 4, text: 'd', done: true, created_at: 'x' },
  { id: 5, text: 'e', done: false, created_at: 'x' },
];

it('hides Clear completed while no todo is done', async () => {
  fetchMock.mockResolvedValueOnce(json([{ id: 1, text: 'a', done: false, created_at: 'x' }, { id: 3, text: 'c', done: false, created_at: 'x' }]));
  render(<App />);
  await screen.findByText('a');
  expect(screen.queryByRole('button', { name: 'Clear completed' })).not.toBeInTheDocument();
});

it('shows Clear completed when a todo is done', async () => {
  fetchMock.mockResolvedValueOnce(json(mixed()));
  render(<App />);
  expect(await screen.findByRole('button', { name: 'Clear completed' })).toBeInTheDocument();
});

it('Clear completed removes only the done todos', async () => {
  fetchMock.mockResolvedValueOnce(json(mixed()));
  fetchMock.mockResolvedValueOnce(json({ deleted: 2 }));
  render(<App />);
  await userEvent.click(await screen.findByRole('button', { name: 'Clear completed' }));
  await waitFor(() => expect(screen.queryByText('a')).not.toBeInTheDocument());
  expect(screen.queryByText('d')).not.toBeInTheDocument();
  expect(screen.getByText('c')).toBeInTheDocument();
  expect(screen.getByText('e')).toBeInTheDocument();
  expect(fetchMock.mock.calls[1][0]).toBe('/api/todos/completed');
  expect(fetchMock.mock.calls[1][1].method).toBe('DELETE');
  expect(screen.queryByRole('button', { name: 'Clear completed' })).not.toBeInTheDocument();
});

it('Clear completed shows an error and keeps the list when the request fails', async () => {
  fetchMock.mockResolvedValueOnce(json(mixed()));
  fetchMock.mockResolvedValueOnce(json({}, 500));
  render(<App />);
  await userEvent.click(await screen.findByRole('button', { name: 'Clear completed' }));
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  for (const t of ['a', 'c', 'd', 'e']) expect(screen.getByText(t)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Clear completed' })).toBeInTheDocument();
});
