
var BoundedScalarEncoder = require('./boundedScalar.js')

var ans = new Array(256);

for (var i = 0; i < 256; i++) {
    var num = i;
    var c = 0;
    while (num) {
        num = num & (num - 1);
        c++;
    }
    ans[i] = c;
}

var eightBits = ans

function count (arr) {
    var c = 0;
    for (var i = 0; i < arr.length; i++) {
        c += (eightBits[arr[i] & 0xff] +
        eightBits[(arr[i] >> 8) & 0xff] +
        eightBits[(arr[i] >> 16) & 0xff] +
        eightBits[(arr[i] >> 24) & 0xff]);
    }
    return c;
}

function and (arr1, arr2) {
    var ans = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++)
        ans[i] = arr1[i] & arr2[i];
    return ans;
}

function or (arr1, arr2) {
    var ans = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++)
        ans[i] = arr1[i] | arr2[i];
    return ans;
}

function xor (arr1, arr2) {
    var ans = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++)
        ans[i] = arr1[i] ^ arr2[i];
    return ans;
}

function not (arr) {
    var ans = new Array(arr.length);
    for (var i = 0; i < ans.length; i++)
        ans[i] = ~arr[i];
    return ans;
}

function getBit (arr, n) {
    var index = n >> 5;
    var mask = 1 << (31 - n % 32);
    return Boolean(arr[index] & mask);
}

function setBit (arr, n, val) {
    var index = n >> 5;
    var mask = 1 << (31 - n % 32);
    if (val)
        arr[index] = mask | arr[index];
    else
        arr[index] = ~mask & arr[index];
    return arr;
}

function toBinaryString (arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        var obj = (arr[i] >>> 0).toString(2);
        str += '00000000000000000000000000000000'.substr(obj.length) + obj;
    }
    return str;
}

function parseBinaryString (str) {
    var len = str.length / 32;
    var ans = new Array(len);
    for (var i = 0; i < len; i++) {
        ans[i] = parseInt(str.substr(i*32, 32), 2) | 0;
    }
    return ans;
}

function toHexString (arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        var obj = (arr[i] >>> 0).toString(16);
        str += '00000000'.substr(obj.length) + obj;
    }
    return str;
}

function parseHexString (str) {
    var len = str.length / 8;
    var ans = new Array(len);
    for (var i = 0; i < len; i++) {
        ans[i] = parseInt(str.substr(i*8, 8), 16) | 0;
    }
    return ans;
}

function toDebug (arr) {
    var binary = toBinaryString(arr);
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        str += '0000'.substr((i * 32).toString(16).length) + (i * 32).toString(16) + ':';
        for (var j = 0; j < 32; j += 4) {
            str += ' ' + binary.substr(i * 32 + j, 4);
        }
        if (i < arr.length - 1) str += '\n';
    }
    return str
}

var bitArray = {
    count: count,
    and: and,
    or: or,
    xor: xor,
    not: not,
    getBit: getBit,
    setBit: setBit,
    toBinaryString: toBinaryString,
    parseBinaryString: parseBinaryString,
    toHexString: toHexString,
    parseHexString: parseHexString,
    toDebug: toDebug
}


var max = 256

var encoder = new BoundedScalarEncoder({
    min: 0, max: max,
    w: 30, n: max,
})

var columns = []

for(var i = 0; i < 256; i++) {
  var potentials = []
  for (var z = 0; z < 256; z++) {
    potentials.push(Math.random()*max)
  }
  columns.push(bitArray.toBinaryString(potentials))
}

setInterval(function () {
  var y = parseInt(Math.random()*max)
  console.log('> ', y)
  var r = encoder.encode(y)
  var activated = 0
  var spacialpool = []
  for (var i = 0; i < 256; i++) { spacialpool.push(0) }
  var limit = 11;
  columns.forEach(function (c, index) {
    var score = bitArray.count(bitArray.and(r, c.split('')))
    if (score > 6 && activated < limit) {
      console.log(score)
      activated++
      spacialpool[index] = 1
    }
  })
  console.log('spacial pool ', spacialpool.slice(0, 20))
  console.log('activated ', activated)
}, 2000)
