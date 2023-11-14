import * as b from 'benny'
import { juliandays, risetransitset, STANDARD_ALTITUDE_STARS } from '@'

const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
const jd = juliandays.getJulianDay(date)
const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }


b.suite(
  'rise transit set',

  b.add('getRiseTransitSetTimes high', () => {
    risetransitset.getRiseTransitSetTimes(jd, coordsVenus, coordsBoston)
  }),
  b.add('getRiseTransitSetTimes low', () => {
    risetransitset.getRiseTransitSetTimes(jd, coordsVenus, coordsBoston, STANDARD_ALTITUDE_STARS, false)
  }),

  b.cycle(),
  b.complete(),
)
