import PropTypes from 'prop-types';
import React from 'react';
import h from 'react-hyperscript';
import shared from '../../../shared';
import './SongToolbar.scss';

const { Button, DownloadButton, IconButton, Toolbar } = shared.components;
const { PAUSED, STARTED, STOPPED } = shared.constants.playbackStates;

export class SongToolbar extends React.PureComponent {
  static propTypes = {
    bpm: PropTypes.number.isRequired,
    onBPMModalOpen: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    playbackState: PropTypes.string.isRequired,
    stringifiedSong: PropTypes.string.isRequired,
  }

  render() {
    return h(Toolbar, {
      className: 'song-toolbar',
      position: 'bottom',
      leftItems: [
        h('.song-toolbar__playback-buttons', [
          h(IconButton, {
            className: 'song-toolbar__playback-buttons__play-pause-button',
            isActive: this.getIsPlayPauseButtonActive(),
            icon: this.getPlayPauseButtonIcon(),
            onClick: this.handlePlayPauseButtonClick,
          }),
          h(IconButton, {
            className: 'song-toolbar__playback-buttons__stop-button',
            isActive: this.props.playbackState === STOPPED,
            icon: 'stop',
            onClick: this.handleStopButtonClick,
          }),
        ]),
      ],
      rightItems: [
        h(Button, {
          className: 'song-toolbar__clear-cache-button',
          text: 'clear cache',
          onClick: this.handleClearCacheClick,
        }),
        h(Button, {
          className: 'song-toolbar__set-bpm-button',
          text: `BPM ${this.props.bpm}`,
          onClick: this.props.onBPMModalOpen,
        }),
        h(DownloadButton, {
          className: 'song-toolbar__download-song-button',
          content: this.props.stringifiedSong,
          filename: 'song.json',
          text: 'Download Song',
        }),
      ],
    });
  }

  getIsPlayPauseButtonActive = () => (
    this.props.playbackState === STARTED ||
    this.props.playbackState === PAUSED
  );

  getPlayPauseButtonIcon = () => ({
    PAUSED: 'play',
    STARTED: 'pause',
    STOPPED: 'play',
  })[this.props.playbackState];

  handleClearCacheClick = () => {
    window.localStorage.removeItem('currentSong');
    window.location.reload();
  }

  handlePlayPauseButtonClick = () => {
    if (this.props.playbackState === STARTED) {
      this.props.onPause();
      return;
    }

    this.props.onPlay();
  };

  handleStopButtonClick = () => {
    if (this.props.playbackState === STOPPED) return;
    this.props.onStop();
  };
}