
var neocortex = require('.')
var ScalarEncoder = require('./library/scalar.js')

var MAX = 500

var encoder = new ScalarEncoder({
  min: 0, max: MAX,
  w: 10, n: 1024
})

function activations (input) {
  var activations = []
  input = input.forEach(function (i, index) {
    if (i) activations.push(index)
  })
  return activations
}

var params = {
  columnCount: 1024, // 1-1024
  cellsPerColumn: 5, // 1-32
  activationThreshold: 11, // 1-128
  initialPermanence: 70, // 1-100
  connectedPermanence: 50, // 1-100
  minThreshold: 5, // 1-128
  maxNewSynapseCount: 11, // 1-32
  permanenceIncrement: 10, // 1-100
  permanenceDecrement: 10, // 1-100
  predictedSegmentDecrement: 5, // 1-100
  maxSegmentsPerCell: 11, // 1-128
  maxSynapsesPerSegment: 128, // 1-128
  potentialPercent: 50, // 1-100
  sparsity: 11, // 1-100,
  potentialPercent: 10,
  tpPotentialPercent: 2,
  tpSparsity: 10,
  historyLength: 5,
  meanLifetime: 3,
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
// controller.clear();
controller.clear();
controller.createLayer( params, TM_LAYER );
// Create the pooling layer
params.potentialPercent = params.tpPotentialPercent;
controller.createLayer(params, TP_LAYER, [0]);
var xx = 0

var prediction = null
var mid = 50;
setInterval(function () {
  var _k = parseInt(mid + (++xx))
  // var _k = ++xx
  if (mid + xx >= mid+10) xx =0
  var _note = activations (encoder.encode(parseInt(_k)))
  controller.spatialPooling(0, [_note], true);
  controller.temporalMemory(0, true);
  controller.spatialPooling( 1, [], true );
  controller.temporalMemory( 1, true );
  controller.inputMemory(0);
  var answer = predict ()
  if (_k === prediction) console.log('predicted ', _k, ' ', prediction)
    else console.log('< ', _k, prediction)
  prediction = answer
}, 500)

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
  var keys = [];
  for (var z = 1; z < MAX; z++) {
    keys.push(z+'')
  }
  var scores = {};
  for (z = 1; z < MAX; z++) {
    scores[z+''] = 0;
  }
  for (i = 0; i < controller.layers[0].proximalInputs[0].predictiveCells.length; i++) {
    cell = controller.layers[0].proximalInputs[0].predictiveCells[i];
    if (cell.apicalLearnSegment !== null) {
      for (k = 0; k < keys.length; k++) {
        if(inArray(cell.index, activations(encoder.encode(parseInt(keys[k])))) ) {
          scores[keys[k]] += cell.apicalLearnSegment.activeSynapses.length;
        }
      }
    }
  }
  i = '1';
  for(k = 0; k < keys.length; k++) {
    if(scores[keys[k]] > scores[i]) {
      i = keys[k];
    }
  }
  if(scores[i] > 0) {
    return parseInt(i);
  } else {
    return false
  }
}


//
