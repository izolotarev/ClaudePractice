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
