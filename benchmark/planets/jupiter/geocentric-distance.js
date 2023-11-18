import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getGeocentricDistance',

  b.add('getGeocentricDistance high', () => {
    Jupiter.getGeocentricDistance(2451234.56)
  }),
  b.add('getGeocentricDistance low', () => {
    Jupiter.getGeocentricDistance(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
