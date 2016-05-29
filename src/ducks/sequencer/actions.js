import _ from 'lodash';
import notes from 'ducks/notes';
import shared from 'ducks/shared';
import * as actionTypes from './action-types';
import * as selectors from './selectors';

const { toolTypes } = shared.constants;

export function setMousePoint(mousePoint) {
  return {
    type: actionTypes.SET_MOUSE_POINT,
    mousePoint,
  };
}

export function setScrollLeft(scrollLeft) {
  return {
    type: actionTypes.SET_SCROLL_LEFT,
    scrollLeft,
  };
}

export function setScrollLeftIfChanged(scrollLeft) {
  return (dispatch, getState) => {
    const prevScrollLeft = selectors.getScrollLeft(getState());

    if (prevScrollLeft === scrollLeft) return;

    dispatch(setScrollLeft(scrollLeft));
  };
}

export function setScrollTop(scrollTop) {
  return {
    type: actionTypes.SET_SCROLL_TOP,
    scrollTop,
  };
}

export function setScrollTopIfChanged(scrollTop) {
  return (dispatch, getState) => {
    const prevScrollTop = selectors.getScrollTop(getState());

    if (prevScrollTop === scrollTop) return;

    dispatch(setScrollTop(scrollTop));
  };
}

export function setSynths(synths) {
  return {
    type: actionTypes.SET_SYNTHS,
    synths,
  };
}

export function setToolType(toolType) {
  return (dispatch) => {
    if (_.includes([toolTypes.DRAW, toolTypes.ERASE], toolType)) {
      dispatch(notes.actions.selectNotes([]));
    }
    dispatch(setToolTypeInner(toolType));
  };
}

export function setToolTypeInner(toolType) {
  return {
    type: actionTypes.SET_TOOL_TYPE,
    toolType,
  };
}

export function updateMousePoint(mousePoint) {
  return (dispatch, getState) => {
    const prevMousePoint = selectors.getMousePoint(getState());

    if (_.isEqual(prevMousePoint, mousePoint)) return;

    dispatch(setMousePoint(mousePoint));
  };
}