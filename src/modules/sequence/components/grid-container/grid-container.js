import { connect } from 'react-redux';
import { Grid } from '../grid/grid';
import panning from 'modules/panning';
import sound from 'modules/sound';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

export const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

function mapStateToProps(state) {
  return {
    isPanning: panning.selectors.getIsPanning(state),
    scale: selectors.getScale(state),
    toolType: selectors.getToolType(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    playNote: (...args) => dispatch(sound.actions.playNote(...args)),
    setScrollLeftIfChanged: (...args) => dispatch(actions.setScrollLeftIfChanged(...args)),
    startPanning: (...args) => dispatch(panning.actions.start(...args)),
    updateMousePosition: (...args) => dispatch(actions.updateMousePosition(...args)),
    updatePanning: (...args) => dispatch(panning.actions.update(...args)),
  };
}
