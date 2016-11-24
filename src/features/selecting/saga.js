import _ from 'lodash';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import notes from '../notes';
import sequencingPosition from '../sequencing-position';
import shared from '../shared';
import song from '../song';
import * as actions from './actions';
import * as helpers from './helpers';
import * as selectors from './selectors';

function* start({ isAdditive }) {
  const startPoint = yield select(sequencingPosition.selectors.getMousePoint);
  yield put(actions.newPointSet(startPoint));
  yield put(actions.startPointSet(startPoint));
  if (!isAdditive) {
    yield put(notes.actions.notesSelected([]));
  }
  //eslint-disable-next-line
  while(true) {
    yield call(shared.helpers.resolveOnMouseUp);
    const isSelecting = yield select(selectors.getIsSelecting);
    if (isSelecting) {
      yield put(actions.stopped());
    }
  }
}

function* update({ isAdditive }) {
  const newPoint = yield select(sequencingPosition.selectors.getMousePoint);
  const previousPoint = yield select(selectors.getNewPoint);

  if (_.isEqual(previousPoint, newPoint)) return;

  const startPoint = yield select(selectors.getStartPoint);
  const allNotes = yield select(song.selectors.getActiveSequenceNotes);
  const selectedNotes = yield select(notes.selectors.getSelectedNotes);
  const notesToSelect = helpers.getNotesInFence(startPoint, newPoint, allNotes);

  if (_.isEqual(notesToSelect, selectedNotes)) {
    yield put(actions.newPointSet(newPoint));
    return;
  }

  if (isAdditive) {
    yield put(notes.actions.notesSelected([
      ...selectedNotes,
      ...notesToSelect,
    ]));
  } else {
    yield put(notes.actions.notesSelected(notesToSelect));
  }

  yield put(actions.newPointSet(newPoint));
}

export default function* saga() {
  yield [
    takeEvery(actions.STARTED, start),
    takeEvery(actions.UPDATED, update),
  ];
}
