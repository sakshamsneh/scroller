const context = document.querySelector("canvas").getContext("2d");
const res = document.querySelector("#res");

context.canvas.height = 400;
context.canvas.width = 1220;

// Start the frame count at 1
let frameCount = 1;
// Set the number of obstacles to match the current "level"
let obCount = frameCount;
// Create a collection to hold the generated x coordinates
const obXCoors = [];
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
];

let leftLen = context.canvas.width;
// Create the obstacles for each frame
const nextLevel = () => {
	// increase the frame / "level" count
	frameCount++;
	for (let i = 0; i < obCount; i++) {
		// Randomly generate the x coordinate for the top corner start of the triangles
		obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
		obXCoors.push(obXCoor);
	}

	// var groundCount = Math.floor(Math.random() * (10));
	/*var prevXCoor = 0;
	groundArray = [{
		strokeStyle: '#594243',
		lineWidth: 30,
		xInit: 0,
		yInit: 385,
		xEnd: 1220,
		yEnd: 385
	}];
	for (let i = 0; i < 5; i++) {
		var XCoor = Math.floor(Math.random() * (context.canvas.width - prevXCoor)) + prevXCoor;
		var lWidth = Math.floor(Math.random() * (5));
		len = Math.floor(Math.random() * ((leftLen / (5 - i)) - 200)) + 200;
		leftLen -= len;
		groundArray.push({
			strokeStyle: '#594243',
			lineWidth: lWidth * 30,
			xInit: XCoor,
			yInit: 385,
			xEnd: XCoor + len,
			yEnd: 385
		});
		prevXCoor = XCoor + len;
		if (leftLen < 100) break;
	}
	groundArray.sort((a, b) => a.xInit >= b.xInit ? 1 : -1); */
}

const controller = {
	left: false,
	right: false,
	up: false,
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
		if (e.type == 1)
			context.globalAlpha = 0.5;
		else
			context.globalAlpha = 1;
		context.strokeStyle = e.strokeStyle;
		context.lineWidth = e.lineWidth;
		context.beginPath();
		context.moveTo(e.xInit, e.yInit);
		context.lineTo(e.xEnd, e.yEnd);
		context.stroke();
	});
}

const createCloud = function (x, y, fill) {
	context.beginPath();
	context.moveTo(x, y);
	// context.bezierCurveTo(130, 100, 130, 150, 230, 150);
	// context.bezierCurveTo(250, 180, 320, 180, 340, 150);
	// context.bezierCurveTo(420, 150, 420, 120, 390, 100);
	// context.bezierCurveTo(430, 40, 370, 30, 340, 50);
	// context.bezierCurveTo(320, 5, 250, 20, 250, 50);
	// context.bezierCurveTo(200, 5, 150, 20, 170, 80);
	context.quadraticCurveTo(x, y + 50, x + 50, y + 25);
	context.quadraticCurveTo(x + 50, y + 50, x + 125, y - 5);
	context.quadraticCurveTo(x + 75, y - 50, x + 75, y - 25);
	context.quadraticCurveTo(x, y - 25, x, y + 5);
	context.closePath();
	context.lineWidth = 5;
	context.fillStyle = fill;
	context.fill();
}

const cloud = function () {
	cloudCoors.forEach(e => {
		e.x += e.speed;
		if (e.x > context.canvas.width)
			e.x = 0;
		/* cloudimg = new Image();
		cloudimg.src = 'http://silveiraneto.net/wp-content/uploads/2011/06/cloud.png';
		context.drawImage(cloudimg, e.x, 0); */
		createCloud(e.x, e.y, e.fill);
	});
}
const reset = function () { }

let hitCount = 0;

const loop = function () {
	// if square is falling below floor line for each ground segment, write for loop
	let yVelocity = 0;
	this.groundArray.forEach(e => {
		if (square.x > (e.xInit - 30) && square.x < (e.xEnd)) {	//add logic for basic ground
			yVelocity = e.yVelocity;
			if (controller.left) {
				square.xVelocity -= e.xVelocity;
			}
			if (controller.right) {
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

	// obstacle hit
	obXCoors.forEach(obXCoor => {
		var groundObj = {};
		this.groundArray.forEach(e => {
			if (obXCoor > (e.xInit) && obXCoor < (e.xEnd))
				groundObj = e;
		});

		let obYCoor = groundObj.yInit - groundObj.lineWidth / 2;
		if ((square.x > (obXCoor - 32) && square.x < (obXCoor + 20 - 32))) {// && (square.y < obYCoor && square.y > (obYCoor - 32))) {
			hitCount++;
		}
	});

	// if square is going off the left of the screen
	if (square.x < -20) {
		square.x = 1220;
	} else if (square.x > 1220) {// if square goes past right boundary
		square.x = -20;
		res.textContent = hitCount;
		nextLevel();
	}

	// Creates the backdrop for each frame
	context.fillStyle = "#b4ddf0";
	context.fillRect(0, 0, 1220, 400); // x, y, width, height

	// Creates and fills the cube for each frame
	context.fillStyle = "#4f5f58"; // hex for cube color
	context.beginPath();
	context.rect(square.x, square.y, square.width, square.height);
	context.fill();

	// Creates the "cloud" for each frame
	cloud();

	// Creates the "ground" for each frame
	ground();

	// Create the obstacles for each frame
	// Set the standard obstacle height
	const height = 200 * Math.cos(Math.PI / 6);

	context.fillStyle = "#FBF5F3"; // hex for triangle color
	obXCoors.forEach((obXCoor) => {
		context.beginPath();
		var groundObj = {};
		this.groundArray.forEach(e => {
			if (obXCoor > (e.xInit) && obXCoor < (e.xEnd))
				groundObj = e;
		});

		let obYCoor = groundObj.yInit - groundObj.lineWidth / 2;
		context.moveTo(obXCoor, obYCoor); // x = random, y = coor. on "ground"
		context.lineTo(obXCoor + 20, obYCoor); // x = ^random + 20, y = coor. on "ground"
		context.lineTo(obXCoor + 10, obYCoor - square.height); // x = ^random + 10, y = peak of triangle

		context.closePath();
		context.fill();
	});

	// call update when the browser is ready to draw again
	window.requestAnimationFrame(loop);
};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
