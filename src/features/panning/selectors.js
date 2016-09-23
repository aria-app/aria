import { NAME } from './constants';

const get = state => state[NAME];

export const getIsPanning = state => get(state).isPanning;
export const getStartPoint = state => get(state).startPoint;