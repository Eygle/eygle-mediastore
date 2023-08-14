import { TransformFnParams } from 'class-transformer/types/interfaces'
import { TransformationType } from 'class-transformer'

export function dtoDateTransform({ value, type }: TransformFnParams) {
  if (type === TransformationType.CLASS_TO_CLASS) return value
  if (!value) return value
  const d = new Date(value)

  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
    .getDate()
    .toString()
    .padStart(2, '0')}`
}
