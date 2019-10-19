import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import shared from '../../shared';
import dawww from '../dawww';

export default function subscribeToPlaybackStateEpic(action$) {
  return action$.pipe(
    ofType(shared.actions.INITIALIZED),
    mergeMap(() =>
      Observable.create(observer =>
        dawww.onStateChange(playbackState => {
          observer.next(
            shared.actions.playbackStateRequestSucceeded(playbackState),
          );
        }),
      ),
    ),
  );
}
