import * as b from 'benny'
import { Earth, Equinox } from '@'

export default b.suite(
  'Earth coordinates getEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Earth.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Earth.getEclipticLongitude(2451234.56, Equinox.MeanOfTheDate, false)
  }),

  b.cycle(),
  b.complete(),
)
