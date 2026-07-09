import { Media } from '../media/media.entity';
import { MediaGroup } from '../media-group/media-group.entity';

export function groupByParents(mediaList: Media[]) {
  // Media of the same parent may share the parent instance (relation loaded
  // with the 'query' strategy), so groups are collected by id, never by
  // instance identity
  const parents = new Map<number, MediaGroup>();

  for (const media of mediaList) {
    let parent = parents.get(media.parent.id);
    if (!parent) {
      parent = media.parent;
      parent.media = [];
      parents.set(parent.id, parent);
    }
    parent.media.push(media);
    delete media.parent;
  }

  return [...parents.values()];
}
