import getOr from 'lodash/fp/getOr';

export const getUserId = getOr('', 'song.userId');
