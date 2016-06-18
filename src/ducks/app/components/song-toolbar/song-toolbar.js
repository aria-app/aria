import React from 'react';
import h from 'react-hyperscript';
import { compose, mapProps, pure, setDisplayName, setPropTypes } from 'recompose';
import shared from 'ducks/shared';
import transport from 'ducks/transport';
import './song-toolbar.scss';

const { Button, IconButton, Toolbar } = shared.components;
const { PAUSED, STARTED, STOPPED } = transport.constants.playbackStates;

const component = (props) => h(Toolbar, {
  className: 'song-toolbar',
  position: 'bottom',
  leftItems: [
    props.playbackButtons,
  ],
  rightItems: [
    h(Button, {
      text: 'Song Settings',
      onPress: () => console.log('Pressed Song Settings'),
    }),
  ],
});

const composed = compose([
  setDisplayName('SongToolbar'),
  pure,
  setPropTypes({
    bpm: React.PropTypes.number.isRequired,
    decrementMeasureCount: React.PropTypes.func.isRequired,
    incrementMeasureCount: React.PropTypes.func.isRequired,
    pause: React.PropTypes.func.isRequired,
    play: React.PropTypes.func.isRequired,
    playbackState: React.PropTypes.string.isRequired,
    setBPM: React.PropTypes.func.isRequired,
    stop: React.PropTypes.func.isRequired,
  }),
  mapProps((props) => ({
    ...props,
    playbackButtons: getPlaybackButtons(props),
  })),
])(component);

export const SongToolbar = composed;

function getPlaybackButtons(props) {
  return h('.song-toolbar__playback-buttons', [
    h(IconButton, {
      isActive: props.playbackState === STARTED,
      icon: 'play',
      onPress: () => props.play(),
    }),
    h(IconButton, {
      isActive: props.playbackState === PAUSED,
      icon: 'pause',
      onPress: () => props.pause(),
    }),
    h(IconButton, {
      isActive: props.playbackState === STOPPED,
      icon: 'stop',
      onPress: () => props.stop(),
    }),
  ]);
}