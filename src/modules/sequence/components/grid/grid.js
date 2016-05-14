import { PropTypes } from 'react';
import h from 'react-hyperscript';
import { compose, pure, setPropTypes } from 'recompose';
import fence from 'modules/fence';
import notes from 'modules/notes';
import * as constants from '../../constants';
import { SlotsContainer } from '../slots-container/slots-container';
import { ElementRefProvider } from '../element-ref-provider/element-ref-provider';
import {
  PositionMarkerContainer,
} from '../position-marker-container/position-marker-container';
import './grid.scss';

const { FenceContainer } = fence.components;
const { NotesContainer } = notes.components;

const component = ({
  playNote,
  scale,
  toolType,
}) => h('.grid', [
  h('.grid__wrapper', [
    h(SlotsContainer, {
      playNote,
      scale,
      toolType,
    }),
    h(ElementRefProvider, {},
      h(NotesContainer, {
        playNote,
        toolType,
        toolTypes: constants.toolTypes,
      })
    ),
    h(FenceContainer),
    h(PositionMarkerContainer),
  ]),
]);

const composed = compose([
  setPropTypes({
    playNote: PropTypes.func,
    scale: PropTypes.array,
    toolType: PropTypes.string,
  }),
  pure,
])(component);

export const Grid = composed;
