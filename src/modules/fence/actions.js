import _ from 'lodash';
// import drag from 'modules/drag';
import notes from 'modules/notes';
import actionTypes from './action-types';
import * as helpers from './helpers';
import * as selectors from './selectors';

export function updateFence(newPosition) {
  return (dispatch, getState) => {
    const previousPosition = selectors.getNewPosition(getState());

    if (_.isEqual(previousPosition, newPosition)) return;

    const startPosition = selectors.getStartPosition(getState());
    const allNotes = notes.selectors.getNotes(getState());
    const notesToSelect = helpers.getNotesInFence(startPosition, newPosition, allNotes);

    dispatch(notes.actions.select(notesToSelect));

    dispatch(setNewPosition(newPosition));
  };
}

export function setIsSelecting(isSelecting) {
  return {
    type: actionTypes.SET_IS_SELECTING,
    isSelecting,
  };
}

export function setNewPosition(newPosition) {
  return {
    type: actionTypes.SET_NEW_POSITION,
    newPosition,
  };
}

export function setStartPosition(startPosition) {
  return {
    type: actionTypes.SET_START_POSITION,
    startPosition,
  };
}

export function startSelecting(startPosition) {
  return (dispatch) => {
    dispatch(setIsSelecting(true));
    dispatch(setStartPosition(startPosition));
    dispatch(setNewPosition(startPosition));
    dispatch(notes.actions.select([]));
  };
}

export function stopSelecting() {
  return (dispatch) => {
    dispatch(setIsSelecting(false));
    dispatch(setNewPosition(undefined));
  };
}