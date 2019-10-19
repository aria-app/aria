import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import shared from '../../shared';
import dawww from '../dawww';
import * as selectors from '../selectors';

export default function subscribeToPositionEpic(action$, state$) {
  return action$.pipe(
    ofType(shared.actions.INITIALIZED),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      Observable.create(observer =>
        dawww.onPositionChange(position => {
          const prevPosition = selectors.getPosition(state);

          if (position === prevPosition) return;

          observer.next(shared.actions.positionRequestSucceeded(position));
        }),
      ),
    ),
  );
}
