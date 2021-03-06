import omit from 'lodash/fp/omit';

import * as actions from '../actions';
import { DawwwReducer, State } from '../types';

export const volumeNodesReducer: DawwwReducer<State['volumeNodes']> = (
  state,
  action,
  shared,
) => {
  switch (action.type) {
    case actions.TRACK_ADDED:
      return {
        ...state,
        [action.payload.track.id]: shared.toneAdapter.createVolume({
          track: action.payload.track,
        }),
      };
    case actions.TRACK_DELETION_ACCEPTED:
      return omit([action.payload.track.id], state);
    default:
      return state;
  }
};
