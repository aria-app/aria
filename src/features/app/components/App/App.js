import PropTypes from 'prop-types';
import React from 'react';
import h from 'react-hyperscript';
import keydown from 'react-keydown';
import { hideIf, showIf } from 'react-render-helpers';
import sequencer from '../../../sequencer';
import shared from '../../../shared';
import tracker from '../../../tracker';
import { BPMModal } from '../BPMModal/BPMModal';
import { UploadOverlay } from '../UploadOverlay/UploadOverlay';
import { SongToolbar } from '../SongToolbar/SongToolbar';
import './App.scss';

const { SequencerContainer } = sequencer.components;
const { STARTED } = shared.constants.playbackStates;
const { TrackerContainer } = tracker.components;

export class App extends React.PureComponent {
  static propTypes = {
    bpm: PropTypes.number.isRequired,
    isSequenceOpen: PropTypes.bool.isRequired,
    onBPMChange: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
    playbackState: PropTypes.string.isRequired,
    stringifiedSong: PropTypes.string.isRequired,
  }

  state = {
    isBPMModalOpen: false,
    isFileOver: false,
  };

  render() {
    return h('.app', {
      onDragEnter: this.handleDragEnter,
      onDragOver: this.handleDragOver,
      onDrop: this.handleDrop,
    }, [
      showIf(this.props.isSequenceOpen)(
        h(SequencerContainer),
      ),
      hideIf(this.props.isSequenceOpen)(
        h(TrackerContainer),
      ),
      h(SongToolbar, {
        bpm: this.props.bpm,
        onBPMModalOpen: this.handleSongToolbarBPMModalOpen,
        onPause: this.props.onPause,
        onPlay: this.props.onPlay,
        onStop: this.props.onStop,
        playbackState: this.props.playbackState,
        stringifiedSong: this.props.stringifiedSong,
      }),
      h(BPMModal, {
        bpm: this.props.bpm,
        isOpen: this.state.isBPMModalOpen,
        onBPMChange: this.props.onBPMChange,
        onConfirm: this.handleBPMModalConfirm,
      }),
      h(UploadOverlay, {
        isFileOver: this.state.isFileOver,
        onCancel: this.handleUploadOverlayCancel,
        onUpload: this.handleUploadOverlayUpload,
      }),
    ]);
  }

  handleBPMModalConfirm = () => {
    this.setState({
      isBPMModalOpen: false,
    });
  }

  handleDragEnter = (e) => {
    this.setState({
      isFileOver: true,
    });
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleSongToolbarBPMModalOpen = () => {
    this.setState({
      isBPMModalOpen: true,
    });
  };

  handleUploadOverlayCancel = () => {
    this.setState({
      isFileOver: false,
    });
  }

  handleUploadOverlayUpload = (data) => {
    this.props.onUpload({
      song: data,
    });
    this.setState({
      isFileOver: false,
    });
  }

  @keydown('enter')
  playPause() {
    if (this.props.playbackState === STARTED) {
      this.props.onPause();
    } else {
      this.props.onPlay();
    }
  }

  @keydown('esc')
  stop() {
    this.props.onStop();
  }
}
