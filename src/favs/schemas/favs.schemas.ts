import { Album } from 'src/album/schemas/album.schemas';
import { Artist } from 'src/artist/schemas/artist.schemas';
import { Track } from 'src/track/schemas/track.schemas';

export class Fav {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
