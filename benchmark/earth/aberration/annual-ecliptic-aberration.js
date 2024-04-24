import * as b from 'benny'
import { Earth, sexagesimal, coordinates } from '@'

const ra = sexagesimal.getDecimalValue(16, 54, 0.14) // in hours
const dec = sexagesimal.getDecimalValue(-39, 50, 44.9)
const equCoords = { rightAscension: ra* H2DEG, declination: dec }
const eclCoords = coordinates.transformEquatorialToEcliptic(equCoords)

export default b.suite(
  'Earth aberration getAnnualEclipticAberration',

  b.add('getAnnualEclipticAberration high', () => {
    Earth.getAnnualEclipticAberration(2451234.56, eclCoords)
  }),
  b.add('getAnnualEclipticAberration low', () => {
    Earth.getAnnualEclipticAberration(2451234.56, eclCoords, false)
  }),

  b.cycle(),
  b.complete(),
)
