/**
 @module Dates
 */
import { Day, JulianDay, Month, Year } from '@/js/types'
import { getDate, getJulianDay } from '@/js/juliandays'

export function isDateAfterPapalReform (year: number, Month: number, Day: number): boolean {
  return ((year > 1582) || ((year === 1582) && (Month > 10)) || ((year === 1582) && (Month === 10) && (Day >= 15)))
}

export function isJulianDayAfterPapalReform (jd: JulianDay): boolean {
  return jd >= 2299160.5
}

export function getFullScaleJulianDay (Year: Year, Month: Month, Day: Day, isGregorianCalendar: boolean = true): JulianDay {
  if (Month < 3) {
    Year = Year - 1
    Month = Month + 12
  }
  
  let B = 0
  if (isGregorianCalendar) {
    const A = Math.floor(Year / 100.0)
    B = 2 - A + Math.floor(A / 4)
  }
  
  return Math.floor(365.25 * (Year + 4716)) + (Math.floor(30.6001 * (Month + 1))) + Day + B - 1524.5
}

export function isLeapYear (year: number, isGregorianCalendar: boolean = true): boolean {
  if (isGregorianCalendar) {
    if ((year % 100) === 0) {
      return ((year % 400) === 0)
    } else {
      return ((year % 4) === 0)
    }
  } else {
    return ((year % 4) === 0)
  }
}

export function getFractionalYear (jd: JulianDay, isGregorianCalendar: boolean = true): number {
  const year = getDate(jd).getFullYear()
  const daysInYear = (isLeapYear(year, isGregorianCalendar)) ? 366 : 365
  return year + (jd - getFullScaleJulianDay(year, 1, 1)) / daysInYear
}


export function getDecimalYear (jd: JulianDay, isGregorianCalendar: boolean = true): number {
  const year = getDate(jd).getFullYear()
  const daysInYear = (isLeapYear(year, isGregorianCalendar)) ? 366 : 365
  const januaryFirstDate = new Date(Date.UTC(year, 0, 0, 0, 0, 0, 0))
  return year + (jd - (getJulianDay(januaryFirstDate)!)) / daysInYear
}
