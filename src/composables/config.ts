import config from '../../config.json'

export function useConfig() {
  return { ...config }
}
