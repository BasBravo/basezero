import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
    it('expone un nombre accesible', () => {
        render(<Button>Empezar</Button>);

        expect(screen.getByRole('button', { name: 'Empezar' })).toBeInTheDocument();
    });
});
