import { Hour, JulianDay } from '@/types'
import dayjs from 'dayjs'
import { getDate, getJulianDay } from '@/juliandays'
import { getSexagesimalValue } from '@/sexagesimal'

export function getJDatUTC (jd: JulianDay, utc: Hour): JulianDay {
  const utcMoment = dayjs.utc(getDate(jd))
  const sexa = getSexagesimalValue(utc)
  return getJulianDay(
    utcMoment
      .hour(sexa.radix)
      .minute(sexa.minutes)
      .second(sexa.seconds)
      .toDate()
  )!
}
