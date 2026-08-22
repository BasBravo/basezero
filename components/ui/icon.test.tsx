import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './icon';

describe('Icon', () => {
    it('renderiza el símbolo de Material pedido', () => {
        const { container } = render(<Icon name="menu" />);
        const svg = container.querySelector('svg');

        expect(svg).toHaveAttribute('aria-hidden', 'true');
        expect(svg?.querySelector('path')).toBeTruthy();
    });
});
