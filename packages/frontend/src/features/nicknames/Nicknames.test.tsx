import { describe, it, jest, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { getSetMask, Mask } from '../mask/utils';
import { Nicknames } from './Nicknames';

jest.mock('../../api', () => ({
  useGetNicknamesQuery: jest.fn().mockImplementation(() => ({
    data: {
      names: [
        { name: 'foo.com', mask: getSetMask([Mask.Uppercase, Mask.Lowercase]) },
        { name: 'bar.io', mask: getSetMask([Mask.Numbers, Mask.Symbols]) },
      ],
    },
  })),
  useImportNicknamesMutation: jest.fn().mockImplementation(() => [jest.fn()]),
  useGeneratePasswordMutation: jest.fn().mockImplementation(() => [jest.fn()]),
  useRemoveNicknameMutation: jest.fn().mockImplementation(() => [jest.fn()]),
}));

describe('Nicknames', () => {
  it('renders a list of nickname components', async () => {
    render(<Nicknames />);

    expect(await screen.findByText('foo.com')).toBeDefined();
  });
});
