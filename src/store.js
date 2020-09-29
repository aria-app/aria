import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { configureStore } from '@reduxjs/toolkit';

import createReducerManager from './createReducerManager';
import audio from './features/audio';
import song from './features/song';
import user from './features/user';

const epicMiddleware = createEpicMiddleware();

export const reducerManager = createReducerManager({
  user: user.reducer,
});

const store = configureStore({
  devTools: {
    actionsBlacklist: [audio.actions.positionRequestSucceeded.type],
  },
  middleware: [epicMiddleware],
  reducer: reducerManager.reduce,
});

epicMiddleware.run(combineEpics(audio.epic, song.epic, user.epic));

export default store;