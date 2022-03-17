const context = document.querySelector("canvas").getContext("2d");
const res = document.querySelector("#res");

context.canvas.height = 400;
context.canvas.width = 1220;


let cloudCoors = [
	{
		id: 1,
		x: 170,
		y: 80,
		fill: '#ffffff',
		speed: 0.3,
	},
	{
		id: 2,
		x: 150,
		y: 160,
		fill: '#e8e9e9',
		speed: 0.5,
	},
	{
		id: 3,
		x: 0,
		y: 210,
		fill: '#ffffff',
		speed: 1,
	},
];

const square = {
	height: 32,
	jumping: true,
	width: 32,
	x: 0,
	xVelocity: 0,
	y: 0,
	yVelocity: 0
};

var groundArray = [
	{
		strokeStyle: '#594243',
		lineWidth: 30,
		xInit: 0,
		yInit: 385,
		xEnd: 300,
		yEnd: 385,
		xVelocity: 0.5,
		yVelocity: 20,
		type: 0,		//0: ground, 1: water, 2:?
	},
	{
		strokeStyle: '#594243',
		lineWidth: 60,
		xInit: 300,
		yInit: 385,
		xEnd: 700,
		yEnd: 385,
		xVelocity: 0.5,
		yVelocity: 20,
		type: 0,
	},
	{
		strokeStyle: '#594243',
		lineWidth: 90,
		xInit: 700,
		yInit: 385,
		xEnd: 780,
		yEnd: 385,
		xVelocity: 0.5,
		yVelocity: 20,
		type: 0,
	},
	{
		strokeStyle: '#594243',
		lineWidth: 30,
		xInit: 780,
		yInit: 385,
		xEnd: 820,
		yEnd: 385,
		xVelocity: 0.5,
		yVelocity: 20,
		type: 0,
	},
	{
		strokeStyle: '#0000ff',
		lineWidth: 20,
		xInit: 820,
		yInit: 390,
		xEnd: 1020,
		yEnd: 390,
		xVelocity: 0.2,
		yVelocity: 15,
		type: 1,
	},
	{
		strokeStyle: '#594243',
		lineWidth: 30,
		xInit: 1020,
		yInit: 385,
		xEnd: 1220,
		yEnd: 385,
		xVelocity: 0.5,
		yVelocity: 20,
		type: 0,
	},
	{
		strokeStyle: "#0000ff",
		lineWidth: 20,
		xInit: 1220,
		yInit: 390,
		xEnd: 1520,
		yEnd: 390,
		xVelocity: 0.2,
		yVelocity: 15,
		type: 1
	},
	{
		strokeStyle: "#594243",
		lineWidth: 30,
		xInit: 1520,
		yInit: 390,
		xEnd: 2420,
		yEnd: 390,
		xVelocity: 0.5,
		yVelocity: 20,
		type: 0
	}];

let overallx = 1220;
let leftLen = context.canvas.width;
// Create the obstacles for each frame
const nextLevel = (a) => {
	let x = a == 0 ? 8 : -8;
	if ((overallx == 1220 && a == 0) || (overallx == 2420 && a == 1)) return -1;
	overallx -= x;
	groundArray.forEach(el => {
		el.xInit += x;
		el.xEnd += x;
	});
	return 1;
}

const controller = {
	left: false,
	right: false,
	up: false,
	space: false,
	ctrl: false,
	keyListener: function (event) {
		var key_state = (event.type == "keydown") ? true : false;
		switch (event.keyCode) {
			case 37:// left key
				controller.left = key_state;
				break;
			case 38:// up key
				controller.up = key_state;
				break;
			case 39:// right key
				controller.right = key_state;
				break;
			case 32://space key
				controller.space = key_state;
				break;
			case 17://ctrl key
				controller.ctrl = key_state;
				break;
		}
	}
};

