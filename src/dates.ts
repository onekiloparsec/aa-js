import Decimal from '@/decimal'
import { JulianDay } from '@/types'
import { getDate } from '@/juliandays'

export function isDateAfterPapalReform (year: number, Month: number, Day: number): boolean {
  return ((year > 1582) || ((year === 1582) && (Month > 10)) || ((year === 1582) && (Month === 10) && (Day >= 15)))
}

export function isJulianDayAfterPapalReform (jd: JulianDay | number): boolean {
  return new Decimal(jd).greaterThanOrEqualTo(2299160.5)
}

export function getFullScaleJulianDay (Year: Decimal | number, Month: Decimal | number, Day: Decimal | number, isGregorianCalendar: boolean = true): JulianDay {
  let Y = new Decimal(Year)
  let M = new Decimal(Month)
  let D = new Decimal(Day)
  if (M.lessThan(3)) {
    Y = Y.minus(1)
    M = M.plus(12)
  }

  let B = new Decimal(0)
  if (isGregorianCalendar) {
    const A = Decimal.floor(Y.dividedBy(100.0))
    B = new Decimal(2).minus(A).plus(Decimal.floor(A.dividedBy(4.0)))
  }

  return Decimal.floor(new Decimal(365.25).mul(Y.plus(4716)))
    .plus(Decimal.floor(new Decimal(30.6001).mul(M.plus(1))))
    .plus(D)
    .plus(B)
    .minus(1524.5)
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

export function getFractionalYear (jd: JulianDay | number, isGregorianCalendar: boolean = true): Decimal {
  const year = getDate(jd).getFullYear()
  const daysInYear = (isLeapYear(year, isGregorianCalendar)) ? 366 : 365
  return new Decimal(year).plus(new Decimal(jd).minus(getFullScaleJulianDay(year, 1, 1))).dividedBy(daysInYear)
}

