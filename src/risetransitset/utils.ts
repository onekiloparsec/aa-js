import { Hour, JulianDay } from '@/types'
import dayjs from 'dayjs'
import { getDate, getJulianDay } from '@/juliandays'
import { getSexagesimalValue } from '@/sexagesimal'

export function getJDatUTC (jd: JulianDay | number, utc: Hour | number): JulianDay {
  const utcMoment = dayjs.utc(getDate(jd))
  const sexa = getSexagesimalValue(utc)
  return getJulianDay(
    utcMoment
      .hour(sexa.radix.toNumber())
      .minute(sexa.minutes.toNumber())
      .second(sexa.seconds.toNumber())
      .toDate()
  )!
}
