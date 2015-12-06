
mod = function(n, m) {
		return ((n % m) + m) % m;
}

Matrix = function(w, h){
	var m = new Array(w);
	for(var i=0; i<w; i++)
		m[i] = new Array(h);
	return m;
} 

Game = new (function(){
	this.setup = function(canvas, Class, itPerSec){
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.Class = Class;

		this.pw = canvas.width;
		this.ph = canvas.height;
		this.fps = itPerSec;
	}
	this.init = function(matrix){
		this.matrix = matrix;
		this.oldM = this.matrix;
		this.w = matrix.length;
		this.h = matrix[0].length;

		this.draw();
	}

	this.randomInit = function(w, h, l){
		this.matrix = Matrix(w, h);
		this.oldM = this.matrix;
		this.w = w;
		this.h = h;

		for(var i=0; i<w; i++){
			for(var j=0; j<h; j++){
				var s = Math.floor(Math.random() * l.length);
				this.matrix[i][j] = new this.Class(l[s]);
				this.matrix[w-1-i][j] = this.matrix[i][j];
				this.matrix[i][h-1-j] = this.matrix[i][j];
				this.matrix[w-1-i][h-1-j] = this.matrix[i][j];

			}
		}

		Game.draw();
	}

	this.iteration = function(){

		var count = new Array(this.matrix.length);
		for(var i=0; i<this.matrix.length; i++)
			count[i] = new Array();

		for(var i=0; i<this.matrix.length; i++){
			for(var j=0; j<this.matrix[i].length; j++){
				var sum = 0;
				sum += this.matrix[i][j].play(this.matrix[mod(i-1, this.w)][j]);
				sum += this.matrix[i][j].play(this.matrix[mod(i+1, this.w)][j]);
				sum += this.matrix[i][j].play(this.matrix[i][mod(j-1, this.h)]);
				sum += this.matrix[i][j].play(this.matrix[i][mod(j+1, this.h)]);

				count[i][j] = sum;

			}
		}

		var tempM = Matrix(this.w, this.h);

		for(var i=0; i<this.matrix.length; i++){
			for(var j=0; j<this.matrix[i].length; j++){
				var bestV = count[i][j];
				var best = this.matrix[i][j];
				var t = 0;

				t = mod(j-1, this.h);
				if(count[i][t] > bestV ) {
					best = this.matrix[i][t];
					bestV = count[i][t];
				}

				t = mod(j+1, this.h);
				if(count[i][t] > bestV) {
					best = this.matrix[i][t];
					bestV = count[i][t];
				}

				t = mod(i-1, this.w);
				if(count[t][j] > bestV){
					best = this.matrix[t][j];
					bestV = count[t][j]
				}

				t = mod(i+1, this.w);
				if(count[t][j] > bestV){
					best = this.matrix[t][j];
					bestV = count[t][j];
				}


				tempM[i][j] = best;


			}
		}

		this.draw(tempM);
		this.oldM = this.matrix;
		this.matrix = tempM;


	}

	this.start = function(){
		var g = this;
		setInterval(function(){
			g.iteration();
		}, 1/g.fps);
	}

	this.draw = function(newM) {
		var dw = this.pw / this.w;
		var dh = this.ph / this.h;

		if(newM != null){
			for(var i=0; i<this.matrix.length; i++){
				for(var j=0; j<this.matrix[i].length; j++){
					if(this.matrix[i][j].type != newM[i][j].type){
						if(newM[i][j].type == 'C')
							this.context.fillStyle = "#097A4F";
						else
							this.context.fillStyle = "#6C7A09";
					}else{
						this.context.fillStyle = this.matrix[i][j].colors[newM[i][j].type];
					}

					if(this.oldM[i][j] != this.matrix[i][j])
						this.context.fillRect(	i * dw,
												j * dh,
												dw,
												dh);
					
					
				}
			}
		}else{
			for(var i=0; i<this.matrix.length; i++){
				for(var j=0; j<this.matrix[i].length; j++){
					this.context.fillStyle = this.matrix[i][j].colors[this.matrix[i][j].type];
					this.context.fillRect(	i * dw,
											j * dh,
											dw,
											dh);
				}
			}
		}
	

	}


	return this;
})();

Descendent = {
	bestFit: function(){
		/*
		for(var j in graph[i]){
			var v = graph[i][j];
			if(count[v] > bestV){
				best = this.nodes[v];
				bestV = count[v];
			}	
		}
		tempNodes[i] = best;*/
		
	}
}

