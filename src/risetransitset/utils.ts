import { Hour, JulianDay } from '@/types'
import { getDate, getJulianDay } from '@/juliandays'
import { getSexagesimalValue } from '@/sexagesimal'

export function getJDatUTC (jd: JulianDay, utc: Hour): JulianDay {
  const d = getDate(jd)
  const sexa = getSexagesimalValue(utc)
  return getJulianDay(new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
    sexa.radix, sexa.minutes, sexa.seconds
  )))!
}
