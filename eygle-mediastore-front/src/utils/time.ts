export function durationToString(duration: number) {
  if (!duration) return null
  const h = Math.floor(duration / 3600)
  const m = Math.floor((duration % 3600) / 60)
  const s = Math.floor((duration % 3600) % 60)
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

export function stringToDuration(duration: string) {
  if (!duration) return null
  let [h, m, s] = duration.split(':')

  if (s === undefined) {
    s = m === undefined ? h : m
    m = m === undefined ? '0' : h
    h = '0'
  }

  return +h * 3600 + +m * 60 + +s
}
