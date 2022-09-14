import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { getSetMask, Mask } from '../mask/utils';
import { Nickname } from './Nickname';

jest.mock('../../api', () => ({
  useGeneratePasswordMutation: jest.fn().mockImplementation(() => [jest.fn()]),
  useRemoveNicknameMutation: jest.fn().mockImplementation(() => [jest.fn()]),
}));

describe('Nicknames', () => {
  it('renders a name and masks', async () => {
    render(
      <Nickname
        name="foo.com"
        mask={getSetMask([Mask.Symbols, Mask.Numbers])}
      />
    );

    expect(await screen.findByText('foo.com')).toBeDefined();
    expect(await screen.findByText(Mask.Symbols)).toBeDefined();
    expect(await screen.findByText(Mask.Numbers)).toBeDefined();

    render(
      <Nickname
        name="bar.com"
        mask={getSetMask([Mask.Uppercase, Mask.Lowercase, Mask.SpacesDashes])}
      />
    );

    expect(await screen.findByText('bar.com')).toBeDefined();
    expect(await screen.findByText(Mask.Uppercase)).toBeDefined();
    expect(await screen.findByText(Mask.Lowercase)).toBeDefined();
    expect(await screen.findByText(Mask.SpacesDashes)).toBeDefined();
  });
});
