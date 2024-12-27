import { getDecimalYear } from '@/js/times'
import * as juliandays from '@/js/juliandays'

describe('dates', () => {
  test('decimal year', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1978, 9, 15)))
    const decimalYear = getDecimalYear(jd)
    expect(decimalYear).toBeCloseTo(1978.79, 2)
  })
})
