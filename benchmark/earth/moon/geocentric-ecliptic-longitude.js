import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'moon coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Earth.Moon.getGeocentricEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Earth.Moon.getGeocentricEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
  // b.save({ file: 'moon_coordinates_geocentric_ecliptic_longitude', version: '1.0.0' }),
  // b.save({ file: 'moon_coordinates_geocentric_ecliptic_longitude', format: 'chart.html' })
)
