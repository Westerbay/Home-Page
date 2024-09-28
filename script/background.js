const nbCircle = 9;
const nbRow = 3;

function randomColor() {
	const red = Math.floor(Math.random() * 255);
	const blue = Math.floor(Math.random() * 255);
	return "rgb(" + red + ", " + blue + ", " + blue + ")";
}

function random(a, b) {
	return Math.random() * (b-a) + a;
}

function setBackground() {
	for (let i = 0; i < nbCircle; i++) {
		const circle = document.createElement('div');
		const size = random(50, 270); //200 avant
		const row = i % nbRow;
		const column = Math.floor(i / nbRow);
		var positionX = random(100/nbRow * row, 100/nbRow * (row+1));
		positionX -= 5;
		var positionY = random(100/(nbCircle / nbRow) * column, 100/(nbCircle / nbRow) * (column+1));
		positionY += 5;
		
		circle.style.width = size + "px";
		circle.style.height = size + "px";
		circle.style.left = positionX + "%";
		circle.style.top = positionY + "%";
		circle.style.zIndex = -2;
		circle.style.backgroundColor = randomColor();
		circle.classList.add('circle');
	  
		document.body.appendChild(circle);
	}
}

function main() {
	setBackground();
	for (var element of document.getElementsByTagName("article")) {
		element.style.transform = "translateX(0)";
		element.style.opacity = 100;
	}
	for (var element of document.getElementsByTagName("aside")) {
		element.style.transform = "translateX(0)";
		element.style.opacity = 100;
	}
}


	
