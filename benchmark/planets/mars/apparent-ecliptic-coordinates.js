import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates high', () => {
    Mars.getApparentGeocentricEclipticCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEclipticCoordinates low', () => {
    Mars.getApparentGeocentricEclipticCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
