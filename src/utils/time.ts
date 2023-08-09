export function durationToString(duration: number) {
  if (!duration) return null
  return `${Math.floor(duration / 3600)}:${Math.floor((duration % 3600) / 60)}:${Math.floor((duration % 3600) % 60)}`
}

export function stringToDuration(duration: string) {
  if (!duration) return null
  const [h, m, s] = duration.split(':')
  return +h * 3600 + +m * 60 + +s
}
