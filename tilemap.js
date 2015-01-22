var gameStarted = false;
var playerHasControl = true;
var spriteCount = 0;
var UP			= {x: 0, y: -1};
var DOWN		= {x: 0, y: 1};
var LEFT		= {x: -1, y: 0};
var RIGHT		= {x: 1, y: 0};
var UP_LEFT		= {x: -1, y: -1};
var UP_RIGHT	= {x: 1, y: -1};
var DOWN_LEFT	= {x: -1, y: 1};
var DOWN_RIGHT	= {x: 1, y: 1};
	
function KeyboardController(keys, repeat) {
	// Lookup of key codes to timer ID, or null for no repeat
	//
	var timers = {};

	// When key is pressed and we don't already think it's pressed, call the
	// key action callback and set a timer to generate another one after a delay
	//
	document.onkeydown= function(event) {

		var key= (event || window.event).keyCode;

		if (!(key in keys))
			return true;

		if (!(key in timers)) {
			timers[key]= null;
			keys[key]();
			if (repeat[key]!==0)
			timers[key]= setInterval(keys[key], repeat[key]);
		}
		return false;
	};

	// Cancel timeout and mark key as released on keyup
	//
	document.onkeyup= function(event) {
		var key= (event || window.event).keyCode;

		if (key in timers) {
			if (timers[key]!==null)
				clearInterval(timers[key]);
			delete timers[key];
		}
	};

	// When window is unfocused we may not get key events. To prevent this
	// causing a key to 'get stuck down', cancel all held keys
	//
	window.onblur= function() {
		for (key in timers)
			if (timers[key]!==null)
				clearInterval(timers[key]);
		timers= {};
	};
};/*KEYBOARD->END OF BLOCK*/

function XYselector(coord){
	return '#y-' + coord.y + ' #x-' + coord.x + ' ';
}

$(window).ready(function(){
	window.parent.document.body.style.zoom = .75;
});

