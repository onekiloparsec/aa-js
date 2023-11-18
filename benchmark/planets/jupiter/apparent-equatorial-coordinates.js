import * as b from 'benny'
import * as juliandays from '@/juliandays.ts'
import { Jupiter } from '@'

const jd = juliandays.getJulianDay()

b.suite(
  'Jupiter getPlanetaryDetails',

  b.add('getLocalSiderealTime', () => {
    Jupiter.getPlanetaryDetails(jd)
  }),

  b.cycle(),
  b.complete(),
)
