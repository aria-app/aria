import React from 'react';
import h from 'react-hyperscript';
import { compose, pure, setDisplayName, setPropTypes } from 'recompose';
import sequencer from 'ducks/sequencer';
import shared from 'ducks/shared';
import './app.scss';

const { SequencerContainer } = sequencer.components;
const { doOnMount } = shared.helpers;

const component = () => h('.app', [
  h(SequencerContainer),
]);

const composed = compose([
  pure,
  setDisplayName('App'),
  setPropTypes({
    loadSong: React.PropTypes.func,
  }),
  doOnMount((props) => {
    props.loadSong();
  }),
])(component);

export const App = composed;