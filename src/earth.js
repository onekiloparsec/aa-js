// https://gist.github.com/wteuber/6241786
Math.fmod = function (a, b) {
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8))
}

function getEccentricity(JD) {
    const T = (JD - 2451545) / 36525
    const Tsquared = T * T
    return 1 - 0.002516 * T - 0.0000074 * Tsquared
}

function getSunMeanAnomaly(JD) {
    const T = (JD - 2451545) / 36525
    const Tsquared = T * T
    const Tcubed = Tsquared * T
    return Math.fmod(357.5291092 + 35999.0502909 * T - 0.0001536 * Tsquared + Tcubed / 24490000, 360)
}

module.exports = {
    getEccentricity,
    getSunMeanAnomaly
}
