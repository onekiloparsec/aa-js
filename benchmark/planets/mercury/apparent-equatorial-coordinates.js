import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates high', () => {
    Mercury.getApparentGeocentricEquatorialCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEquatorialCoordinates low', () => {
    Mercury.getApparentGeocentricEquatorialCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
