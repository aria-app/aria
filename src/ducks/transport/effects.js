import _ from 'lodash';
import Tone from 'tone';
import playing from 'ducks/playing';
import sequencer from 'ducks/sequencer';
import song from 'ducks/song';
import * as actions from './actions';
import * as constants from './constants';
import * as helpers from './helpers';
import * as selectors from './selectors';

export function createSequences() {
  return (dispatch, getState) => {
    const songSequences = song.selectors.getSequences(getState());
    const toneSequences = songSequences.map(s => new Tone.Sequence((time, step) => {
      const getNotes = song.selectors.createGetNotesById(s.id);
      const allNotes = getNotes(getState());
      const notesAtStep = _(allNotes)
        .filter(note => _.first(note.points).x === step)
        .uniqBy(note => _.first(note.points).y)
        .value();

      notesAtStep.forEach((note) => {
        const bpm = selectors.getBpm(getState());
        const length = helpers.sizeToSeconds(_.last(note.points).x - _.first(note.points).x, bpm);
        dispatch(playing.effects.playNoteOnSequence(note, time, length, s.trackId));
      });

      dispatch(actions.setPosition(step));
    }, _.range(sequencer.selectors.getMeasureCount(getState()) * 32), '32n').start());

    dispatch(actions.setSequences(toneSequences));
  };
}

export function pause() {
  return (dispatch) => {
    dispatch(actions.setPlaybackState(constants.playbackStates.PAUSED));
    dispatch(playing.effects.releaseAll());
    Tone.Transport.pause();
  };
}

export function play() {
  return (dispatch) => {
    dispatch(actions.setPlaybackState(constants.playbackStates.STARTED));
    Tone.Transport.start();
  };
}

export function stop() {
  return (dispatch, getState) => {
    const playbackState = selectors.getPlaybackState(getState());

    if (playbackState === constants.playbackStates.STOPPED) return;

    dispatch(actions.setPlaybackState(constants.playbackStates.STOPPED));
    dispatch(actions.setPosition(0));
    dispatch(playing.effects.releaseAll());
    Tone.Transport.stop();
  };
}

export function togglePlayPause() {
  return (dispatch, getState) => {
    const playbackState = selectors.getPlaybackState(getState());

    if (playbackState !== constants.playbackStates.STARTED) {
      dispatch(play());
    } else {
      dispatch(pause());
    }
  };
}

export function updateSequences() {
  return (dispatch, getState) => {
    const sequences = selectors.getSequences(getState());

    sequences.forEach(s => s.dispose());

    dispatch(createSequences());
  };
}