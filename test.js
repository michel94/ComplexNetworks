
var GraphGame = require('./game').GraphGame;
var PlayerFactory = require('./game').PlayerFactory;

var SIZE = 1000;
var N_ITERATIONS = 500;

//var graph = GraphGame.ABModel(size);
//var graph = GraphGame.DuplicationModel(size, 0.2);
graph = GraphGame.MinimalModel(SIZE);

var initialized = false;
syncInit = function(){
	if(!initialized){
		console.log('ready');
		initialized = true;
	}
}

function run(nRuns, T, S){
	var start = new Date().getTime();
	console.log(GraphGame.counts);
	
	if(nRuns <= 0)
		return;

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
		console.log('finished')
		console.log( (end-start)/1000 );


		run(nRuns-1, T, S);
	};
}


run(1, 1.5, 0.75);
