import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates high', () => {
    Uranus.getApparentGeocentricEquatorialCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEquatorialCoordinates low', () => {
    Uranus.getApparentGeocentricEquatorialCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
