import Decimal from 'decimal.js'
import { DEG2H, DEG2RAD, H2RAD, RAD2DEG, RAD2H } from '@/constants'
import { Degree, Hour, Radian } from '@/types'

declare module 'decimal.js' {
  interface Decimal {
    degreesToRadians (): Radian;

    degreeToHours (): Hour;

    hoursToRadians (): Radian;

    hoursToDegrees (): Degree;

    radiansToDegrees (): Degree;

    radiansToHours (): Hour;
  }
}

Decimal.prototype.degreesToRadians = function (): Radian {
  return this.mul(DEG2RAD)
}

Decimal.prototype.degreeToHours = function (): Hour {
  return this.mul(DEG2H)
}

Decimal.prototype.hoursToRadians = function (): Radian {
  return this.mul(H2RAD)
}

Decimal.prototype.hoursToDegrees = function (): Degree {
  return this.mul(DEG2H)
}

Decimal.prototype.radiansToDegrees = function (): Degree {
  return this.mul(RAD2DEG)
}

Decimal.prototype.radiansToHours = function (): Hour {
  return this.mul(RAD2H)
}

export default Decimal
