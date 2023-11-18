import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates high', () => {
    Venus.getApparentGeocentricEclipticCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEclipticCoordinates low', () => {
    Venus.getApparentGeocentricEclipticCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
