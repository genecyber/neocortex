
var neocortex = require('.')
var BoundedScalarEncoder = require('./boundedScalar.js')

var encoder = new BoundedScalarEncoder({
    min: 0, max: 1,
    w: 1, n: 5,
})

var notes = {
  'a' : [ 0 ],
  'b' : [ 1 ],
  'c' : [ 2 ],
  'd' : [ 3 ],
  'e' : [ 4 ]
}

var params = {
  columnCount: 5, // 1-1024
  cellsPerColumn: 10, // 1-32
  activationThreshold: 13, // 1-128
  initialPermanence: 50, // 1-100
  connectedPermanence: 50, // 1-100
  minThreshold: 5, // 1-128
  maxNewSynapseCount: 16, // 1-32
  permanenceIncrement: 10, // 1-100
  permanenceDecrement: 10, // 1-100
  predictedSegmentDecrement: 5, // 1-100
  maxSegmentsPerCell: 128, // 1-128
  maxSynapsesPerSegment: 128, // 1-128
  potentialPercent: 50, // 1-100
  sparsity: 2, // 1-100,
  potentialPercent: 10,
  tpPotentialPercent: 2,
  tpSparsity: 10,
  historyLength: 4,
  meanLifetime: 4,
  excitationMin: 10,
  excitationMax: 20,
  excitationXMidpoint: 5,
  excitationSteepness: 1,
  weightActive: 1,
  weightPredictedActive: 4,
  forwardPermananceIncrement: 2,
  backwardPermananceIncrement: 1
}

params.excitationMin = parseFloat( params.excitationMin );
params.excitationMax = parseFloat( params.excitationMax );
params.excitationXMidpoint = parseFloat( params.excitationXMidpoint );
params.excitationSteepness = parseFloat( params.excitationSteepness );

var TM_LAYER   = 0; // Receives distal input from own cells
var TP_LAYER   = 1;

var controller = new neocortex ()

controller.clear();
controller.createLayer( params, TM_LAYER );

// Create the pooling layer
// params.potentialPercent = params.tpPotentialPercent;
// controller.createLayer(params, TP_LAYER, [0]);
// var xx = 0
// setInterval(function () {
//   var _k = (Math.random() > 0.5)  ? 'e' : 'f'
//   //console.log(_k)
//   var _note = notes[_k]
//   controller.spatialPooling(0, [_note], true);
//   controller.temporalMemory(0, true);
//   controller.spatialPooling( 1, [], true );
//   controller.temporalMemory( 1, true );
//   controller.inputMemory(0);
//   var answer = predict ()
//   if (_k === answer) {
//     console.log(_k, ' :: ', answer)
//   } else {console.log('.')}
// }, 2500)

setInterval(function () {
  var _k = 0.7
  var _note = encoder.encode(_k)
  controller.spatialPooling(0, [_note], true);
  controller.temporalMemory(0, true);
  // controller.spatialPooling( 1, [], true );
  // controller.temporalMemory( 1, true );
  controller.inputMemory(0);
  var answer = predict ()
  console.log(answer)
  if (_k === answer) {
    console.log(_k, ' :: ', answer)
  } else {console.log('.')}
}, 2000)

/*
* array.indexOf not present for all browsers, so using this instead
*/
function inArray (needle, haystack) {
	var length = haystack.length;
	for (var i = 0; i < length; i++) {
		if (haystack[i] == needle)
		return true;
	}
	return false;
}

function predict () {
  var i, k, cell;
  var keys = ['a', 'b', 'c', 'd', 'e'];
  var scores = { 'a': 0, 'b': 0, 'c': 0, 'd': 0, 'e': 0 };
  for (i = 0; i < controller.layers[0].proximalInputs[0].predictiveCells.length; i++) {
    cell = controller.layers[0].proximalInputs[0].predictiveCells[i];
    if (cell.apicalLearnSegment !== null) {
      for (k = 0; k < keys.length; k++) {
        if(inArray(cell.index, notes[keys[k]])) {
          scores[keys[k]] += cell.apicalLearnSegment.activeSynapses.length;
        }
      }
    }
  }
  i = 'c';
  for(k = 0; k < keys.length; k++) {
    if(scores[keys[k]] > scores[i]) {
      i = keys[k];
    }
  }
  if(scores[i] > 0) {
    // console.log(i.toUpperCase());
    return i;
  } else {
    // console.log("(none)");
    return false
  }
}


//
