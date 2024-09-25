var backgroundColor = "rgb(40, 40, 40)";
var hoverColor = "grey";

var container = document.getElementById("container");
var containerWidth = 39;

var projectEyefox = document.getElementById("project1");
var projectBattle = document.getElementById("project2");
var projectMinidex = document.getElementById("project3");
var projectAddsUp = document.getElementById("project4");
var projectLindenmayer = document.getElementById("project5");
var projectTaquinSudoku = document.getElementById("project6");
var projectGDC = document.getElementById("project7");
var projectNation = document.getElementById("project8");
var selectedProject = projectEyefox;

var corrButton = new Map();
corrButton.set(projectEyefox, 0);
corrButton.set(projectBattle, 1);
corrButton.set(projectMinidex, 2);
corrButton.set(projectAddsUp, 3);
corrButton.set(projectLindenmayer, 4);
corrButton.set(projectTaquinSudoku, 5);
corrButton.set(projectGDC, 6);
corrButton.set(projectNation, 7);

function main() {
	selectEyefox();
	for (var element of document.getElementsByTagName("article")) {
		element.style.transform = "translateX(0)";
		element.style.opacity = 100;
	}
	for (var element of document.getElementsByTagName("aside")) {
		element.style.transform = "translateX(0)";
		element.style.opacity = 100;
	}
}

function changeLogo2(logoName1, logoName2) {
	var logo = document.getElementsByClassName("LogoCode");
	var logo1 = logo[0];
	var logo2 = logo[1];
	
	logo1.classList.add('fade-out');
	logo2.classList.add('fade-out');
	
	setTimeout(function() {
		logo1.src = 'img/logo/' + logoName1 + '.png';
		logo2.src = 'img/logo/' + logoName2 + '.png';
		
		logo1.onload = function() {
			logo1.classList.remove('fade-out');
		};
		logo2.onload = function() {
			logo2.classList.remove('fade-out');
		};
	}, 500);
	
}

function changeLogo(logo) {
	changeLogo2(logo, logo);
}

function selectEyefox() {
	selectedProject.style.background = backgroundColor;
	projectEyefox.style.background = hoverColor;
	selectedProject = projectEyefox;
	container.style.transform = "translateX(0)";
	changeLogo('Python');
}

function selectBattle() {
	selectedProject.style.background = backgroundColor;
	projectBattle.style.background = hoverColor;
	selectedProject = projectBattle;
	container.style.transform = "translateX(-" + containerWidth + "em)";
	changeLogo('Python');
}

function selectMinidex() {
	selectedProject.style.background = backgroundColor;
	projectMinidex.style.background = hoverColor;
	selectedProject = projectMinidex;
	container.style.transform = "translateX(-" + containerWidth*2 + "em)";
	changeLogo('Python');
}

function selectAddsUp() {
	selectedProject.style.background = backgroundColor;
	projectAddsUp.style.background = hoverColor;
	selectedProject = projectAddsUp;
	container.style.transform = "translateX(-" + containerWidth*3 + "em)";
	changeLogo('Python');
}

function selectLindenmayer() {
	selectedProject.style.background = backgroundColor;
	projectLindenmayer.style.background = hoverColor;
	selectedProject = projectLindenmayer;
	container.style.transform = "translateX(-" + containerWidth*4 + "em)";
	changeLogo('Java');
}

function selectTaquinSudoku() {
	selectedProject.style.background = backgroundColor;
	projectTaquinSudoku.style.background = hoverColor;
	selectedProject = projectTaquinSudoku;
	container.style.transform = "translateX(-" + containerWidth*5 + "em)";
	changeLogo('Python');
}

function selectGDC() {
	selectedProject.style.background = backgroundColor;
	projectGDC.style.background = hoverColor;
	selectedProject = projectGDC;
	container.style.transform = "translateX(-" + containerWidth*6 + "em)";
	changeLogo2('cpp', 'C');
}

function selectNation() {
	selectedProject.style.background = backgroundColor;
	projectNation.style.background = hoverColor;
	selectedProject = projectNation;
	container.style.transform = "translateX(-" + containerWidth*7 + "em)";
	changeLogo('Java');
}

var tabFunction = [
	selectEyefox, 
	selectBattle,
	selectMinidex,
	selectAddsUp,	
	selectLindenmayer,
	selectTaquinSudoku,
	selectGDC,
	selectNation
];

function buttonRight() {
	tabFunction[(corrButton.get(selectedProject) + 1) % 8]();
}

function buttonLeft() {
	tabFunction[(corrButton.get(selectedProject) - 1) % 8]();
}

