import app from '../features/app';
import moving from '../features/moving';
import notes from '../features/notes';
import panning from '../features/panning';
import playing from '../features/playing';
import resizing from '../features/resizing';
import selecting from '../features/selecting';
import sequencing from '../features/sequencing';
import shortcuts from '../features/shortcuts';
import song from '../features/song';
import tracking from '../features/tracking';
import transport from '../features/transport';

export default function* saga() {
  yield [
    app.saga(),
    moving.saga(),
    notes.saga(),
    panning.saga(),
    playing.saga(),
    resizing.saga(),
    selecting.saga(),
    sequencing.saga(),
    shortcuts.saga(),
    song.saga(),
    tracking.saga(),
    transport.saga(),
  ];
}