'use strict'

const constants = require('./constants')
const coordinates = require('./coordinates')
const earth = require('./earth')
const fk5 = require('./fk5')
const nutation = require('./nutation')
const sexagesimal = require('./sexagesimal')
const utils = require('./utils')

function getGeometricEclipticLongitude(JD) {
    return utils.MapTo0To360Range(earth.getEclipticLongitude(JD) + 180)
}

function getGeometricEclipticLatitude(JD) {
    return -earth.getEclipticLatitude(JD)
}

function getGeometricEclipticLongitudeJ2000(JD) {
    return utils.MapTo0To360Range(earth.getEclipticLongitudeJ2000(JD) + 180)
}

function getGeometricEclipticLatitudeJ2000(JD) {
    return -earth.getEclipticLatitudeJ2000(JD)
}

function getGeometricFK5EclipticLongitude(JD) {
    //Convert to the FK5 stystem
    let Longitude = getGeometricEclipticLongitude(JD)
    const Latitude = getGeometricEclipticLatitude(JD)
    Longitude += fk5.getCorrectionInLongitude(Longitude, Latitude, JD)
    return Longitude
}

function getGeometricFK5EclipticLatitude(JD) {
    //Convert to the FK5 stystem
    const Longitude = getGeometricEclipticLongitude(JD)
    let Latitude = getGeometricEclipticLatitude(JD)
    Latitude += fk5.getCorrectionInLatitude(Longitude, JD)
    return Latitude
}

function getApparentEclipticLongitude(JD) {
    let Longitude = getGeometricFK5EclipticLongitude(JD)

    //Apply the correction in longitude due to nutation
    Longitude += sexagesimal.DMSToDegrees(0, 0, nutation.getNutationInLongitude(JD))

    //Apply the correction in longitude due to aberration
    const R = earth.getRadiusVector(JD)
    Longitude -= sexagesimal.DMSToDegrees(0, 0, 20.4898 / R)

    return Longitude
}

function getApparentEclipticLatitude(JD) {
    return getGeometricFK5EclipticLatitude(JD)
}

// CAA3DCoordinate
// CAASun::EquatorialRectangularCoordinatesMeanEquinox(double
// JD, bool
// bHighPrecision
// )
// {
//     double
//     Longitude = CAACoordinateTransformation::DegreesToRadians(GeometricFK5EclipticLongitude(JD, bHighPrecision))
//     double
//     Latitude = CAACoordinateTransformation::DegreesToRadians(GeometricFK5EclipticLatitude(JD, bHighPrecision))
//     double
//     R = CAAEarth::RadiusVector(JD, bHighPrecision)
//     double
//     epsilon = CAACoordinateTransformation::DegreesToRadians(CAANutation::MeanObliquityOfEcliptic(JD))
//
//     CAA3DCoordinate
//     value
//     value.X = R * cos(Latitude) * cos(Longitude)
//     value.Y = R * (cos(Latitude) * sin(Longitude) * cos(epsilon) - sin(Latitude) * sin(epsilon))
//     value.Z = R * (cos(Latitude) * sin(Longitude) * sin(epsilon) + sin(Latitude) * cos(epsilon))
//
//     return value
// }
//
// CAA3DCoordinate
// CAASun::EclipticRectangularCoordinatesJ2000(double
// JD, bool
// bHighPrecision
// )
// {
//     double
//     Longitude = GeometricEclipticLongitudeJ2000(JD, bHighPrecision)
//     Longitude = CAACoordinateTransformation::DegreesToRadians(Longitude)
//     double
//     Latitude = GeometricEclipticLatitudeJ2000(JD, bHighPrecision)
//     Latitude = CAACoordinateTransformation::DegreesToRadians(Latitude)
//     double
//     R = CAAEarth::RadiusVector(JD, bHighPrecision)
//
//     CAA3DCoordinate
//     value
//     double
//     coslatitude = cos(Latitude)
//     value.X = R * coslatitude * cos(Longitude)
//     value.Y = R * coslatitude * sin(Longitude)
//     value.Z = R * sin(Latitude)
//
//     return value
// }
//
// CAA3DCoordinate
// CAASun::EquatorialRectangularCoordinatesJ2000(double
// JD, bool
// bHighPrecision
// )
// {
//     CAA3DCoordinate
//     value = EclipticRectangularCoordinatesJ2000(JD, bHighPrecision)
//     value = CAAFK5::ConvertVSOPToFK5J2000(value)
//
//     return value
// }
//
// CAA3DCoordinate
// CAASun::EquatorialRectangularCoordinatesB1950(double
// JD, bool
// bHighPrecision
// )
// {
//     CAA3DCoordinate
//     value = EclipticRectangularCoordinatesJ2000(JD, bHighPrecision)
//     value = CAAFK5::ConvertVSOPToFK5B1950(value)
//
//     return value
// }
//
// CAA3DCoordinate
// CAASun::EquatorialRectangularCoordinatesAnyEquinox(double
// JD, double
// JDEquinox, bool
// bHighPrecision
// )
// {
//     CAA3DCoordinate
//     value = EquatorialRectangularCoordinatesJ2000(JD, bHighPrecision)
//     value = CAAFK5::ConvertVSOPToFK5AnyEquinox(value, JDEquinox)
//
//     return value
// }

