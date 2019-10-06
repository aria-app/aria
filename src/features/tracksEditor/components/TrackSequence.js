import classnames from 'classnames';
import withStyles from '@material-ui/styles/withStyles';
import { transparentize } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import TrackSequenceNote from './TrackSequenceNote';

const styles = theme => ({
  root: {
    display: 'flex',
    height: 84,
    padding: theme.spacing(1),
    backgroundColor: transparentize(0.4, theme.palette.primary.main),
    borderRadius: theme.shape.borderRadius,
    borderRight: `2px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    position: 'relative',
    transition:
      'box-shadow 250ms ease, opacity 500ms ease, transform 150ms ease',
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
  },
  dragging: {
    opacity: 0.8,
  },
});

function TrackSequence(props) {
  const { classes, isDragging, isSelected, onOpen, onSelect, sequence } = props;

  const handleClick = React.useCallback(() => {
    if (isSelected) return;

    onSelect(sequence);
  }, [isSelected, onSelect, sequence]);

  const handleDoubleClick = React.useCallback(() => {
    onOpen(sequence);
  }, [onOpen, sequence]);

  return (
    <div
      className={classnames(classes.root, {
        [classes.dragging]: isDragging,
        [classes.selected]: isSelected,
      })}
      style={{ width: measureCountToPx(sequence.measureCount) }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {sequence.notes.map(note => (
        <TrackSequenceNote
          isSequenceSelected={isSelected}
          key={note.id}
          note={note}
        />
      ))}
    </div>
  );
}

TrackSequence.propTypes = {
  classes: PropTypes.object,
  isDragging: PropTypes.bool,
  isSelected: PropTypes.bool,
  onOpen: PropTypes.func,
  onSelect: PropTypes.func,
  sequence: PropTypes.object.isRequired,
};

export default React.memo(withStyles(styles)(TrackSequence));

function measureCountToPx(count) {
  return count * 4 * 8 * 2;
}
