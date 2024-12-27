import * as b from 'benny'
import * as juliandays from '@/js/juliandays.ts'
import * as coordinates from '@/js/coordinates.ts'

const jd = juliandays.getJulianDay()
const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }

b.suite(
  'coordinates',

  b.add('getParallacticAngle', () => {
    coordinates.getParallacticAngle(jd, coordsBoston, coordsVenus)
  }),

  b.cycle(),
  b.complete()
)
