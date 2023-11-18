import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates high', () => {
    Venus.getApparentGeocentricEquatorialCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEquatorialCoordinates low', () => {
    Venus.getApparentGeocentricEquatorialCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
