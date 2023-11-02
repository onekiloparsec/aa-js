/**
 @module Mercury
 */
import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, Equinox, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: {@link https://ssd.jpl.nasa.gov/?planet_phys_par}
 * @property {Kilometer} equatorialRadius Planet's equatorial radius
 * @property {Kilometer} meanRadius Planet's mean radius
 * @property {Kilogram24} mass Planet's mass
 * @property {GramPerCubicCentimeter} bulkDensity Planet's bulk density
 * @property {Day} siderealRotationPeriod Planet's sidereal rotation period
 * @property {Year} siderealOrbitPeriod Planet's orbit rotation period
 * @property {Magnitude} visualMagnitude Planet's visual magnitude
 * @property {Albedo} geometricAlbedo Planet's geometric albedo
 * @property {MeterPerSquareSecond} equatorialGravity Planet's equatorial gravity
 * @property {KilometerPerSecond} Planet's escale velocity
 * @memberof module:Mercury
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal('2440.53'),
  meanRadius: new Decimal('2439.4'),
  mass: new Decimal('0.330114'),
  bulkDensity: new Decimal('5.4291'),
  siderealRotationPeriod: new Decimal('58.6462'),
  siderealOrbitPeriod: new Decimal('0.2408467'),
  visualMagnitude: new Decimal('-0.60'),
  geometricAlbedo: new Decimal('0.106'),
  equatorialGravity: new Decimal('3.70'),
  escapeVelocity: new Decimal('4.25')
}


/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 * @memberof module:Mercury
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: ['0.387_098_310', '0', '0', '0']
    .map(v => new Decimal(v)) as LengthArray<AstronomicalUnit, 4>,

  eccentricity: ['0.205_631_75', '0.000_020_407', '-0.000_000_0283', '-0.000_000_000_18']
    .map(v => new Decimal(v)) as LengthArray<Decimal, 4>,

  [Equinox.MeanOfTheDate]: {
    meanLongitude: ['252.250_906', '149474.072_2491', '0.000_303_50', '0.000_000_018']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: ['7.004_986', '0.001_8215', '-0.000_018_10', '0.000_000_056']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: ['48.330_893', '1.186_1883', '0.000_175_42', '0.000_000_215']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: ['77.456_119', '1.556_4776', '0.000_295_44', '0.000_000_009']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>
  },

  [Equinox.StandardJ2000]: {
    meanLongitude: ['252.250_906', '149472.674_6358', '-0.000_005_36', '0.000_000_002']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: ['7.004_986', '-0.005_9516', '0.000_000_80', '0.000_000_043']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: ['48.330_893', '-0.125_4227', '-0.000_088_33', '-0.000_000_200']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: ['77.456_119', '0.158_8643', '-0.000_013_42', '-0.000_000_007']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>
  }
}
