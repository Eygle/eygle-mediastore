import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaGroup } from '../media-group/media-group.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Field } from '../types/Field';
import { Media } from '../media/media.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(MediaGroup)
    private mediaGroupRepository: Repository<MediaGroup>,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  // Following bug where tags where not added to parent throughout UpsertTagsDialog
  async synchronizeParentTags() {
    const groups = await this.mediaGroupRepository.find({
      where: [
        { field: In([Field.Profile, Field.Star]) },
        { parent: Not(IsNull()) },
      ],
      relations: { tags: true, media: { tags: true, parent: true } },
    });

    const res = [];
    const toSave: MediaGroup[] = [];
    for (const group of groups) {
      const groupTagIds = group.tags.map(({ id }) => id);
      const missingTags = [];
      for (const { tags } of group.media) {
        for (const tag of tags) {
          if (
            !groupTagIds.includes(tag.id) &&
            !missingTags.find(({ id }) => tag.id === id)
          ) {
            missingTags.push(tag);
          }
        }
      }

      if (missingTags.length) {
        group.tags.push(...missingTags);
        toSave.push(await this.mediaGroupRepository.preload(group));
        res.push({
          id: group.id,
          name: group.name,
          addedTags: missingTags.map(({ title }) => title),
        });
      }
    }
    if (toSave.length) {
      await this.mediaGroupRepository.save(toSave);
    }
    return res;
  }

  async changeFilesPath() {
    const oldPath = '/media/eygle/DD 10 To/';
    const newPath = '/mnt/dd-10-to/';
    const mediaList = await this.mediaRepository.find();

    mediaList.forEach((media) =>
      media.files.forEach(
        (file, idx) => (media.files[idx] = file.replace(oldPath, newPath)),
      ),
    );
    await this.mediaRepository.save(mediaList);
    return 'OK';
  }
}
