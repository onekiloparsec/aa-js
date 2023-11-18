import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates high', () => {
    Mercury.getApparentGeocentricEclipticCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEclipticCoordinates low', () => {
    Mercury.getApparentGeocentricEclipticCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
