import Decimal from '@/decimal'
import { Day, JulianDay } from '@/types'
import { MOON_SYNODIC_PERIOD, MoonPhase } from '@/constants'
import { fmod } from '@/utils'
import { getDecimalYear } from '@/dates'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getDecimalYear(jd)
  const decimalK = new Decimal('12.3685').mul(decimalYear.minus('2000'))
  return decimalK.isPositive() ? Decimal.floor(decimalK) : Decimal.ceil(decimalK)
}

function getPhaseK (jd: JulianDay | number, phase: MoonPhase): Decimal {
  let k = getK(jd)
  if (phase === MoonPhase.FirstQuarter) {
    k = k.plus(0.25)
  } else if (phase == MoonPhase.Full) {
    k = k.plus(0.5)
  } else if (phase == MoonPhase.LastQuarter) {
    k = k.plus(0.75)
  }
  return k
}

/**
 * The time of a given Moon phase.
 * Results are already corrected for the Sun's aberration and by the Moon's light-time.
 * @param {JulianDay} jd The julian day
 * @param {MoonPhase} phase The requested phase
 * @return {JulianDay}
 */
export function getTimeOfMeanPhase (jd: JulianDay | number, phase: MoonPhase): JulianDay {
  const k = getPhaseK(jd, phase)
  const T = k.dividedBy('1236.85')
  return new Decimal('2451_550.097_66')
    .plus(new Decimal('29.530_588_861').mul(k))
    .plus(new Decimal('0.000_154_37').mul(T.pow(2)))
    .minus(new Decimal('0.000_000_150').mul(T.pow(3)))
    .plus(new Decimal('0.000_000_000_73').mul(T.pow(4)))
}

/**
 * The age of the Moon cycle (0 = New Moon, MOON_SYNODIC_PERIOD/2 = Full Moon).
 * This is a low-accuracy age of the moon, using the average moon synodic period.
 * @param {JulianDay} jd The julian day
 * @return {JulianDay}
 */
export function getAge (jd: JulianDay | number): Day {
  const djd = new Decimal(jd)
  let jdNewMoon = getTimeOfMeanPhase(djd.minus(MOON_SYNODIC_PERIOD), MoonPhase.New)
  if (jdNewMoon.greaterThan(djd)) {
    jdNewMoon = jdNewMoon.minus(MOON_SYNODIC_PERIOD)
  }
  return fmod(djd.minus(jdNewMoon), MOON_SYNODIC_PERIOD)
}
