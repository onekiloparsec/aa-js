require('./constants')

function MapTo0To360Range(Degrees) {
    let fResult = Math.fmod(Degrees, 360)
    if (fResult < 0) {
        fResult += 360
    }
    return fResult
}

function MapToMinus90To90Range(Degrees) {
    let fResult = MapTo0To360Range(Degrees)

    if (fResult > 270) {
        fResult = fResult - 360
    } else if (fResult > 180) {
        fResult = 180 - fResult
    } else if (fResult > 90) {
        fResult = 180 - fResult
    }

    return fResult
}

module.exports = {
    MapTo0To360Range,
    MapToMinus90To90Range
}