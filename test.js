var fs = require('fs');

var GraphGame = require('./game').GraphGame;
var PlayerFactory = require('./game').PlayerFactory;

var SIZE = 600;
var N_ITERATIONS = 600;
var N_RUNS = 5;
var graph2 = GraphGame.ABModel(SIZE, 2);
var graph = GraphGame.DuplicationModel(SIZE, 0.27);
//var graph3 = GraphGame.MinimalModel(SIZE);
while(avgDegree(graph) - avgDegree(graph2) > 0.01 || avgDegree(graph) - avgDegree(graph2) < -0.01){
	graph = GraphGame.DuplicationModel(SIZE, 0.27);
}


var initialized = false;
syncInit = function(){
	if(!initialized){
		console.log('ready');
		initialized = true;
	}
}


function run(nRuns, T, S, finished, sum){
	var start = new Date().getTime();
	
	if(nRuns <= 0){
		if(!results.hasOwnProperty(S) )
			results[S] = {};
		if(!results.hasOwnProperty(T) )
			results[T] = {};
		
		results[S][T] = sum;
		console.log(T + ", " + S + ": " + sum);

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

	GraphGame.stop = function(){
		end = new Date().getTime();
		//console.log( (end-start)/1000 );
		
		var C = 0;
		if('C' in GraphGame.counts)
			C = GraphGame.counts['C'];

		var D = 0;
		if('D' in GraphGame.counts)
			D = GraphGame.counts['D'];
		
		var p = C / (C+D);
		
		run(nRuns-1, T, S, finished, sum+p);
	};
	GraphGame.start(true);
}

//while(runs-- > 0){
	/*setTimeout(function(){
	}, 1);*/
//}
var points = []
var d = 20;

for(var s=0; s<=d; s++) // -1, 1
	for(var t=0; t<=d; t++) // 0, 2
		points.push([-1 + (t/d)*2, (s/d)*2]);


results = {};
function nextV(){
	var v = points.shift()
	if(v)
		run(N_RUNS, v[0], v[1], nextV, 0);
	else{
		for(var i in results)
			for(var j in results[i])
				results[i][j] /= N_RUNS;

		var ss = Object.keys(results).sort(function(a, b){return b-a});
		for(var s in ss){
			var ts = Object.keys(results[s]).sort();
			var l = [];
			for(var t in ts)
				l.push(results[s][t]);
			console.log(l);
		}
	}

}
nextV();
