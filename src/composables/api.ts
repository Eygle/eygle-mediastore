import axios from 'axios'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useConfig } from '@/composables/config'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'
import { TagDto } from '@/dto/TagDto'

export function useApi() {
  const config = useConfig()
  const rest = axios.create({ baseURL: config.api, responseType: 'json' })

  function createMedia(data: MediaDto) {
    return rest.post('/media', instanceToPlain(data))
  }

  async function fetchMedias(parent: number) {
    const res = await rest.get(`/media/?filters[parent]=${parent}`)
    return res.data.map((data) => plainToInstance(MediaGroupDto, data))
  }

  async function createMediaGroup(data: MediaGroupDto): Promise<MediaGroupDto | null> {
    const res = await rest.post<unknown>('/media-group', instanceToPlain(data))
    return res?.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  async function fetchMediaGroups(field: Field) {
    const res = await rest.get(`/media-group/${field}`)
    return res.data.map((data) => plainToInstance(MediaGroupDto, data))
  }

  async function getMediaGroupById(id: number) {
    const res = await rest.get(`/media-group?filters[id]=${id}`)
    return res.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  async function findMediaGroupByName(name: string) {
    const res = await rest.get(`/media-group?filters[name]=${name}`)
    return res.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  async function fetchTags() {
    const res = await rest.get('/tag')
    return res.data?.map((d) => plainToInstance(TagDto, d)) || []
  }

  async function findTagsByName(name: string) {
    const res = await rest.get(`/tag?filters[name]=${name}`)
    return (res.data?.map((d) => plainToInstance(TagDto, d)) || []).sort((a, b) => {
      if (a.title.startsWith(name) && !b.title.startsWith(name)) return -1
      if (b.title.startsWith(name) && !a.title.startsWith(name)) return 1
      return a.title.localeCompare(b.title)
    })
  }

  async function fetchAllMediasTaggedBy(id: number): Promise<MediaDto[]> {
    const res = await rest.get(`/tag/${id}/media`)
    return res.data?.map((d) => plainToInstance(MediaDto, d)) || []
  }

  async function fetchAllMediaGroupsTaggedBy(id: number): Promise<MediaGroupDto[]> {
    const res = await rest.get(`/tag/${id}/media-group`)
    return res.data?.map((d) => plainToInstance(MediaGroupDto, d)) || []
  }

  async function updateMediaGroup(group: MediaGroupDto): Promise<MediaGroupDto | null> {
    const res = await rest.patch(`/media-group/${group.id}`, group)
    return res.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  async function updateMediaGroupTags(parent: MediaGroupDto, tags: TagDto[]): Promise<MediaGroupDto | null> {
    const res = await rest.patch(`/media-group/${parent.id}/tags`, tags)
    return res.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  async function updateMedia(media: MediaDto): Promise<MediaDto | null> {
    const res = await rest.patch(`/media/${media.id}`, instanceToPlain(media))
    return res.data ? plainToInstance(MediaDto, res.data as unknown) : null
  }

  async function updateMediaTags(parent: MediaDto, tags: TagDto[]): Promise<MediaDto | null> {
    const res = await rest.patch(`/media/${parent.id}/tags`, tags)
    return res.data ? plainToInstance(MediaDto, res.data as unknown) : null
  }

  async function updateTag(tag: TagDto): Promise<TagDto | null> {
    const res = await rest.patch(`/tag/${tag.id}`, tag)
    return res.data ? plainToInstance(TagDto, res.data as unknown) : null
  }

  async function deleteTag(tag: TagDto): Promise<TagDto | null> {
    const res = await rest.delete(`/tag/${tag.id}`)
    return res.data
  }

  async function mergeTags(selected: number, tags: number[]): Promise<boolean> {
    const res = await rest.patch(`/tag/${selected}/merge-into`, tags)
    return res.data
  }

  return {
    createMediaGroup,
    fetchMediaGroups,
    getMediaGroupById,
    findMediaGroupByName,
    createMedia,
    fetchMedias,
    fetchTags,
    findTagsByName,
    fetchAllMediasTaggedBy,
    fetchAllMediaGroupsTaggedBy,
    updateMediaGroup,
    updateMediaGroupTags,
    updateMedia,
    updateMediaTags,
    mergeTags,
    updateTag,
    deleteTag,
  }
}
