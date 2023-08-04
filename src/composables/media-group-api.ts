import axios from 'axios'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useConfig } from '@/composables/config'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'
import { TagDto } from '@/dto/TagDto'

export function useMediaGroupApi() {
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
    return res.data?.map((d) => plainToInstance(TagDto, d)) || []
  }

  async function fetchAllMediasTaggedBy(id: number): Promise<MediaDto[]> {
    const res = await rest.get(`/tag/${id}/media`)
    return res.data?.map((d) => plainToInstance(MediaDto, d)) || []
  }

  async function fetchAllMediaGroupsTaggedBy(id: number): Promise<MediaGroupDto[]> {
    const res = await rest.get(`/tag/${id}/media-group`)
    return res.data?.map((d) => plainToInstance(MediaGroupDto, d)) || []
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
    fetchAllMediaGroupsTaggedBy
  }
}
