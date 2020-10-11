import * as julianday from './julianday'

export function isDateAfterPapalReform(year: number, Month: number, Day: number): boolean {
  return ((year > 1582) || ((year === 1582) && (Month > 10)) || ((year === 1582) && (Month === 10) && (Day >= 15)))
}

export function isJulianDayAfterPapalReform(JD: number): boolean {
  return (JD >= 2299160.5)
}

export function getFullScaleJulianDay(year: number, Month: number, Day: number, isGregorianCalendar: boolean = true): number {
  let Y = year
  let M = Month
  if (M < 3) {
    Y = Y - 1
    M = M + 12
  }

  let B = 0
  if (isGregorianCalendar) {
    const A = Math.floor(Y / 100.0)
    B = 2 - A + Math.floor(A / 4.0)
  }

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + Day + B - 1524.5
}

export function isLeapYear(year: number, isGregorianCalendar: boolean = true): boolean {
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

export function fractionalYear(jd: number, isGregorianCalendar: boolean = true): number {
  const year = julianday.getDate(jd).getFullYear()
  const daysInYear = (isLeapYear(year, isGregorianCalendar)) ? 366 : 365
  return year + ((jd - getFullScaleJulianDay(year, 1, 1)) / daysInYear)
}

