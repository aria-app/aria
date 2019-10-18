import { connect } from 'react-redux';
import audio from '../../audio';
import shared from '../../shared';
import song from '../../song';
import SongViewer from './SongViewer';

export default connect(
  state => ({
    isLoading: song.selectors.getIsSongLoading(state),
    playbackState: audio.selectors.getPlaybackState(state),
    position: audio.selectors.getPosition(state),
    song: song.selectors.getSong(state),
  }),
  {
    onLoad: shared.actions.songViewerLoaded,
    onPause: shared.actions.playbackPauseRequestStarted,
    onPlay: shared.actions.playbackStartRequestStarted,
    onPositionSet: shared.actions.positionSetRequestStarted,
    onStop: shared.actions.playbackStopRequestStarted,
  },
)(SongViewer);