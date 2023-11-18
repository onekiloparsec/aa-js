import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates high', () => {
    Mars.getApparentGeocentricEquatorialCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEquatorialCoordinates low', () => {
    Mars.getApparentGeocentricEquatorialCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
