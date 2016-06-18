import _ from 'lodash';
import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import contextMenu from 'ducks/context-menu';
import shortcuts from 'ducks/shortcuts';
import song from 'ducks/song';
import * as actions from './actions';
import * as actionTypes from './action-types';
import * as constants from './constants';
import * as selectors from './selectors';

function* addNewTrack() {
  yield put(song.actions.addNewTrack());
}

function* addSequenceToTrack({ track, position }) {
  yield put(song.actions.addSequenceToTrack(track, position));
}

function* applyStagedTrack() {
  const stagedTrack = yield select(selectors.getStagedTrack);
  const originalTrack = yield select(song.selectors.getTrackById(stagedTrack.id));
  if (!_.isEqual(stagedTrack, originalTrack)) {
    yield put(song.actions.updateTrack(stagedTrack));
  }
  yield put(actions.clearStagedTrack());
}

function* contextMenuItemSelected({ item }) {
  const { DELETE_SEQUENCE } = constants.contextMenuActions;

  switch (item.action) {
    case DELETE_SEQUENCE:
      return yield put(song.actions.deleteSequence(item.sequence));
    default:
      return undefined;
  }
}

function* deleteSequence({ sequence }) {
  yield put(song.actions.deleteSequence(sequence));
}

function* deleteStagedTrack() {
  const stagedTrack = yield select(selectors.getStagedTrack);
  yield put(song.actions.deleteTrackById(stagedTrack.id));
  yield put(actions.clearStagedTrack());
}

function* extendSequence({ sequence }) {
  yield put(song.actions.extendSequence(sequence));
}

function* moveSequenceLeft({ sequence }) {
  yield put(song.actions.moveSequenceLeft(sequence));
}

function* moveSequenceRight({ sequence }) {
  yield put(song.actions.moveSequenceRight(sequence));
}

function* pushRedo() {
  const sequences = yield select(song.selectors.getSequences);
  const tracks = yield select(song.selectors.getTracks);
  const redos = yield select(selectors.getRedos);
  yield put(actions.setRedos([
    ...redos,
    { sequences, tracks },
  ]));
}

function* pushUndo() {
  const sequences = yield select(song.selectors.getSequences);
  const tracks = yield select(song.selectors.getTracks);
  const undos = yield select(selectors.getUndos);

  if (
    (_.last(undos)) &&
    (_.isEqual(_.last(undos).sequences, sequences)) &&
    (_.isEqual(_.last(undos).tracks, tracks))
  ) return;

  yield put(actions.setUndos([
    ...undos,
    { sequences, tracks },
  ]));
  yield put(actions.setRedos([]));
}

function* redo() {
  if (yield select(song.selectors.getActiveSequence)) return;

  const redos = yield select(selectors.getRedos);

  if (_.isEmpty(redos)) return;

  const sequences = yield select(song.selectors.getSequences);
  const tracks = yield select(song.selectors.getTracks);
  const undos = yield select(selectors.getUndos);

  yield put(actions.setUndos([
    ...undos,
    { sequences, tracks },
  ]));
  yield put(song.actions.setSequences(_.last(redos).sequences));
  yield put(song.actions.setTracks(_.last(redos).tracks));
  yield put(actions.setRedos(redos.slice(0, redos.length - 1)));
}

function* shortenSequence({ sequence }) {
  yield put(song.actions.shortenSequence(sequence));
}

function* toggleTrackIsMuted({ id }) {
  yield put(song.actions.toggleTrackIsMuted(id));
}

function* toggleTrackIsSoloing({ id }) {
  yield put(song.actions.toggleTrackIsSoloing(id));
}

function* undo() {
  if (yield select(song.selectors.getActiveSequence)) return;

  const undos = yield select(selectors.getUndos);

  if (_.isEmpty(undos)) return;

  yield put(actions.pushRedo());
  yield put(song.actions.setSequences(_.last(undos).sequences));
  yield put(song.actions.setTracks(_.last(undos).tracks));
  yield put(actions.setUndos(undos.slice(0, undos.length - 1)));
}

export default function* saga() {
  yield [
    takeEvery([
      actionTypes.ADD_NEW_TRACK,
      actionTypes.ADD_SEQUENCE_TO_TRACK,
      actionTypes.APPLY_STAGED_TRACK,
      actionTypes.DELETE_SEQUENCE,
      actionTypes.DELETE_STAGED_TRACK,
      actionTypes.EXTEND_SEQUENCE,
      actionTypes.MOVE_SEQUENCE_LEFT,
      actionTypes.MOVE_SEQUENCE_RIGHT,
      actionTypes.PUSH_UNDO,
      actionTypes.SHORTEN_SEQUENCE,
      actionTypes.TOGGLE_TRACK_IS_MUTED,
      actionTypes.TOGGLE_TRACK_IS_SOLOING,
    ], pushUndo),
    takeEvery(actionTypes.ADD_NEW_TRACK, addNewTrack),
    takeEvery(actionTypes.ADD_SEQUENCE_TO_TRACK, addSequenceToTrack),
    takeEvery(actionTypes.APPLY_STAGED_TRACK, applyStagedTrack),
    takeEvery(actionTypes.DELETE_SEQUENCE, deleteSequence),
    takeEvery(actionTypes.DELETE_STAGED_TRACK, deleteStagedTrack),
    takeEvery(actionTypes.EXTEND_SEQUENCE, extendSequence),
    takeEvery(actionTypes.MOVE_SEQUENCE_LEFT, moveSequenceLeft),
    takeEvery(actionTypes.MOVE_SEQUENCE_RIGHT, moveSequenceRight),
    takeEvery(actionTypes.PUSH_REDO, pushRedo),
    takeEvery(actionTypes.REDO, redo),
    takeEvery(actionTypes.SHORTEN_SEQUENCE, shortenSequence),
    takeEvery(actionTypes.TOGGLE_TRACK_IS_MUTED, toggleTrackIsMuted),
    takeEvery(actionTypes.TOGGLE_TRACK_IS_SOLOING, toggleTrackIsSoloing),
    takeEvery(actionTypes.UNDO, undo),
    takeEvery(contextMenu.actionTypes.CONTEXT_MENU_ITEM_SELECTED, contextMenuItemSelected),
    takeEvery(shortcuts.actionTypes.REDO, redo),
    takeEvery(shortcuts.actionTypes.UNDO, undo),
  ];
}