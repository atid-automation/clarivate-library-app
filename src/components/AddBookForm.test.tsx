import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddBookForm } from './AddBookForm';

describe('AddBookForm', () => {
  it('כפתור השמירה חסום כשהכותרת ריקה', () => {
    render(<AddBookForm onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'שמור' })).toBeDisabled();
  });

  it('מציג שגיאה על ISBN לא תקין', async () => {
    render(<AddBookForm onAdd={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('ISBN'), '123');
    expect(screen.getByRole('alert')).toHaveTextContent('ISBN לא תקין');
  });

  it('שולח את הנתונים כשהכול תקין', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddBookForm onAdd={onAdd} />);
    await userEvent.type(screen.getByLabelText('כותרת'), 'Dune');
    await userEvent.type(screen.getByLabelText('ISBN'), '9780441013593');
    await userEvent.click(screen.getByRole('button', { name: 'שמור' }));
    expect(onAdd).toHaveBeenCalledWith({ title: 'Dune', author: '', isbn: '9780441013593' });
  });
});