GraphGame = new (function(){
	this.setup = function(container, Class, itPerSec){
		this.container = container;
		this.Class = Class;

		this.fps = itPerSec;
		if(this.container == '')
			this.render = false;
		else
			this.render = true;

		this.iterationCount = 0;
	}

	this.randomInit = function(graph, size, l, callback){
		var nodes = [];
		this.types = l;
		for(var i=0; i<size; i++){
			var s = Math.floor(Math.random() * l.length);
			nodes[i] = new this.Class(l[s]);
		}
			
		this.init(graph, nodes, callback)
	}

	this.init = function(graph, nodes, callback){
		this.graph = graph;
		this.nodes = nodes;
		this.callback = callback;

		if(this.render){
			var tempNodes = [];
			for(var i=0; i<this.nodes.length; i++)
				tempNodes.push({
					id: i, 
					label: "", 
					font: {size:30},
					color: {background: this.nodes[i].colors[this.nodes[i].type]}
				});

			this.visNodes = new vis.DataSet(tempNodes);

			// create an array with edges
			var tempEdges = [];
			for(var i=0; i<this.nodes.length; i++)
				for(var j in graph[i]){
					var v = graph[i][j];
					if (v < i)
						tempEdges.push({from: i, to: v});
				}

			
			this.visEdges = new vis.DataSet(tempEdges);

			this.data = {
				nodes: this.visNodes,
				edges: this.visEdges
			};
			this.options = {
				physics: {
					stabilization: false
				}
			};

			var network = new vis.Network(this.container, this.data, this.options);
			network.on('stabilized', function(){
				if(this.callback != null)
					this.callback();
			});
			
		}

	}

	this.iteration = function(){

		var count = new Array(this.nodes.length);
		for(var i=0; i<this.nodes.length; i++)
			count[i] = 0;


		for(var i=0; i<this.nodes.length; i++){
			var sum = 0;
			for(var j in this.graph[i]){
				var v = this.graph[i][j];
				sum += this.nodes[i].play(this.nodes[v]);
			}
			count[i] = sum;
		}

		this.counts = {}

		var tempNodes = Array(this.nodes.length);

		for(var i=0; i<this.nodes.length; i++){
			var sum = 0;


			var ind = Math.floor(Math.random() * this.graph[i].length);
			var node = this.graph[i][ind];
			var prob = (count[node] - count[i]) / (function(l){
				var m = 0;
				for(var i in l)
					if(l[i] > m)
						m = count[i];
				return m;
			})(count);

			if(Math.random() < prob)
				tempNodes[i] = this.nodes[ind];
			else
				tempNodes[i] = this.nodes[i];

			if(!(tempNodes[i].type in this.counts))
				this.counts[tempNodes[i].type] = 0;
			this.counts[tempNodes[i].type]++;

		}

		this.nodes = tempNodes;

		if(this.render)
			this.draw();
	}



	this.start = function(runSync){
		var g = this;
		if(!runSync){
			this.intervalId = setInterval(function(){
				g.iterationCount++;
				//if(g.iterationCount % 100 == 0)
					//console.log(g.iterationCount);
				
				if(g.maxIterations != null && g.iterationCount >= g.maxIterations){
					clearInterval(g.intervalId);
					if(g.stop)
						g.stop();
				}
				g.iteration();
			}, 1000/g.fps);
		}else{
			while(g.iterationCount < g.maxIterations){
				g.iterationCount++;
				g.iteration();
			}
			if(g.stop){
				g.stop();
			}
		}

	}

	this.draw = function() {
		var updates = [];
		for(var i=0; i<this.nodes.length; i++){
			updates.push(
				{ id:i, 
					color:
						{background: this.nodes[i].colors[this.nodes[i].type]}
				}
			)

		}
		
		this.visNodes.update(updates);
	}

}) ();

GraphGame.ABModel = function(size, m){
	if(size < 2)
		throw 'size must be greater than 2!'

	var graph = new Array(size);
	for(var i=0; i<size; i++)
		graph[i] = [];

	graph[0] = [1];
	graph[1] = [0];


	var degSum = 2;
	for(var i=2; i<size; i++){
		graph[i] = [];

		var l=[], subSum = 0;
		for(var j=0; j<i; j++)
			l.push(j);

		for(var c=0; c<m; c++) {
			var probSum = 0;
			var randNum = Math.random() * (1 - subSum);

			for(var j=0; j < l.length; j++){
				probSum += graph[l[j]].length / degSum;
				if(randNum <= probSum){
					graph[i].push(l[j]);
					subSum += graph[l[j]].length / degSum;
					l.splice(j, 1);
					break;
				}
			}
			
		}
		for(var j in graph[i]){
			graph[graph[i][j]].push(i);
		}

		degSum += graph[i].length * 2;
	}
	
	return graph;
}

GraphGame.DuplicationModel = function(size, p){
	if(size < 1)
		throw 'size must be greater than 1!'
	
	var	graph = new Array(size);
	for(var i=0; i<size; i++)
		graph[i] = [];
	
	graph[0] = [];
	
	for(var i=1; i<size; i++){
		var c = Math.floor(Math.random() * (i));
		graph[i].push(c);
		for(var j=0; j<graph[c].length; j++){
			if(Math.random() < p){
				var neigh = graph[c][j];
				graph[i].push(neigh);
				graph[neigh].push(i);
			}
		}
		graph[c].push(i);
	}
	
	return graph;
}

GraphGame.MinimalModel = function(size){
	if(size < 2)
		throw 'size must be greater than 2!'

	var graph = new Array(size);
	for(var i=0; i<size; i++)
		graph[i] = [];

	graph[0] = [1];
	graph[1] = [0];
	edges = [[0, 1]]

	for(var i=2; i<size; i++){
		var r = Math.floor(Math.random() * edges.length);

		var node1 = edges[r][0], node2 = edges[r][1];
		graph[i] = [node1, node2];
		graph[node1].push(i);
		graph[node2].push(i);
		edges.push([node1, i]);
		edges.push([node2, i]);
	}

	return graph;
}

PlayerFactory = function(elements, fplay){
	
	return function(type){
		this.type = type;
		for(var key in elements)
			this[key] = elements[key]

		this.fplay = fplay;
		this.play = function(other){
			return this.fplay(other);
		}
		
	}

};

avgDegree = function(l){
	var s = 0
	for(var i=0; i<l.length; i++) s += l[i].length;
	return s / l.length;
}

function degreeDistribution(graph){
	max_degree = (function(l){
		var m = null;
		for(var i in l){
			if(m == null || l[i].length > m.length){
				m = l[i];
			}
		}

		return m.length;
	}) (graph);

	deg_dist = new Array(max_degree+1);
	for(var i = 0; i < max_degree+1; i++)
		deg_dist[i] = 0;
	
	for(var i in graph)
		deg_dist[graph[i].length]++;

	return deg_dist
}


module.exports = {
  "PlayerFactory": PlayerFactory,
  "Game": Game,
  "GraphGame": GraphGame
};