const ground = function () {
	context.strokeStyle = '#000000';
	context.lineWidth = 1;
	context.beginPath();
	context.moveTo(0, 400);
	context.lineTo(1220, 400);
	context.stroke();

	this.groundArray.forEach(e => {
		context.globalAlpha = e.type == 1 ? 0.5 : 1;
		// context.shadowBlur = e.type == 1 ? 0 : 20;
		context.shadowBlur = 10;
		context.shadowColor = e.type == 1 ? "#0000ff" : "#00ff00";
		context.strokeStyle = e.strokeStyle;
		context.lineWidth = e.lineWidth;
		context.beginPath();
		context.moveTo(e.xInit, e.yInit);
		context.lineTo(e.xEnd, e.yEnd);
		context.stroke();
		context.shadowBlur = 0;
	});
}

const createCloud = function (x, y, fill) {
	context.beginPath();
	context.moveTo(x, y);
	context.shadowBlur = 20;
	context.shadowColor = fill;
	context.quadraticCurveTo(x, y + 50, x + 50, y + 25);
	context.quadraticCurveTo(x + 75, y + 75, x + 100, y);
	context.quadraticCurveTo(x + 55, y - 50, x + 25, y - 5);
	context.quadraticCurveTo(x, y - 25, x, y + 5);
	context.closePath();
	context.lineWidth = 5;
	context.fillStyle = fill;
	context.fill();
	context.shadowBlur = 0;
}

const cloud = function () {
	cloudCoors.forEach(e => {
		e.x += e.speed;
		if (e.x > context.canvas.width) e.x = 0;
		createCloud(e.x, e.y, e.fill);
	});
}

const reset = function () { }

let hitCount = 0;

const player = function (dir, sword, shield) {
	// Creates and fills the cube for each frame
	if (dir == 1) {
		context.fillStyle = "#dfb791"; // body
		context.beginPath();
		context.rect(square.x, square.y, square.width, square.height);
		context.fill();

		context.strokeStyle = '#000000';	//hair
		context.lineWidth = 3;
		context.strokeRect(square.x, square.y, square.width, 1);	//init x, init y, len of line, box width(keep 1)
		context.lineWidth = 8;
		context.strokeRect(square.x + 2, square.y + 4, 8, 1);

		context.strokeStyle = '#372b89';	//pants
		context.lineWidth = 12;
		context.strokeRect(square.x + 6, square.y + square.width - 8, square.width - 12, 1);

		context.strokeStyle = '#000000';	//eyes
		context.lineWidth = 2;
		context.strokeRect(square.x + square.width - 5, square.y + 10, 2, 2);

		/* context.strokeStyle = '#ff0000';	//cap
		context.lineWidth = 4;
		context.strokeRect(square.x, square.y-2, square.width - 12, 1); */

		context.strokeStyle = '#dfb791';	//hand
		context.lineWidth = 4;
		context.strokeRect(square.x + 10, square.y + square.width - 10, 8, 1);

		if (sword == 0) {	//no space
			context.strokeStyle = '#939595';	//sword
			context.lineWidth = 4;
			context.strokeRect(square.x + 18, square.y + square.width - 10, 16, 1);
		} else {
			context.beginPath();
			context.strokeStyle = '#939595';	//sword
			context.lineWidth = 4;
			context.moveTo(square.x + 18, square.y + square.width - 10);
			context.lineTo(square.x + 18 + 16, square.y + square.width - 20);
			context.stroke();
		}

		if (shield) {
			context.beginPath();
			context.strokeStyle = '#2d5555';	//sword
			context.lineWidth = 4;
			// context.arc(square.x + 16, square.y + 16, 40, 125, Math.PI / 4);	//4th part of circle
			context.arc(square.x + 16, square.y + 16, 40, 0, 2 * Math.PI);
			context.stroke();
		}
	} else {
		context.fillStyle = "#dfb791"; // body
		context.beginPath();
		context.rect(square.x, square.y, square.width, square.height);
		context.fill();

		context.strokeStyle = '#000000';	//hair
		context.lineWidth = 3;
		context.strokeRect(square.x, square.y, square.width, 1);
		context.lineWidth = 8;
		context.strokeRect(square.x + square.width - 10, square.y + 4, 8, 1);

		context.strokeStyle = '#372b89';	//pants
		context.lineWidth = 12;
		context.strokeRect(square.x + 6, square.y + square.width - 8, square.width - 12, 1);

		context.strokeStyle = '#000000';	//eyes
		context.lineWidth = 2;
		context.strokeRect(square.x + 5, square.y + 10, 2, 2);

		/* context.strokeStyle = '#ff0000';	//cap
		context.lineWidth = 4;
		context.strokeRect(square.x, square.y-2, square.width - 12, 1); */

		context.strokeStyle = '#dfb791';	//hand
		context.lineWidth = 4;
		context.strokeRect(square.x + square.width - 18, square.y + square.width - 10, 8, 1);

		if (sword == 0) {	//no space
			context.strokeStyle = '#939595';	//sword
			context.lineWidth = 4;
			context.strokeRect(square.x - 2, square.y + square.width - 10, 16, 1);
		} else {
			context.beginPath();
			context.strokeStyle = '#939595';	//sword
			context.lineWidth = 4;
			context.moveTo(square.x - 2, square.y + square.width - 20);
			context.lineTo(square.x - 2 + 16, square.y + square.width - 10);
			context.stroke();
		}

		if (shield) {
			context.beginPath();
			context.strokeStyle = '#2d5555';	//sword
			context.lineWidth = 4;
			context.arc(square.x + 16, square.y + 16, 40, 0, 2 * Math.PI);
			context.stroke();
		}
	}
}

