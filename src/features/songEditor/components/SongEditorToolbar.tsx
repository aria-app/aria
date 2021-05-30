import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SettingsIcon from '@material-ui/icons/Settings';
import StopIcon from '@material-ui/icons/Stop';
import { memo, useCallback } from 'react';
import * as Tone from 'tone';

import Dawww from '../../../dawww';
import { PlaybackState } from '../../../types';
import shared from '../../shared';

const { STARTED, STOPPED } = Dawww.PLAYBACK_STATES;
const { Box, Button, Stack, Toolbar } = shared.components;

export interface SongEditorToolbarProps {
  onPause: () => void;
  onPlay: () => void;
  onSongInfoOpen: () => void;
  onStop: () => void;
  playbackState: PlaybackState;
}

function SongEditorToolbar(props: SongEditorToolbarProps) {
  const { onPause, onPlay, onSongInfoOpen, onStop, playbackState } = props;

  const handlePlayPauseToggle = useCallback(
    function handlePlayPauseToggle() {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }

      if (playbackState === STARTED) {
        onPause();
      } else {
        onPlay();
      }
    },
    [onPause, onPlay, playbackState],
  );

  return (
    <Toolbar position="top">
      <Stack direction="row" space={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            onClick={onSongInfoOpen}
            startIcon={<SettingsIcon />}
            title="Settings"
            variant="text"
          />
        </Box>
        {playbackState && playbackState !== STARTED && (
          <Button
            onClick={handlePlayPauseToggle}
            startIcon={<PlayArrowIcon />}
            title="Play"
            variant="text"
          />
        )}
        {playbackState && playbackState === STARTED && (
          <Button
            onClick={handlePlayPauseToggle}
            startIcon={<PauseIcon />}
            title="Pause"
            variant="text"
          />
        )}
        {playbackState && playbackState !== STOPPED && (
          <Button
            onClick={onStop}
            startIcon={<StopIcon />}
            title="Stop"
            variant="text"
          />
        )}
      </Stack>
    </Toolbar>
  );
}

export default memo(SongEditorToolbar);
