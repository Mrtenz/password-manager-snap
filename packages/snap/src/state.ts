import type { Name, State } from '@mrtenz/password-snap-common';
import { isState } from '@mrtenz/password-snap-common';

const INITIAL_STATE: State = {
  names: [],
};

/**
 * Get the Snap state, or initialize it if it doesn't exist.
 *
 * @param initialState - The initial state to use if the Snap state doesn't
 * exist.
 * @returns The Snap state.
 */
export const getState = async (
  initialState = INITIAL_STATE
): Promise<State> => {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (isState(state)) {
    return state;
  }

  return initialState;
};

/**
 * Set the Snap state. This will overwrite the existing state. State names are
 * deduplicated.
 *
 * @param newState - The new state to set.
 */
export const setState = async (newState: State): Promise<void> => {
  await wallet.request({
    method: 'snap_manageState',
    params: [
      'update',
      {
        ...newState,
        names: deduplicateNames(newState.names),
      },
    ],
  });
};

/**
 * Deduplicate state names.
 *
 * @param names - The names to deduplicate.
 * @returns The deduplicated names.
 */
const deduplicateNames = (names: Name[]): Name[] => {
  return names.filter(
    (value, index, array) =>
      index ===
      array.findIndex((t) => t.name === value.name && t.mask === value.mask)
  );
};