var dir = 1;
var shieldTime = 100, shieldTimeout = 100;
var shield = 0;

const loop = function () {
	let yVelocity = 0;
	let sword = controller.space ? 1 : 0;
	if (controller.ctrl) {
		if (shieldTime > 0) shield = 1;		//if ctrl pressed, shieldTime>0, then keep shield open
		else {
			shieldTime = 100;				//if shieldTime==0, ctrl pressed, then open shield, restart shieldTime=100
			shield = 1;
		}
	}
	if (shieldTime > 0 && shield == 1) {	//if shieldTime>0 and shield is open, reduce shieldTime
		shieldTime--;
	}
	if (shieldTime == 0) shield = 0;		//if shieldTime==0, close shield

	// if square is falling below floor line for each ground segment, write for loop
	this.groundArray.forEach(e => {
		if (square.x > (e.xInit - 30) && square.x < (e.xEnd)) {	//add logic for basic ground
			yVelocity = e.yVelocity;
			if (controller.left) {
				dir = 0;
				square.xVelocity -= e.xVelocity;
			}
			if (controller.right) {
				dir = 1;
				square.xVelocity += e.xVelocity;
			}
			var sqHeight = e.type == 0 ? square.height : e.type == 1 ? square.height / 2 : square.height;
			if (square.y > (e.yInit - e.lineWidth / 2) - sqHeight) {
				square.jumping = false;
				square.y = (e.yInit - e.lineWidth / 2) - sqHeight;
				square.yVelocity = 0;
			}
		}
	});

	if (controller.up && square.jumping == false) {
		square.yVelocity -= yVelocity;
		upFlag = true;
		square.jumping = true;
	}

	square.yVelocity += 1.5;// gravity
	square.x += square.xVelocity;
	square.y += square.yVelocity;
	square.xVelocity *= 0.9;// friction
	square.yVelocity *= 0.9;// friction

	if (square.x < -20)
		square.x = -20;
	else if (square.x > context.canvas.width)
		square.x = context.canvas.width - 20;

	if (controller.right && square.x > context.canvas.width / 2) {
		if (nextLevel(dir) == 0)
			square.x -= 18;
	} else if (controller.left && square.x < context.canvas.width / 2) {
		if (nextLevel(dir) == 0)
			square.x += 18;
	}

	// Creates the backdrop for each frame
	context.fillStyle = "#b4ddf0";
	context.fillRect(0, 0, 1220, 400); // x, y, width, height

	// Creates the "player" for each frame
	player(dir, sword, shield);

	// Creates the "cloud" for each frame
	cloud();

	// Creates the "ground" for each frame
	ground();

	// call update when the browser is ready to draw again
	window.requestAnimationFrame(loop);
};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
