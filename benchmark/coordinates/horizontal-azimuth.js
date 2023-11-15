import * as b from 'benny'
import * as juliandays from '@/juliandays.ts'
import * as coordinates from '@/coordinates.ts'

const jd = juliandays.getJulianDay()
const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }

b.suite(
  'coordinates',

  b.add('getHorizontalAzimuth high', () => {
    coordinates.getHorizontalAzimuth(jd, coordsBoston, coordsVenus)
  }),
  b.add('getHorizontalAzimuth low', () => {
    coordinates.getHorizontalAzimuth(jd, coordsBoston, coordsVenus, false)
  }),

  b.cycle(),
  b.complete()
)
