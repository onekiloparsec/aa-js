const constants = require('./constants')

function transformEclipticToEquatorial(Lambda, Beta, Epsilon) {
    const LambdaRad = Lambda * constants.DEGREES_TO_RADIANS
    const BetaRad = Beta * constants.DEGREES_TO_RADIANS
    const EpsilonRad = Epsilon * constants.DEGREES_TO_RADIANS

    let rightAscension = (Math.atan2(Math.sin(LambdaRad) * Math.cos(EpsilonRad) -
        Math.tan(BetaRad) * Math.sin(EpsilonRad), Math.cos(LambdaRad)))

    rightAscension *= constants.RADIANS_TO_HOURS

    if (rightAscension < 0) {
        rightAscension += 24
    }

    let declination = Math.asin(Math.sin(BetaRad) * Math.cos(EpsilonRad) +
        Math.cos(BetaRad) * Math.sin(EpsilonRad) * Math.sin(LambdaRad))

    declination *= constants.RADIANS_TO_DEGREES

    return {rightAscension: rightAscension, declination: declination}
}

module.exports = {
    transformEclipticToEquatorial
}