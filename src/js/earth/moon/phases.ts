import { Day, JulianDay } from '@/js/types'
import { MOON_PHASE_UPPER_LIMITS, MOON_SYNODIC_PERIOD, MoonPhase, MoonPhaseQuarter } from '@/js/constants'
import { getDecimalYear } from '@/js/times'
import { fmod } from '@/js/utils'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 12.3685 * (decimalYear - 2000)
  return decimalK >= 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

function getPhaseK (jd: JulianDay, phase: MoonPhaseQuarter): number {
  let k = getK(jd)
  if (phase === MoonPhaseQuarter.FirstQuarter) {
    k = k + 0.25
  } else if (phase == MoonPhaseQuarter.Full) {
    k = k + 0.5
  } else if (phase == MoonPhaseQuarter.LastQuarter) {
    k = k + 0.75
  }
  return k
}

/**
 * The time of a given Moon phase.
 * Results are already corrected for the Sun's aberration and by the Moon's light-time.
 * @param {JulianDay} jd The julian day
 * @param {MoonPhase} phase The requested phase
 * @return {JulianDay}
 * @memberof module:Earth
 */
export function getTimeOfMeanPhase (jd: JulianDay, phase: MoonPhaseQuarter): JulianDay {
  const k = getPhaseK(jd, phase)
  const T = k / 1236.85
  return 2451_550.097_66
    + 29.530_588_861 * k
    + 0.000_154_37 * Math.pow(T, 2)
    - 0.000_000_150 * Math.pow(T, 3)
    + 0.000_000_000_73 * Math.pow(T, 4)
}

/**
 * The age of the Moon cycle (0 = New Moon, MOON_SYNODIC_PERIOD/2 = Full Moon).
 * This is a low-accuracy age of the moon, using the average moon synodic period.
 * @param {JulianDay} jd The julian day
 * @return {JulianDay}
 * @memberof module:Earth
 */
export function getAge (jd: JulianDay): Day {
  let jdNewMoon = getTimeOfMeanPhase(jd - MOON_SYNODIC_PERIOD, MoonPhaseQuarter.New)
  if (jdNewMoon > jd) {
    jdNewMoon = jdNewMoon - MOON_SYNODIC_PERIOD
  }
  return fmod(jd - jdNewMoon, MOON_SYNODIC_PERIOD)
}

/**
 * The age name of the Moon cycle (New, WaxingCresent, FirstQuarter etc)
 * @param {JulianDay} jd The julian day
 * @return {MoonPhase} The moon phase name
 * @memberof module:Earth
 */
export function getAgeName (jd: JulianDay): MoonPhase {
  const frac = getAge(jd) / MOON_SYNODIC_PERIOD
  // Order matter since we wrote down only upper limits.
  if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.New])) {
    return MoonPhase.New
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.WaxingCrescent])) {
    return MoonPhase.WaxingCrescent
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.FirstQuarter])) {
    return MoonPhase.FirstQuarter
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.WaxingGibbous])) {
    return MoonPhase.WaxingGibbous
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.Full])) {
    return MoonPhase.Full
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.WaningGibbous])) {
    return MoonPhase.WaningGibbous
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.LastQuarter])) {
    return MoonPhase.LastQuarter
  } else if (frac <= (MOON_PHASE_UPPER_LIMITS[MoonPhase.WaningCrescent])) {
    return MoonPhase.WaningCrescent
  } else {
    return MoonPhase.New
  }
}
