export function pluralize(value: number, singular: string, plural?: string) {
  return `${value} ${value < 2 ? singular : plural || `${singular}s`}`
}
