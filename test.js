var fs = require('fs');

var GraphGame = require('./game').GraphGame;
var PlayerFactory = require('./game').PlayerFactory;

var SIZE = 500;
var N_ITERATIONS = 300;
var N_RUNS = 5;

var graph = null;
var graph2 = GraphGame.ABModel(SIZE, 2);

if(process.argv[2] != null){
	arg = process.argv[2];
	if(arg == "minimal"){
		graph = GraphGame.MinimalModel(SIZE);
	}else if(arg == 'AB'){
		graph = graph2;
	}else if(arg == 'duplication'){
		graph = GraphGame.DuplicationModel(SIZE, 0.27);
		while(avgDegree(graph) - avgDegree(graph2) > 0.01 || avgDegree(graph) - avgDegree(graph2) < -0.01){
			graph = GraphGame.DuplicationModel(SIZE, 0.27);
		}
	}else if(arg == 'communities'){
		graph = GraphGame.Communities(SIZE, 8, 2, 0.95, 3);
	}else{
		throw 'Error: No model specified';
	}
}else{
	throw 'Error: No model specified';
}

var d = 20;
var start = 0;
var end = d;
if(process.argv[3] != null){
	start = parseInt(process.argv[3])
	console.log('Starting at', start)
}
if(process.argv[4] != null){
	end = parseInt(process.argv[4])
	console.log('Ending at', end)
}


//

//var graph = GraphGame.Communities(SIZE, 8, 2, 0.95, 3);
//var graph = GraphGame.DuplicationModel(SIZE, 0.27);

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

for(var s=start; s<=end; s++) // -1, 1
	for(var t=0; t<=d; t++) // 0, 2
		points.push([(t/d)*2, -1 + (s/d)*2]);


results = {};
function nextV(){
	var v = points.shift()
	if(v)
		run(N_RUNS, v[0], v[1], nextV, 0);
	else{
		for(var i in results)
			for(var j in results[i])
				results[i][j] /= N_RUNS;

		out = ""
		out += "{";
		var ss = Object.keys(results).sort(function(a, b){return a-b});
		for(var s in ss){
			var ts = Object.keys(results[ss[s]]).sort(function(a, b){return a-b});
			var l = [];
			out += "{";
			for(var t in ts){
				l.push();
				out += results[ss[s]][ts[t]];
				if(t < ts.length-1)
					out += ", ";
			}
			out += "}";
			if(s < ss.length-1)
				out += ", ";
		}
		out += "}";
		console.log(out);
	}

}
nextV();
