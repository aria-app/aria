import classnames from 'classnames';
import find from 'lodash/fp/find';
import first from 'lodash/fp/first';
import includes from 'lodash/fp/includes';
import last from 'lodash/fp/last';
import React from 'react';
import h from 'react-hyperscript';
import shared from '../../../shared';
import './note.scss';

export class Note extends React.PureComponent {
  static propTypes = {
    className: React.PropTypes.string,
    note: React.PropTypes.object.isRequired,
    onErase: React.PropTypes.func.isRequired,
    onMoveStart: React.PropTypes.func.isRequired,
    onResizeStart: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    selectedNotes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    toolType: React.PropTypes.string.isRequired,
  }

  static defaultProps = {
    isSelected: false,
  }

  render() {
    return h('.note', {
      className: this.getClassName(),
      style: this.getStyle(),
    }, [
      h('.note__point.note__point--start', {
        onMouseDown: this.handleStartPointMouseDown,
        onMouseUp: this.handleStartPointMouseUp,
      }, [
        h('.note__point__fill.note__point__fill--start'),
      ]),
      h('.note__point-connector', {
        style: this.getConnectorStyle(),
      }),
      h('.note__point.note__point--end', {
        onMouseDown: this.handleEndPointMouseDown,
        style: this.getEndPointStyle(),
      }, [
        h('.note__point__fill.note__point__fill--end'),
      ]),
    ]);
  }

  getClassName() {
    return classnames({
      'note--active': this.getIsSelected(),
    }, this.props.className);
  }

  getConnectorStyle() {
    const startPoint = first(this.props.note.points);
    const endPoint = last(this.props.note.points);
    const { asin, abs, PI, sign, sqrt } = Math;
    const x = ((endPoint.x - startPoint.x) * 40);
    const y = (endPoint.y - startPoint.y) * 40;
    const scale = x !== 0
      ? sqrt(abs((x ** 2) + (y ** 2)))
      : 0;
    const rotation = x !== 0
      ? asin(abs(y / scale)) * (180 / PI) * sign(y)
      : 0;
    return {
      transform: `rotate(${rotation}deg) scaleX(${scale})`,
    };
  }

  getEndPointStyle() {
    const startPoint = first(this.props.note.points);
    const endPoint = last(this.props.note.points);
    const x = (endPoint.x - startPoint.x) * 40;
    const y = (endPoint.y - startPoint.y) * 40;
    return {
      display: is32ndNote(this.props.note) ? 'none' : 'flex',
      transform: `translate(${x}px, ${y}px)`,
    };
  }

  getIsSelected() {
    return !!find({
      id: this.props.note.id,
    })(this.props.selectedNotes);
  }

  getIsEraseEnabled = () =>
    includes(this.props.toolType, [
      shared.constants.toolTypes.ERASE,
    ]);

  getIsSelectEnabled = () =>
    includes(this.props.toolType, [
      shared.constants.toolTypes.DRAW,
      shared.constants.toolTypes.SELECT,
    ]);

  getStyle() {
    const { x, y } = first(this.props.note.points);
    return {
      transform: `translate(${x * 40}px, ${y * 40}px)`,
    };
  }

  handleEndPointMouseDown = (e) => {
    if (this.getIsSelectEnabled()) {
      e.stopPropagation();
      this.select(e);
      this.props.onResizeStart();
    }
  }

  handleStartPointMouseDown = (e) => {
    if (this.getIsSelectEnabled()) {
      e.stopPropagation();
      if (this.getIsSelected() && !(e.ctrlKey || e.metaKey)) {
        this.props.onMoveStart();
        return;
      }
      this.select(e);
      this.props.onMoveStart();
    }
  }

  handleStartPointMouseUp = () => {
    if (this.getIsEraseEnabled()) {
      this.props.onErase(this.props.note);
    }
  }

  select = e =>
    this.props.onSelect(
      e.ctrlKey || e.metaKey,
      this.props.note,
    );
}

function is32ndNote(note) {
  const length = last(note.points).x - first(note.points).x;
  return length === 0;
}
