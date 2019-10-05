import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import withStyles from '@material-ui/styles/withStyles';
import sequenceEditor from '../../sequenceEditor';
import tracksEditor from '../../tracksEditor';
import SongEditorToolbar from './SongEditorToolbar';
import SongInfoModal from './SongInfoModal';

const { SequenceEditorContainer } = sequenceEditor.components;
const { TracksEditorContainer } = tracksEditor.components;

const styles = {
  root: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
};

class SongEditor extends React.PureComponent {
  static propTypes = {
    bpm: PropTypes.number,
    classes: PropTypes.object,
    onBPMChange: PropTypes.func,
    onPause: PropTypes.func,
    onPlay: PropTypes.func,
    onStop: PropTypes.func,
    playbackState: PropTypes.string,
    song: PropTypes.object,
  };

  state = {
    isSongInfoModalOpen: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.song.name !== this.props.song.name) {
      window.document.title = `${this.props.song.name} - Aria`;
    }
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        <SongEditorToolbar
          onPause={this.props.onPause}
          onPlay={this.props.onPlay}
          onSongInfoOpen={this.openSongInfo}
          onStop={this.props.onStop}
          playbackState={this.props.playbackState}
        />
        <Route
          component={TracksEditorContainer}
          exact={true}
          path={this.props.match.path}
        />
        <Route
          component={SequenceEditorContainer}
          exact={true}
          path={`${this.props.match.path}/sequencer/:sequenceId`}
        />
        <SongInfoModal
          bpm={this.props.bpm}
          isOpen={this.state.isSongInfoModalOpen}
          onBPMChange={this.props.onBPMChange}
          onConfirm={this.closeSongInfo}
          onReturnToDashboard={this.returnToDashboard}
          onSignOut={this.signOut}
          song={this.props.song}
        />
      </div>
    );
  }

  closeSongInfo = () => {
    this.setState({
      isSongInfoModalOpen: false,
    });
  };

  openSongInfo = () => {
    this.setState({
      isSongInfoModalOpen: true,
    });
  };

  returnToDashboard = () => {
    this.props.history.push('/');
  };

  signOut = () => {
    this.props.history.push('/sign-out');
  };
}

export default withStyles(styles)(SongEditor);
