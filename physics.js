$(document).ready(function(){
	$("body").prepend("<canvas width=800 height=800 style = 'background-color: #FFFFFF;'> </canvas>");
	var canvas = $("canvas").get(0);
	var sim = new Simulator(canvas.getContext("2d"));
	sim.init();
	$("canvas").mousedown(function(event) {
		sim.reset();
		console.log("sim restarted");
	});
	setupSliders(sim);
	// sim.reset();
	// sim.reset();
	// sim.reset();
	// sim.reset();
	// sim.reset();
});


function setupSliders(sim){
	$("#particle-count").change(function(event) {
		Simulator.prototype.config.particleCount = this.value;
		$("#particle-out").val(this.value);
		sim.reset();
	});
	$("#particle-size").change(function(event) {
		Simulator.prototype.config.radius = this.value;
		$("#size-out").val(this.value);
		
	});
	$("#gravity").change(function(event) {
		Simulator.prototype.config.g = (this.value * 100);
		$("#gravity-out").val(this.value);
		
	});
	$("#particle-size").change();
	$("#gravity").change();
}
// Are the particle objects not getting deleted when I reset?



function Particle(ctx){
	this.ctx = ctx;
	var posX = Math.floor(Math.random() * 800);
	var posY = Math.floor(Math.random() * 800);
	this.position = new Victor(posX, posY);
	this.velocity = new Victor(0, 0);
}
Particle.prototype = {
	update: function(){
		// For each other particle (not includining this one):
			// get vector to that particle 
			// get strength (1/dist) (scalar)
			// normalize direction vector
			// grav vector = directionVector * strength * grav constant
		// Add up all the gravity vectors
		// Add that to the velocity vector
		//Do physics calculations, and then draw

		var count = 0;
		var gravityVec = new Victor(0,0);
		var g = Simulator.prototype.config.g;
		for(var i = 0; i < Simulator.prototype.config.particleCount; i++){
			if(Simulator.prototype.particles[i] === this){
				continue;
			}
			var p = Simulator.prototype.particles[i];
			var distSq = this.position.distanceSq(p.position);
			var strength = (g)/(distSq + Simulator.prototype.config.softening);
			var direction = p.position.clone();
			direction.subtract(this.position);
			direction.normalize();
			direction.multiply(new Victor(strength, strength));
			gravityVec.add(direction);
		}
		this.velocity.add(gravityVec);
		this.position.add(this.velocity);
		this.draw();

	},
	draw: function(){/*
		this.ctx.beginPath();
		this.ctx.fillStyle = Simulator.prototype.config.color;
		this.ctx.arc(this.position.x,this.position.y, Simulator.prototype.config.radius, 0, Math.PI*2);
		this.ctx.fill();*/
		// console.log("Particle drew");
		var img1 = new Image();
		var radius = Simulator.prototype.config.radius;
		img1.src = "http://i.imgur.com/f62lYOk.png";
		this.ctx.drawImage(img1, this.position.x, this.position.y, ((radius/5)*100), ((radius/5)*100));
	}

}

function Simulator(ctx){
	this.ctx = ctx;
	this.ctx.globalCompositeOperation = "screen";
	this.particles = null;
}

Simulator.prototype = {
	particles: [],

	init: function(){
		console.log("Called init");
		// make particles
		for(var i = 0; i < Simulator.prototype.config.particleCount; i++){
			Simulator.prototype.particles.push(new Particle(this.ctx));
		}
		console.log(Simulator.prototype.particles);
		// console.log("Added particles: particles in list = " + this.particles.length);
		this.update();
	},
	update: function(){
		this.ctx.beginPath();
		this.ctx.clearRect(0,0, 800, 800);
		// Call update on each particle, then request animation frame
		for(var i = 0; i < Simulator.prototype.config.particleCount; i++){
			Simulator.prototype.particles[i].update();
		}
		// Understand this BIND shit
		window.requestAnimationFrame(this.update.bind(this));
	},
	reset: function(){
		this.ctx.beginPath();
		this.ctx.clearRect(0,0, 800, 800);
		Simulator.prototype.particles.forEach(function(currVal, index, arr){
			delete currVal;
			// console.log("Deleted particle");
		});
		Simulator.prototype.particles = [];
		this.init();
	}
}

Simulator.prototype.config = {
	particleCount: 5,
	g: 200,
	// color: "#C9CBFF",
	color: "#FFFFFF",
	radius: 2,
	softening: 5000
}