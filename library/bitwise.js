

function createBinaryString(nMask) {
  // nMask must be between -2147483648 and 2147483647
  for (var nFlag = 0, nShifted = nMask, sMask = ''; nFlag < 32;
       nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
  return sMask;
}

setInterval(function () {
var string1 = createBinaryString(Math.floor(Math.random()*100));

console.log(string1);
}, 2000)
