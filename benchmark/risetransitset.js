import * as b from 'benny'
import { juliandays, STANDARD_ALTITUDE_STARS } from '@'
import { getRiseTransitSetTimes } from '@/risetransitset'

const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
const jd = juliandays.getJulianDay(date)
const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }


b.suite(
  'rise transit set',

  b.add('getRiseTransitSetTimes', () => {
    getRiseTransitSetTimes(jd, coordsVenus, coordsBoston)
  }),

  b.cycle(),
  b.complete(),
)
