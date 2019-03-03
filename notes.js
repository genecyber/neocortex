
function encoder (input) {
if (input > 5) return;
var mapped = [
[1,0,0,0,0],
[0,1,0,0,0],
[0,0,1,0,0],
[0,0,0,1,0],
[0,0,0,0,1],
]
return mapped[Math.floor(input)]
}
var incro = 0
setInterval(function () {
console.log(encoder(incro++))
if(incro > 4) incro = 0;
}, 5000)

// matrix of columns
[column
[cell]
[cell]
[cell]
]

potential connections
[spacial pooling vector]


spacial pooling

input vector

spacial pooling columns

each columns has a potential pool

store this using a bit array, the cells that are not
 connected are 1 and connected are 0's this is inverted
 if the pool is small.

permanance ranking 

100 [0-1] banks
010 [2-3]
110 [4-5]
111 [5-6]
011 [7-8]

[indexes of connected pool]

[
bank 1 [ indexes from connected pool ...
bank 2 [ ...
bank 3 [ etc

spacial pooler

encoding
[input vector]

spacial poolin columns
map potential pool
calculate active pool from overlaps



