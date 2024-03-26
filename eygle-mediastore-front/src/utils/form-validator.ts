const isNullOrUndefined = (value: unknown) => value === null || value === undefined
const isEmpty = (value: unknown) => isNullOrUndefined(value) || value === ''

const isDateValid = (d) => d instanceof Date && !isNaN(d)

const required =
  (msg = 'This field is required.') =>
  (v: unknown) =>
    !isEmpty(v) || msg

const date =
  (msg = 'The date must be in the format yyyy-mm-dd') =>
  (v: string) =>
    isEmpty(v) || isDateValid(new Date(v)) || msg

const numeric =
  (msg = 'This value must be a number') =>
  (v: string) =>
    isEmpty(v) || /^\d+$/.test(v) || msg

const duration =
  (msg = 'This value must bo of format [hh:][mm:]ss') =>
  (v: string) =>
    isEmpty(v) || /^(?:[0-5]?\d:){0,2}[0-5]?\d$/.test(v) || msg

export const rules = { date, duration, required, numeric }
