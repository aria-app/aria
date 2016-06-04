import _ from 'lodash';
import playing from 'ducks/playing';
import shared from 'ducks/shared';
import transport from 'ducks/transport';
import * as actionTypes from './action-types';
import * as helpers from './helpers';
import * as selectors from './selectors';

export function addNotes(notes) {
  return {
    type: actionTypes.ADD_NOTES,
    notes,
  };
}

export function closeSequence() {
  return {
    type: actionTypes.CLOSE_SEQUENCE,
  };
}

export function createNotesInActiveSequence(pointSets) {
  return (dispatch, getState) => {
    const sequenceId = selectors.getActiveSequenceId(getState());
    const notes = pointSets.map(points => helpers.createNote({
      points,
      sequenceId,
    }));

    dispatch(addNotes(notes));
    return notes;
  };
}

export function addSequence(options) {
  return (dispatch, getState) => {
    const sequences = selectors.getSequences(getState());
    const newSequence = helpers.createSequence({
      ...options,
    });
    const updatedSequences = [
      ...sequences,
      newSequence,
    ];

    dispatch(setSequences(updatedSequences));
  };
}

export function addTrack() {
  return (dispatch, getState) => {
    const tracks = selectors.getTracks(getState());
    const newTrack = helpers.createTrack();
    const updatedTracks = [
      ...tracks,
      newTrack,
    ];

    dispatch(setTracks(updatedTracks));
    dispatch(addSequence({
      measureCount: 1,
      trackId: newTrack.id,
    }));
  };
}

export function deleteNotes(notes) {
  return {
    type: actionTypes.DELETE_NOTES,
    notes,
  };
}

export function deleteTrackById(trackId) {
  return (dispatch, getState) => {
    const tracks = selectors.getTracks(getState());
    const updatedTracks = _.reject(tracks, { id: trackId });

    dispatch(setTracks(updatedTracks));
  };
}

export function openSequence(id) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.OPEN_SEQUENCE,
      id,
    });
    dispatch(transport.effects.updateLooping());
  };
}

export function setBPM(bpm) {
  return (dispatch, getState) => {
    const song = selectors.getSong(getState());
    const safeBpm = _.clamp(bpm, shared.constants.minBPM, shared.constants.maxBPM);
    const updatedSong = {
      ...song,
      bpm: safeBpm,
    };

    dispatch(setSong(updatedSong));
    dispatch(transport.effects.updateBPM());
  };
}

export function setNotes(notes) {
  return {
    type: actionTypes.SET_NOTES,
    notes,
  };
}

export function setSequences(sequences) {
  return (dispatch, getState) => {
    const song = selectors.getSong(getState());
    const updatedSong = {
      ...song,
      sequences,
    };

    dispatch(setSong(updatedSong));
  };
}

export function setSong(song) {
  return {
    type: actionTypes.SET_SONG,
    song,
  };
}

export function setTracks(tracks) {
  return (dispatch, getState) => {
    const song = selectors.getSong(getState());
    const updatedSong = {
      ...song,
      tracks,
    };

    dispatch(setSong(updatedSong));
    dispatch(playing.effects.updateTracks());
  };
}

export function updateSequence(sequence) {
  return (dispatch, getState) => {
    const sequences = selectors.getSequences(getState());
    const updatedSequences = shared.helpers.replaceItemsById(
      sequences,
      [sequence],
    );

    dispatch(setSequences(updatedSequences));
  };
}

export function updateTrack(track) {
  return (dispatch, getState) => {
    const tracks = selectors.getTracks(getState());
    const updatedTracks = shared.helpers.replaceItemsById(
      tracks,
      [track],
    );

    dispatch(setTracks(updatedTracks));
  };
}

// export function decrementSequenceLength(id) {
//   return (dispatch, getState) => {
//     const sequence = selectors.getSequenceById(getState(), id);
//     const newMeasureCount = sequence.measureCount - 1;
//
//     if (newMeasureCount < 1) return;
//
//     const updatedSequence = {
//       ...sequence,
//       measureCount: newMeasureCount,
//     };
//
//     dispatch(updateSequence(updatedSequence));
//     dispatch(transport.effects.updateSequences());
//   };
// }
//
// export function incrementSequenceLength(id) {
//   return (dispatch, getState) => {
//     const sequence = selectors.getSequenceById(getState(), id);
//     const newMeasureCount = sequence.measureCount + 1;
//
//     const updatedSequence = {
//       ...sequence,
//       measureCount: newMeasureCount,
//     };
//
//     dispatch(updateSequence(updatedSequence));
//     dispatch(transport.effects.updateSequences());
//   };
// }
//
// export function decrementSequencePosition(id) {
//   return (dispatch, getState) => {
//     const sequence = selectors.getSequenceById(getState(), id);
//     const newPosition = sequence.position - 1;
//
//     if (newPosition < 0) return;
//
//     const updatedSequence = {
//       ...sequence,
//       position: newPosition,
//     };
//
//     dispatch(updateSequence(updatedSequence));
//     dispatch(transport.effects.updateSequences());
//   };
// }
//
// export function incrementSequencePosition(id) {
//   return (dispatch, getState) => {
//     const songMeasureCount = selectors.getSongMeasureCount(getState());
//     const sequence = selectors.getSequenceById(getState(), id);
//     const newPosition = sequence.position + 1;
//
//     if (newPosition > songMeasureCount - 1) return;
//
//     const updatedSequence = {
//       ...sequence,
//       position: newPosition,
//     };
//
//     dispatch(updateSequence(updatedSequence));
//     dispatch(transport.effects.updateSequences());
//   };
// }
//
// export function decrementSongLength() {
//   return (dispatch, getState) => {
//     const song = selectors.getSong(getState());
//     const newMeasureCount = song.measureCount - 1;
//
//     if (newMeasureCount < 1) return;
//
//     const updatedSong = {
//       ...song,
//       measureCount: newMeasureCount,
//     };
//
//     dispatch(setSong(updatedSong));
//     dispatch(transport.effects.updateLooping());
//   };
// }
//
// export function incrementSongLength() {
//   return (dispatch, getState) => {
//     const song = selectors.getSong(getState());
//     const newMeasureCount = song.measureCount + 1;
//
//     const updatedSong = {
//       ...song,
//       measureCount: newMeasureCount,
//     };
//
//     dispatch(setSong(updatedSong));
//     dispatch(transport.effects.updateLooping());
//   };
// }
