import { Media } from '../media/media.entity';
import { MediaGroup } from '../media-group/media-group.entity';

export function groupByParents(mediaList: Media[]) {
  return mediaList.reduce((acc: MediaGroup[], media) => {
    const parent = acc.find(({ id }) => id === media.parent.id) || media.parent;

    if (parent === media.parent) {
      acc.push(parent);
      parent.media = [];
    }
    parent.media.push(media);
    delete media.parent;
    return acc;
  }, []);
}
