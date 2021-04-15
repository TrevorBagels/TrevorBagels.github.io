/*
	This is a template for how to build a visualization for
	AmplitudeJS. The visualization should be modular contain
	the methods and variables outlined. You can add any additional
	methods or variables inside of the object.
*/

/*
	Replace 'VisualizationObjectName' with the proper object
	name for your visualization.
*/
var doVisualize = true;
function rand(min, max)
{
	return Math.random() * (max - min) + min;
}
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function mean(arr)
{
	var total = 0;
	for(var i = 0; i < arr.length; i++)
		total += arr[i];
	return total / arr.length;
}

function BagelVis(){
	/*
		Define the ID of your visualization. This is used to apply
		visualizations to songs, playlists, and default. It is a JSON
		key so make sure you use `_`
	*/
	this.id = 'BagelVis';
	this.name = 'BagelVis';
	this.previousBars = []
	this.visualizeroff = false
	this.bars = 20;
	this.div = 37; //amount to use for averaging out the power of one bar
	this.divOffset = 30; //just an offset so things aren't as close together
	for(let i = 0; i < this.bars; i++) this.previousBars.push(0);
	/*
		Initialize the container. This will get set to the element passed in
		when you start the visualization.
	*/
	this.container = '';

	/*
		Define any settings that your visualization will need. This is JSON so
		make sure it's clearly defined and standards are followed. These shoudl be
		able to be overwritten by the user when they pass in their preferences.
	*/
	this.preferences = {

	}

	/*
		Initialize the analyser for the visualization. This will be set when the
		visualization is started.
	*/
	this.analyser = '';

	/*
		Returns the ID of the visualization. Do not overwrite this, this is necessary
		for registering the visualization.
	*/
	this.getID = function(){
		return this.id;
	}

	/*
		Returns the name of the visualization.
	*/
	this.getName = function(){
		return this.name;
	}

	/*
		Merge the user defined preferences with the preferences for the visualization.
	*/
	this.setPreferences = function( userPreferences ){
		for( var key in this.preferences ){
			if( userPreferences[ key ] != undefined) {
				this.preferences[key] = userPreferences[key];
			}
		}
	}
	this.drawBars = function(freqByteData)
	{	
		
		var barWidth = (this.width / this.bars)
		for(let i = 0; i < this.bars; i++)
		{
			var power = freqByteData[i*this.div + i*this.divOffset];
			var prevPower = this.previousBars[i];
			for(let p = 0; p < this.div-1; p++) power += freqByteData[i*this.div + p + i * this.divOffset]; //get the avg.
			var dampen = 5;
			if((power / this.div)/2 > prevPower) {dampen = .15}
			power = ((power / this.div) + (prevPower * dampen))/(dampen + 1)
			this.previousBars[i] = power;
			var r = (power * freqByteData[i*10+2])/10; //?
			var g = Math.sin(this.frame / 30) * power;
			var b = Math.floor(Math.sin(this.frame/20)*Math.cos(freqByteData[i*2]/10)*250)
			var a = 200/power;
			var rgb = "rgb("+r+","+g+","+b+")";
			var shapeMode = 0;
			this.ctx.shadowColor = rgb;
			this.ctx.shadowBlur = 30;
			this.ctx.globalAlpha = a;
			this.ctx.fillStyle = rgb;
			var yOffset = Math.sin(this.frame/30)*2
			this.ctx.fillRect(0, yOffset+this.height - i*barWidth, power, barWidth*.75);
			this.ctx.fillRect(this.width, yOffset+this.height - i*barWidth, -power, barWidth*.75);
		}
	}
	this.drawTris = function(freqByteData)
	{
		var bars = 20;
		var barWidth = (this.width / bars)
		if(freqByteData[60] > 190)
			this.frame = 90;
		for(let i = 0; i < bars; i++)
		{
			var power = freqByteData[i*10];
			var r = (power * freqByteData[i*10+2])/10;
			var g = Math.floor(Math.sin(this.frame/20)*Math.cos(freqByteData[i*2]/10)*250);
			var b = Math.tan(this.frame / 30) * power;
			var a = 200/power;
			var rgb = "rgb("+r+","+g+","+b+")";
			var shapeMode = 0;
			this.ctx.shadowColor = rgb;
			this.ctx.shadowBlur = 30;
			this.ctx.globalAlpha = a;
			this.ctx.fillStyle = rgb;
			this.ctx.beginPath();
			this.ctx.moveTo(0, i*barWidth);
			this.ctx.lineTo(power/2, i*barWidth + power*Math.sin(this.frame/60));
			this.ctx.lineTo(i*20, i*barWidth + barWidth);
			this.ctx.fill();
		}
	}
	this.drawLines = function(freqByteData)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		for(let i = 0; i < 81; i++)
		{
			let x = i/80 * this.canvas.width;
			let y = 50 + freqByteData[i]/50		
			this.ctx.lineTo(x, y);
		}
		var avgr = mean(freqByteData.slice(1, 40))*3;
		var avgg = mean(freqByteData.slice(40, 90))*2;
		this.ctx.strokeStyle = "rgb("+avgr+", "+avgg+", 0)";
		this.ctx.shadowColor = this.ctx.strokeStyle;
		this.ctx.shadowBlur = 100;
		this.ctx.lineWidth = 8;
		this.ctx.stroke()
	}
	this.drawFrame = function()
	{ 
		if(!doVisualize)
		{
			this.visualizeroff = true
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.requestAnimation = window.requestAnimationFrame( this.drawFrame.bind(this), this.canvas );
			return;
		}
		this.frame += 1;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		
		let freqByteData = new Uint8Array( this.analyser.frequencyBinCount );
		this.analyser.getByteFrequencyData( freqByteData );
		//ideal range is from 0 - 400
		this.drawBars(freqByteData);
		//this.drawTris(freqByteData)
		this.drawLines(freqByteData);
		this.requestAnimation = window.requestAnimationFrame( this.drawFrame.bind(this), this.canvas );
	}
	/*
		Start the visualization. Do not over write this. This is how the visualization
		gets kicked into gear. The element passed in is the container element where you
		will insert canvas' or whatever works.
	*/
	this.startVisualization = function( element ){
		this.analyser = Amplitude.getAnalyser();
		this.container = element;
		this.container.innerHTML = "<canvas id='audiocanvas'></canvas>";
		this.canvas = document.getElementById("audiocanvas");
		this.canvas.width = document.documentElement.clientWidth;
		this.canvas.height = document.documentElement.clientHeight;
		this.ctx = this.canvas.getContext('2d');
		this.container.appendChild(this.canvas);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.frame = 0;
		this.drawFrame()
	}

	/*
		Stop the visualization. Do not over write this. This gets called when the
		visualization is stopped so there's no infinite loops in memory. You should
		clear all animation frames and all timed callbacks here.

		This will clear the container as well so when the visualization starts again
		it can be different than before if needed.
	*/
	this.stopVisualization = function(){
		//this.container.innerHTML = '';
	}
}