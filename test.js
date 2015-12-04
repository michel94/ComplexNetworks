
var GraphGame = require('./game').GraphGame;
var PlayerFactory = require('./game').PlayerFactory;

var SIZE = 1000;
var N_ITERATIONS = 500;

//var graph = GraphGame.ABModel(size);
//var graph = GraphGame.DuplicationModel(size, 0.2);
// Graph Game
var SIZE = 500;
var N_ITERATIONS = 500;
//var graph = GraphGame.ABModel(size);
//var graph = GraphGame.DuplicationModel(size, 0.2);
graph = GraphGame.MinimalModel(SIZE);

//GraphGame.setup('', Player, 20);

var initialized = false;
syncInit = function(){
	if(!initialized){
		console.log('ready');
		initialized = true;
	}
}


function run(nRuns, T, S, finished){
	var start = new Date().getTime();
	
	if(nRuns <= 0){
		var C = 0;
		if('C' in GraphGame.counts)
			C = GraphGame.counts['C'];

		var D = 0;
		if('D' in GraphGame.counts)
			D = GraphGame.counts['D'];
		
		var p = C / (C+D);
		results[[T, S]] = p;

		finished();
		return;
	}

	var Player = new PlayerFactory(
		{colors: {'C': '#0000FF', 'D': '#FF0000'}},
		function(other){
			var R = 1;
			var t = T;
			var s = S;
			var P = 0;
			if(this.type == 'C'){
				if(other.type == 'C')
					return R;
				else
					return s;
			}else{
				if(other.type == 'C')
					return t;
				else
					return P;
			}
		}
	)
	GraphGame.setup('', Player, 10000);
	GraphGame.randomInit(graph, SIZE, ['C', 'D'], function(){} );
	GraphGame.maxIterations = N_ITERATIONS;

	GraphGame.start();
	GraphGame.stop = function(){
		end = new Date().getTime();
		console.log( (end-start)/1000 );

		run(nRuns-1, T, S, finished);
	};
}

//while(runs-- > 0){
	/*setTimeout(function(){
	}, 1);*/
//}
var points = []

for(var s=-1; s<=1; s+=0.1)
	for(var t=0; t<=2; t+=0.1)
		points.push([t, s]);


results = {};
function nextV(){
	var v = points.shift()
	run(1, v[0], v[1], nextV);
}
nextV();