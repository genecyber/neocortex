
var BoundedScalarEncoder = require('./boundedScalar.js')

var encoder = new BoundedScalarEncoder({
  min: 0, max: 1,
  w: 11, n: 1024
})

setInterval(function () {
  console.log(encoder.encode(Math.random()))
  console.log(encoder.outputRange)
}, 2000)
