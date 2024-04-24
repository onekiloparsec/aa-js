import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getGeocentricDistance',

  b.add('getGeocentricDistance', () => {
    Jupiter.getGeocentricDistance(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