$(document).ready(function(){
	
	/* ENTITY
	-----------------------*/	
	function Entity(){
		this.pos = {x: 0, y: 0};		
	}
	
	/* ACTOR
	-----------------------*/	
	function Actor(){
	
		this.isValidPos = function(pos){
			var there = $(XYselector(pos));		
			if(there.length == 0 || there.hasClass('blocked'))
				return false;				
			return true;
		}

		this.allowedTiles = function(pos){
			var here = pos || this.pos;
			var there;
			var allowedTiles = new Array();
			var directions = Array(UP, DOWN, LEFT, RIGHT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT);
			var D = Array('up', 'down', 'left', 'right', 'upleft', 'upright', 'downleft', 'downright');
			
			for(i = 0; i < directions.length; i++){
				there = {x: here.x + directions[i].x, y: here.y + directions[i].y};
				if(this.isValidPos(there))
					allowedTiles.push({pos: there, dir: D[i]});
			}			
			return allowedTiles;
		}
		
		this.move = function(deltaXY){		
			var newPos = {x: this.pos.x + deltaXY.x, y: this.pos.y + deltaXY.y};	
			
			if(!this.isValidPos(newPos))
				return false;
			
			$(XYselector(this.pos) + this.selector).detach().appendTo(XYselector(newPos));			
			this.pos.x = newPos.x;
			this.pos.y = newPos.y;				
		}
		
		this.locate = function(XY){						
			$(XYselector(this.pos) + this.selector).detach().appendTo(XYselector(XY));			
			this.pos.x = XY.x;
			this.pos.y = XY.y;
		}
	}
	
	Actor.prototype = new Entity();
	
	/* PERSON
	-----------------------*/	
	function Person(x, y){
	
		this.id = spriteCount++;
		this.selector = '#actor-' + this.id;
		this.pos = {x: x, y: y};	
	
		$(XYselector(this.pos)).append("<div id='actor-" + this.id + "' class='person'></div>");
	}
	
	Person.prototype = new Actor();

	
	/* EGO
	-----------------------*/	
	function Ego(x, y){
	
		this.id = 'ego';
		this.selector = '#ego';	
		this.pos = {x: x, y: y};	
	
		$(XYselector(this.pos)).addClass('begin');
		$('.begin').append("<div id='ego'></div>");
				
	}
	Ego.prototype = new Actor();
	
	/* PATHFINDING
	-----------------------*/	
	function Step(XY, parent, cost, dir){
		this.pos = XY;
		this.parent = parent || false;
		this.cost = cost || 0;
		this.dir = dir || 'stopped';
	}
	
	function PathFinder(p0, p1){
	
		this.heuristic = function(here){		
			var d1 = Math.abs (here.x - this.end.x);
			var d2 = Math.abs (here.y - this.end.y);
			return d1 + d2; //Math.max(d1, d2); 			
		}
	
		this.begin = p0;
		this.end = p1;
		this.open = Array(new Step(this.begin, false, this.heuristic(this.begin)));
		this.closed = Array();
		this.path = false;
			
		this.find = function(){
		
			var nominees = new Array();				
			var here = this.open.pop();	
			
					
			if(!here){
				throw "no nodes left";
				return false;
			}
			
			this.closed.push(here);
				
			//$(XYselector(here.pos)).removeClass('possible').addClass('good');
				
			if(here.pos.x == this.end.x && here.pos.y == this.end.y){
				$(XYselector(here.pos)).addClass('path destination');

				var backtrack = new Array();
							
				while(here.parent){
					backtrack.push(here.parent.pos);					
					here = here.parent;
					$(XYselector(here.pos)).addClass('path ' + here.dir);
				}
				
				this.path = backtrack;
				
				return true;
			}
			
			var neighbors = ego.allowedTiles(here.pos);
		
			if(neighbors.length == 0){
				console.log('no neighbors');
				return false;
			}
					
			for(i = 0; i < neighbors.length; i++){			
				
				var ignore = false;
			
				for(c = 0; c < this.closed.length; c++){				
					if((this.closed[c].pos.x == neighbors[i].pos.x) && (this.closed[c].pos.y == neighbors[i].pos.y)){
						ignore = true;
						break;
					
					}					
				}					
				
				if(ignore)
					continue;
					
				for(o = 0; o < this.open.length; o++){	
					if((this.open[o].pos.x == neighbors[i].pos.x) && (this.open[o].pos.y == neighbors[i].pos.y)){
						
						var index = this.open.indexOf(this.open[o]);						
						nominees.push(this.open.splice(index, 1)[0]);
						ignore = true;					
					}					
				}
					
				if(ignore)
					continue;				
				
				/*				
				var htmlObj = $(XYselector(neighbors[i].pos));
				if(!htmlObj.hasClass('good'))				
					htmlObj.addClass('possible');					
				*/
				
				nominees.push(new Step(neighbors[i].pos, here, 1 + this.heuristic(neighbors[i].pos), neighbors[i].dir));
			}
			
			nominees.sort(function(a, b) {return (a.cost - b.cost) * -1;});
			this.open = this.open.concat(nominees);	
					
			return false;
		}
		
		this.go = function(){
		
			$('.path').removeClass('path stopped up down left right upright downright upleft downleft destination');
		
			var found = false;
			var tries = 0;
			
			while(tries < 1000 && !found){
				found = this.find();
				tries++;
			}			
		}
		
		this.go();
		
	}
	
		
	/* KEYBOARD CONTROLLER
	-----------------------*/	
	/*		
		27: escape
		33: up right
		34: down right
		35: down left
		36: up left
		37: left
		38: up
		39: right
		40: down
		32: space
		107: plus
		109: minus
	*/
	
	KeyboardController({
		27: function() { if(gameStarted) endGame();},
		33: function() { if(playerHasControl) ego.move(UP_RIGHT); },
		34: function() { if(playerHasControl) ego.move(DOWN_RIGHT); },
		35: function() { if(playerHasControl) ego.move(DOWN_LEFT); },
		36: function() { if(playerHasControl) ego.move(UP_LEFT); },
		37: function() { if(playerHasControl) ego.move(LEFT); },
		38: function() { if(playerHasControl) ego.move(UP); },
		39: function() { if(playerHasControl) ego.move(RIGHT); },
		40: function() { if(playerHasControl) ego.move(DOWN); }
	}, {27: 0, 32: 0, 33: 0, 34: 0, 35: 0, 36: 0, 37:0, 38:0, 39:0, 40:0});
	
	/* POPULATE MAP
	-----------------------*/	
	var ego = new Ego(2, 1);	
	var person = new Person(8, 8);
	
	/* EVENTS
	-----------------------*/
	$('.terrain').click(function(){
		var ny = parseInt($(this).parent('tr').attr('id').split('-')[1]);
		var nx = parseInt(this.id.split('-')[1]);	
		
		var pathfinder = new PathFinder(ego.pos, {x: nx, y: ny});
		
	
	});
});