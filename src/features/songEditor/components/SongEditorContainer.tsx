import { connect } from 'react-redux';
import audio from '../../audio';
import shared from '../../shared';
import song from '../../song';
import user from '../../user';
import SongEditor from './SongEditor';

export default connect(
  state => ({
    playbackState: audio.selectors.getPlaybackState(state),
    song: song.selectors.getSong(state),
    user: user.selectors.getUser(state),
  }),
  {
    onBPMChange: shared.actions.bpmSet,
    onPause: shared.actions.playbackPauseRequestStarted,
    onPlay: shared.actions.playbackStartRequestStarted,
    onStop: shared.actions.playbackStopRequestStarted,
  },
)(SongEditor);
