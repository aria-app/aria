import { useTheme } from '@emotion/react';
import MuiBox, { BoxProps as MuiBoxProps } from '@material-ui/core/Box';
import getOr from 'lodash/fp/getOr';
import isNumber from 'lodash/fp/isNumber';
import { readableColor } from 'polished';
import { forwardRef, memo, useMemo } from 'react';

function getIsDarkColor(color) {
  return readableColor(color) === '#fff';
}

export interface BoxProps extends Omit<MuiBoxProps, 'ref'> {
  interactive?: boolean;
  interactiveColor?: string;
  sx?: MuiBoxProps['sx'] & Record<string, any>;
  [key: string]: unknown;
}

export const Box = memo(
  forwardRef<HTMLElement, BoxProps>((props, ref) => {
    const {
      component,
      interactive,
      interactiveColor: interactiveColorProp,
      sx = {},
      ...rest
    } = props;
    const theme = useTheme();

    const interactiveColor = useMemo(() => {
      if (!interactive) return;

      if (interactiveColorProp) {
        const resolvedInteractiveColor = getOr(
          undefined,
          `palette.${interactiveColorProp}`,
          theme,
        );
        if (resolvedInteractiveColor) {
          return resolvedInteractiveColor;
        }
      }

      const backgroundColor = getOr(
        theme.palette.background.default,
        `palette.${sx.backgroundColor}`,
        theme,
      );
      return readableColor(backgroundColor);
    }, [interactive, interactiveColorProp, sx, theme]);

    return (
      <MuiBox
        component={component}
        ref={ref}
        sx={{
          ...(interactive
            ? {
                '&::after': {
                  backgroundColor: interactiveColor,
                  bottom: 0,
                  content: '""',
                  display: interactive ? 'block' : 'none',
                  left: 0,
                  pointerEvents: 'none',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  opacity: 0,
                  transition: 'opacity 100ms ease',
                },
                ':hover::after': {
                  opacity: getIsDarkColor(interactiveColor) ? 0.1 : 0.2,
                },
                ':active::after': {
                  opacity: getIsDarkColor(interactiveColor) ? 0.25 : 0.4,
                },
              }
            : {}),
          ...sx,
          bottom: isNumber(sx.bottom) ? theme.spacing(sx.bottom) : sx.bottom,
          cursor: sx.cursor || (interactive && 'pointer'),
          left: isNumber(sx.left) ? theme.spacing(sx.left) : sx.left,
          overflow: sx.overflow || (interactive && 'hidden'),
          position: sx.position || (interactive && 'relative'),
          right: isNumber(sx.right) ? theme.spacing(sx.right) : sx.right,
          top: isNumber(sx.top) ? theme.spacing(sx.top) : sx.top,
        }}
        {...rest}
      />
    );
  }),
);
