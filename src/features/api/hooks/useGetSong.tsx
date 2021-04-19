import { useQuery } from '@apollo/client';
import { Song } from '../../../types';

import * as queries from '../queries';

export default function useGetSong(...args) {
  return useQuery<{ song: Song }>(queries.GET_SONG, ...args);
}