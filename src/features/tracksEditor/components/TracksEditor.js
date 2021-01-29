import find from 'lodash/fp/find';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';
import PropTypes from 'prop-types';
import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

import Dawww from '../../../dawww';
import audio from '../../audio';
import shared from '../../shared';
import songFeature from '../../song';
import TrackEditingModal from './TrackEditingModal';
import TrackList from './TrackList';
import TracksEditorToolbar from './TracksEditorToolbar';

const { useAudioManager, usePlaybackState, usePosition } = audio.hooks;
const { useSong } = songFeature.hooks;
const { Box, LoadingIndicator, Timeline } = shared.components;

TracksEditor.propTypes = {
  navigate: PropTypes.func,
  onLoad: PropTypes.func,
  onSequenceAdd: PropTypes.func,
  onSequenceDelete: PropTypes.func,
  onSequenceDuplicate: PropTypes.func,
  onSequenceEdit: PropTypes.func,
  onSongMeasureCountChange: PropTypes.func,
  onTrackAdd: PropTypes.func,
  onTrackDelete: PropTypes.func,
  onTrackVoiceSet: PropTypes.func,
  onTrackVolumeSet: PropTypes.func,
  position: PropTypes.number,
  sequences: PropTypes.arrayOf(PropTypes.object),
  songMeasureCount: PropTypes.number,
  tracks: PropTypes.arrayOf(PropTypes.object),
};

function TracksEditor(props) {
  const {
    navigate,
    onSequenceAdd,
    onSequenceDelete,
    onSequenceDuplicate,
    onSequenceEdit,
    onSongMeasureCountChange,
    onTrackAdd,
    onTrackDelete,
    onTrackVoiceSet,
    onTrackVolumeSet,
    sequences,
    tracks,
  } = props;
  const audioManager = useAudioManager();
  const playbackState = usePlaybackState();
  const position = usePosition();
  const { deepSong, loading, song } = useSong();
  const [selectedSequenceId, setSelectedSequenceId] = React.useState('');
  const [selectedTrackId, setSelectedTrackId] = React.useState('');

  const selectedSequence = React.useMemo(
    () => find((s) => s.id === selectedSequenceId, sequences),
    [selectedSequenceId, sequences],
  );

  const selectedTrack = React.useMemo(
    () => find((t) => t.id === selectedTrackId, tracks),
    [selectedTrackId, tracks],
  );

  const handleSequenceDelete = React.useCallback(
    (e) => {
      e.preventDefault();

      if (isNil(selectedSequence)) return;

      onSequenceDelete(selectedSequence);
    },
    [onSequenceDelete, selectedSequence],
  );

  const handleSequenceDuplicate = React.useCallback(
    (e) => {
      e.preventDefault();

      if (isEmpty(selectedSequence)) return;

      const duplicatedSequence = Dawww.createSequence(
        selectedSequence.trackId,
        selectedSequence.position,
        selectedSequence.measureCount,
      );

      onSequenceDuplicate({
        originalSequence: selectedSequence,
        duplicatedSequence,
      });

      setSelectedSequenceId(duplicatedSequence.id);
    },
    [onSequenceDuplicate, selectedSequence],
  );

  const handleSequenceOpen = React.useCallback(
    (sequence) => {
      navigate(`sequence/${sequence.id}`);
    },
    [navigate],
  );

  const handleTrackDeselect = React.useCallback(() => {
    setSelectedTrackId('');
  }, []);

  const handleTrackDelete = React.useCallback(
    (track) => {
      onTrackDelete(track);

      handleTrackDeselect();
    },
    [handleTrackDeselect, onTrackDelete],
  );

  const handleTrackListPositionSet = React.useCallback(
    (position) => {
      audioManager.setPosition(position);
    },
    [audioManager],
  );

  const handleTrackListSequenceAdd = React.useCallback(
    ({ position, track }) => {
      const sequence = Dawww.createSequence(track.id, position);

      onSequenceAdd(sequence);
    },
    [onSequenceAdd],
  );

  const handleTrackListSequenceDeselect = React.useCallback(() => {
    setSelectedSequenceId('');
  }, []);

  const handleTrackListSequenceSelect = React.useCallback((sequence) => {
    setSelectedSequenceId(sequence.id);
  }, []);

  const handleTrackListTrackAdd = React.useCallback(() => {
    const track = Dawww.createTrack();
    const sequence = Dawww.createSequence(track.id);

    onTrackAdd({ sequence, track });
  }, [onTrackAdd]);

  const handleTrackSelect = React.useCallback((track) => {
    setSelectedTrackId(track.id);
  }, []);

  React.useEffect(() => {
    if (!song) return;
    audioManager.updateSong({ ...song, focusedSequenceId: '' });
  }, [audioManager, song]);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <GlobalHotKeys
        allowChanges={true}
        handlers={{
          DELETE: handleSequenceDelete,
          DUPLICATE: handleSequenceDuplicate,
        }}
        keyMap={{
          DELETE: ['backspace', 'del'],
          DUPLICATE: ['ctrl+shift+d', 'meta+shift+d'],
        }}
      />
      {loading ? (
        <LoadingIndicator>LOADING SONG...</LoadingIndicator>
      ) : (
        <TrackList
          isLoading={loading}
          onPositionSet={handleTrackListPositionSet}
          onSequenceAdd={handleTrackListSequenceAdd}
          onSequenceDeselect={handleTrackListSequenceDeselect}
          onSequenceEdit={onSequenceEdit}
          onSequenceOpen={handleSequenceOpen}
          onSequenceSelect={handleTrackListSequenceSelect}
          onSongMeasureCountChange={onSongMeasureCountChange}
          onTrackAdd={handleTrackListTrackAdd}
          onTrackStage={handleTrackSelect}
          selectedSequence={selectedSequence}
          songMeasureCount={deepSong.measureCount}
          tracks={deepSong.tracks}
        />
      )}
      <TracksEditorToolbar
        onSequenceDelete={handleSequenceDelete}
        onSequenceDuplicate={handleSequenceDuplicate}
        onSequenceOpen={handleSequenceOpen}
        selectedSequence={selectedSequence}
      />
      <Timeline
        isVisible={
          playbackState !== audioManager.constants.PLAYBACK_STATES.STOPPED
        }
        offset={position * 2 + 16}
      />
      {!loading && (
        <TrackEditingModal
          onDelete={handleTrackDelete}
          onDismiss={handleTrackDeselect}
          onVoiceSet={onTrackVoiceSet}
          onVolumeSet={onTrackVolumeSet}
          track={selectedTrack}
        />
      )}
    </Box>
  );
}

export default React.memo(TracksEditor);
