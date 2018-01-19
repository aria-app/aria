import compose from 'lodash/fp/compose';
import getOr from 'lodash/fp/getOr';
import isEqual from 'lodash/fp/isEqual';
import shared from '../shared';
import { NAME } from './constants';

export const getPlaybackState =
  getOr('', `${NAME}.playbackState`);

export const getPosition =
  getOr(0, `${NAME}.position`);

export const getIsStopped = compose(
  isEqual(shared.constants.playbackStates.STOPPED),
  getPlaybackState,
);