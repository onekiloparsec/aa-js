import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, Equinox, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal('24764'),
  meanRadius: new Decimal('24622'),
  mass: new Decimal('102.4126'),
  bulkDensity: new Decimal('1.638'),
  siderealRotationPeriod: new Decimal('0.67125'),
  siderealOrbitPeriod: new Decimal('164.79132'),
  visualMagnitude: new Decimal('-6.87'),
  geometricAlbedo: new Decimal('0.41'),
  equatorialGravity: new Decimal('11.15'),
  escapeVelocity: new Decimal('23.56')
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: ['30.110_386_869', '-0.000_000_1663, 0']
    .map(v => new Decimal(v)) as LengthArray<AstronomicalUnit, 4>,

  eccentricity: ['0.009_455_75', '0.000_006_033', '0', '-0.000_000_000_05']
    .map(v => new Decimal(v)) as LengthArray<Decimal, 4>,

  [Equinox.MeanOfTheDate]: {
    meanLongitude: ['304.348_665', '219.883_3092', '0.000_308_82', '0.000_000_018']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: ['1.769_953', '-0.009_3082', '-0.000_007_08', '0.000_000_27']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: ['131.784_057', '1.102_2039', '0.000_259_52', '-0.000_000_637']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: ['48.120_276', '1.426_2957', '0.000_384_34', '0.000_000_020']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,
  },

  [Equinox.StandardJ2000]: {
    meanLongitude: ['304.348_665', '218.486_2002', '0.000_000_59', '-0.000_000_002']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: ['1.769_953', '0.000_2256', '0.000_000_23', '0']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: ['131.784_057', '-0.006_1651', '-0.000_002_19', '-0.000_000_078']
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: ['48.120_276', '0.029_1866', '0.000_076_10', 0]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>

  }
}
