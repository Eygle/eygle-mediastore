import axios from 'axios'
import { MediaGroupDto } from '@/dto/MediaGroupDto'
import { useConfig } from '@/composables/config'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Field } from '@/types/Field'
import { MediaDto } from '@/dto/MediaDto'

export function useMediaGroupApi() {
  const config = useConfig()
  const rest = axios.create({ baseURL: config.api, responseType: 'json' })

  function createMedia(data: MediaDto) {
    return rest.post('/media', instanceToPlain(data))
  }

  async function createMediaGroup(data: MediaGroupDto): Promise<MediaGroupDto | null> {
    const res = await rest.post<unknown>('/media-group', instanceToPlain(data))
    return res?.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  async function fetchMediaGroups(field: Field) {
    const res = await rest.get(`/media-group/${field}`)
    return res.data.map((data) => plainToInstance(MediaGroupDto, data))
  }

  async function findMediaGroupByName(name: string) {
    const res = await rest.get(`/media-group?filters[name]=${name}`)
    return res.data ? plainToInstance(MediaGroupDto, res.data as unknown) : null
  }

  return { createMediaGroup, fetchMediaGroups, findMediaGroupByName, createMedia }
}
