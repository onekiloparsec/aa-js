import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates', () => {
    Uranus.getApparentGeocentricEclipticCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
