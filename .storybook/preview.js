import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import shared from '../src/features/shared';

const { Shell } = shared.components;
const { changeLanguage } = shared.i18n;

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'jp', right: '🇯🇵', title: '日本語' },
      ],
    },
  },
};

export const parameters = {
  backgrounds: {
    values: [
      { name: 'Default', value: shared.theme.palette.background.default },
      { name: 'Paper', value: shared.theme.palette.background.paper },
    ],
  },
  layout: 'centered',
};

export const decorators = [
  (Story, context) => {
    React.useEffect(() => {
      changeLanguage(context.globals.locale);
    }, [context.globals.locale]);

    return (
      <MuiThemeProvider theme={shared.theme}>
        <ThemeProvider theme={shared.theme}>
          <Shell style={{ display: 'none' }} />
          <Story />
        </ThemeProvider>
      </MuiThemeProvider>
    );
  },
];
