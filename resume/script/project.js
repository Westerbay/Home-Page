var backgroundColor = "rgb(40, 40, 40)";
var hoverColor = "grey";

var container = document.getElementById("container");
var containerWidth = 39;

var projectEyefox = document.getElementById("project1");
var projectBattle = document.getElementById("project2");
var projectLindenmayer = document.getElementById("project5");
var projectTaquinSudoku = document.getElementById("project6");
var projectGDC = document.getElementById("project7");
var selectedProject = projectEyefox;

var corrButton = new Map();
corrButton.set(projectEyefox, 0);
corrButton.set(projectBattle, 1);
corrButton.set(projectLindenmayer, 2);
corrButton.set(projectTaquinSudoku, 3);
corrButton.set(projectGDC, 4);

function selectEyefox() {
	selectedProject.style.background = backgroundColor;
	projectEyefox.style.background = hoverColor;
	selectedProject = projectEyefox;
	container.style.transform = "translateX(0)";
}

function selectBattle() {
	selectedProject.style.background = backgroundColor;
	projectBattle.style.background = hoverColor;
	selectedProject = projectBattle;
	container.style.transform = "translateX(-" + containerWidth + "em)";
}

function selectLindenmayer() {
	selectedProject.style.background = backgroundColor;
	projectLindenmayer.style.background = hoverColor;
	selectedProject = projectLindenmayer;
	container.style.transform = "translateX(-" + containerWidth*2 + "em)";
}

function selectTaquinSudoku() {
	selectedProject.style.background = backgroundColor;
	projectTaquinSudoku.style.background = hoverColor;
	selectedProject = projectTaquinSudoku;
	container.style.transform = "translateX(-" + containerWidth*3 + "em)";
}

function selectGDC() {
	selectedProject.style.background = backgroundColor;
	projectGDC.style.background = hoverColor;
	selectedProject = projectGDC;
	container.style.transform = "translateX(-" + containerWidth*4 + "em)";
}


var tabFunction = [
	selectEyefox, 
	selectBattle,
	selectLindenmayer,
	selectTaquinSudoku,
	selectGDC
];

function buttonRight() {
	tabFunction[(corrButton.get(selectedProject) + 1) % tabFunction.length]();
}

function buttonLeft() {
	var index = corrButton.get(selectedProject) - 1;
	if (index == -1) {
		index = tabFunction.length - 1;
	}
	tabFunction[index % tabFunction.length]();
}