function getVariationGeometricEclipticLongitude(JD) {
    //D is the number of days since the epoch
    const D = JD - 2451545.00
    const tau = (D / 365250)
    const tau2 = tau * tau
    const tau3 = tau2 * tau

    const deltaLambda = 3548.193
        + 118.568 * Math.sin(constants.DEGREES_TO_RADIANS(87.5287 + 359993.7286 * tau))
        + 2.476 * Math.sin(constants.DEGREES_TO_RADIANS(85.0561 + 719987.4571 * tau))
        + 1.376 * Math.sin(constants.DEGREES_TO_RADIANS(27.8502 + 4452671.1152 * tau))
        + 0.119 * Math.sin(constants.DEGREES_TO_RADIANS(73.1375 + 450368.8564 * tau))
        + 0.114 * Math.sin(constants.DEGREES_TO_RADIANS(337.2264 + 329644.6718 * tau))
        + 0.086 * Math.sin(constants.DEGREES_TO_RADIANS(222.5400 + 659289.3436 * tau))
        + 0.078 * Math.sin(constants.DEGREES_TO_RADIANS(162.8136 + 9224659.7915 * tau))
        + 0.054 * Math.sin(constants.DEGREES_TO_RADIANS(82.5823 + 1079981.1857 * tau))
        + 0.052 * Math.sin(constants.DEGREES_TO_RADIANS(171.5189 + 225184.4282 * tau))
        + 0.034 * Math.sin(constants.DEGREES_TO_RADIANS(30.3214 + 4092677.3866 * tau))
        + 0.033 * Math.sin(constants.DEGREES_TO_RADIANS(119.8105 + 337181.4711 * tau))
        + 0.023 * Math.sin(constants.DEGREES_TO_RADIANS(247.5418 + 299295.6151 * tau))
        + 0.023 * Math.sin(constants.DEGREES_TO_RADIANS(325.1526 + 315559.5560 * tau))
        + 0.021 * Math.sin(constants.DEGREES_TO_RADIANS(155.1241 + 675553.2846 * tau))
        + 7.311 * tau * Math.sin(constants.DEGREES_TO_RADIANS(333.4515 + 359993.7286 * tau))
        + 0.305 * tau * Math.sin(constants.DEGREES_TO_RADIANS(330.9814 + 719987.4571 * tau))
        + 0.010 * tau * Math.sin(constants.DEGREES_TO_RADIANS(328.5170 + 1079981.1857 * tau))
        + 0.309 * tau2 * Math.sin(constants.DEGREES_TO_RADIANS(241.4518 + 359993.7286 * tau))
        + 0.021 * tau2 * Math.sin(constants.DEGREES_TO_RADIANS(205.0482 + 719987.4571 * tau))
        + 0.004 * tau2 * Math.sin(constants.DEGREES_TO_RADIANS(297.8610 + 4452671.1152 * tau))
        + 0.010 * tau3 * Math.sin(constants.DEGREES_TO_RADIANS(154.7066 + 359993.7286 * tau))

    return deltaLambda
}


class Sun {
    constructor(jd) {
        this.julianDay = jd
    }

    radiusVector() {
        return getRadiusVector(this.julianDay)
    }

    eclipticCoordinates() {
        return {
            longitude: getGeometricEclipticLongitude(this.julianDay),
            latitude: getGeometricEclipticLatitude(this.julianDay)
        }
    }

    eclipticCoordinatesJ2000() {
        return {
            longitude: getGeometricEclipticLongitudeJ2000(this.julianDay),
            latitude: getGeometricEclipticLatitudeJ2000(this.julianDay)
        }
    }

    apparentEclipticCoordinates() {
        return {
            longitude: getApparentEclipticLongitude(this.julianDay),
            latitude: getApparentEclipticLatitude(this.julianDay)
        }
    }

    equatorialCoordinates() {
        return coordinates.transformEclipticToEquatorial(
            getGeometricEclipticLongitude(this.julianDay),
            getGeometricEclipticLatitude(this.julianDay),
            nutation.getMeanObliquityOfEcliptic(this.julianDay)
        )
    }

    equatorialCoordinatesJ2000() {
        return coordinates.transformEclipticToEquatorial(
            getGeometricEclipticLongitudeJ2000(this.julianDay),
            getGeometricEclipticLatitudeJ2000(this.julianDay),
            nutation.getMeanObliquityOfEcliptic(this.julianDay)
        )
    }

    apparentEquatorialCoordinates() {
        return coordinates.transformEclipticToEquatorial(
            getApparentEclipticLongitude(this.julianDay),
            getApparentEclipticLatitude(this.julianDay),
            nutation.getTrueObliquityOfEcliptic(this.julianDay)
        )
    }
}

module.exports = {
    getGeometricEclipticLongitude,
    getGeometricEclipticLatitude,
    getGeometricEclipticLongitudeJ2000,
    getGeometricEclipticLatitudeJ2000,
    getGeometricFK5EclipticLongitude,
    getGeometricFK5EclipticLatitude,
    getApparentEclipticLongitude,
    getApparentEclipticLatitude,
    getVariationGeometricEclipticLongitude,
    Sun
}
