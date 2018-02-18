function DMSToDegrees(d, m, s, positive = true) {
    if (!positive) {
        assert(Degrees >= 0)  //All parameters should be non negative if the "bPositive" parameter is false
        assert(Minutes >= 0)
        assert(Seconds >= 0)
    }

    if (positive) {
        return d + m / 60 + s / 3600
    } else {
        return -1 * d - m / 60 - s / 3600
    }
}

module.exports = {
    DMSToDegrees
}