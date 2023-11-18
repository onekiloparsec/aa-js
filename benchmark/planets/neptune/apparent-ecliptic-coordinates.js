import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates high', () => {
    Neptune.getApparentGeocentricEclipticCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEclipticCoordinates low', () => {
    Neptune.getApparentGeocentricEclipticCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
