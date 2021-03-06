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
		lineWidth: 120,
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
// updateFrame
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
	v: false,
	enter: false,
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
			case 86://v key
				controller.v = key_state;
				break;
			case 13://enter key
				controller.enter = key_state;
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

const player = function (dir, shield, shieldTime, weapon, weaponReady) {		//weapon: sword/bow/spear
	context.fillStyle = "#dfb791"; // body
	context.beginPath();
	context.rect(square.x, square.y, square.width, square.height);
	context.fill();

	context.strokeStyle = '#000000';	//hair
	context.lineWidth = 3;
	context.strokeRect(square.x, square.y, square.width, 1);	//init x, init y, len of line, box width(keep 1)

	if (dir == 1) {
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

		switch (weapon) {
			case 'sword':
				if (weaponReady == 0) {	//no space
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
				break;
			case 'bow':
				if (weaponReady == 0) {								//bow
					context.strokeStyle = '#939595';
					context.lineWidth = 4;
					context.strokeRect(square.x + 18, square.y + square.width - 10, 30, 1);
					context.beginPath();
					context.arc(square.x + 4, square.y + 16, 40, 125, Math.PI / 4);
					context.stroke();
				} else {									//shooting arrow
					context.strokeStyle = '#000000';
					context.lineWidth = 4;
					context.strokeRect(square.x + 36, square.y + square.width - 10, 30, 1);
					context.beginPath();
					context.strokeStyle = '#939595';
					context.arc(square.x + 4, square.y + 16, 40, 125, Math.PI / 4);
					context.stroke();
				}
				break;
			case 'hand':
				if (weaponReady == 1) {
					context.strokeStyle = '#000000';
					context.lineWidth = 2;
					context.strokeRect(square.x + 36, square.y + square.width - 20, 10, 10);
				}
				break;
			default:
				break;
		}
	} else {
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

		switch (weapon) {
			case 'sword':
				if (weaponReady == 0) {	//no space
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
				break;
			case 'bow':
				if (weaponReady == 0) {								//bow
					context.strokeStyle = '#939595';
					context.lineWidth = 4;
					context.strokeRect(square.x - 16, square.y + square.width - 10, 30, 1);
					context.beginPath();
					context.arc(square.x + 30, square.y + 16, 40, 0.75 * Math.PI, 1.20 * Math.PI);
					context.stroke();
				} else {									//shooting arrow
					context.strokeStyle = '#000000';
					context.lineWidth = 4;
					context.strokeRect(square.x - 34, square.y + square.width - 10, 30, 1);
					context.beginPath();
					context.strokeStyle = '#939595';
					context.arc(square.x + 30, square.y + 16, 40, 0.75 * Math.PI, 1.20 * Math.PI);
					context.stroke();
				}
				break;
			case 'hand':
				if (weaponReady == 1) {
					context.strokeStyle = '#000000';
					context.lineWidth = 2;
					context.strokeRect(square.x - 14, square.y + square.width - 20, 10, 10);
				}
				break;
			default:
				break;
		}
	}

	if (shield) {
		context.beginPath();
		context.shadowBlur = 5;
		context.shadowColor = '#2d5555';
		context.strokeStyle = '#2d5555';	//shield
		context.lineWidth = shieldTime % 20 == 0 ? 10 : 4;
		context.arc(square.x + 16, square.y + 16, 40, 0, 2 * Math.PI);
		context.stroke();
		context.shadowBlur = 0;
	}
}

var dir = 1;
var shieldTime = 100, shieldTimeout = 0, singleShieldout = false;
var shield = 0;
var weapons = ['hand', 'sword', 'bow'], weaponIndex = 0, weaponChangeTimeout = 0;

const loop = function () {
	let yVelocity = 0;
	let weaponReady = controller.space ? 1 : 0;
	if (controller.v && weaponChangeTimeout == 0) {
		weaponIndex += 1;
		if (weaponIndex >= weapons.length)
			weaponIndex = 0;
		weaponChangeTimeout = 20;
	}
	if (weaponChangeTimeout > 0) weaponChangeTimeout--;
	// res.textContent = weaponIndex;	//use to monitor variables
	if (controller.ctrl) {
		if (shieldTimeout == 0) {
			if (shieldTime > 0 && shieldTimeout == 0) shield = 1;		//if ctrl pressed, shieldTime>0, then keep shield open
			else {
				shieldTime = 100;				//if shieldTime==0, ctrl pressed, then open shield, restart shieldTime=100
				shield = 1;
			}
		}
	}
	if (shieldTime > 0 && shield == 1) {	//if shieldTime>0 and shield is open, reduce shieldTime
		shieldTime--;
		singleShieldout = false;
	}
	if (shieldTimeout > 0)		//write logic for shield timeout
		shieldTimeout--;
	if (shieldTime == 0) {		//if shieldTime==0, close shield
		if (shieldTimeout <= 0 && !singleShieldout) {
			shieldTimeout = 150;
			singleShieldout = true;
		}
		shield = 0;
	}

	// if square is falling below floor line for each ground segment, write for loop
	groundArray.forEach((e, i) => {	// add logic: if next height is greater than square.height/2, then don't proceed, only jump proceed
		// var i = 0;
		// for (; i < groundArray.length; i++) {
		// var e = groundArray[i];
		var e2 = {};
		if (square.x > (e.xInit - 30) && square.x < (e.xEnd)) {	//add logic for basic ground
			yVelocity = e.yVelocity;
			if (controller.left) {
				dir = 0;
				if (i != 0)
					e2 = groundArray[i - 1];
				// res.textContent = (e2.yInit - (e2.lineWidth * 0.5)) + ':' + (e.yInit - (e.lineWidth * 0.5));
				res.textContent = (e2.yInit) + ':' + (e2.lineWidth * 0.5) + ',' + (e.yInit) + ':' + ((e.lineWidth * 0.5));
				// need to correct below logic
				if (
					(square.x < e.xInit)
					&&
					((e.yInit - (e.lineWidth * 0.5)) - (e2.yInit - (e2.lineWidth * 0.5)) > 24)
					&& (square.jumping == false)
				)
					square.x = e.xInit;
				else
					square.xVelocity -= e.xVelocity;
			}
			if (controller.right) {
				dir = 1;
				if (i != groundArray.length - 1)
					e2 = groundArray[i + 1];
				if ((square.x + square.width > e.xEnd)
					&& ((e.yInit - (e.lineWidth * 0.5)) - (e2.yInit - (e2.lineWidth * 0.5)) > 24)
					&& (square.jumping == false))
					square.x = e.xEnd - square.width;
				else
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
	// }

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
	else if (square.x > context.canvas.width - 20)
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
	// (dir, shield, shieldTime, weapon, weaponReady)
	player(dir, shield, shieldTime, weapons[weaponIndex], weaponReady);

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
