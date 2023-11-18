import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates high', () => {
    Uranus.getApparentGeocentricEclipticCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEclipticCoordinates low', () => {
    Uranus.getApparentGeocentricEclipticCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
