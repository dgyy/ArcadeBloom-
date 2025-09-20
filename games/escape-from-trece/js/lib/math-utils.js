const mathUtils = {}

mathUtils.degreesToRadians = function (degrees) {
    return - (degrees * Math.PI / 180)
}

mathUtils.zCompare = function (a, b) {
    return a.z - b.z
}
