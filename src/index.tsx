import '@emotion/core';

import { render } from 'react-dom';
import { configure as configureHotkeys } from 'react-hotkeys';
import { RecoilRoot } from 'recoil';
import * as Tone from 'tone';

import { ApolloWrapper } from './ApolloWrapper';
import { App } from './features/app';
import { AudioProvider } from './features/audio';
import { AuthProvider } from './features/auth';
import { I18NWrapper } from './i18n';

configureHotkeys({ ignoreRepeatedEventsWhenKeyHeldDown: false });

['keydown', 'mousedown', 'touchdown'].forEach((eventName) => {
  document.body.addEventListener(eventName, () => {
    Tone.start();
  });
});

render(
  <RecoilRoot>
    <ApolloWrapper>
      <AuthProvider>
        <AudioProvider>
          <I18NWrapper>
            <App />
          </I18NWrapper>
        </AudioProvider>
      </AuthProvider>
    </ApolloWrapper>
  </RecoilRoot>,
  document.querySelector('#root'),
);
