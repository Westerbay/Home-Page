var backgroundColor = "darkblue";
var hoverColor = "blue";

var projectContent = document.getElementById("projectContent");

var projectEyefox = document.getElementById("project1");
var projectBattle = document.getElementById("project2");
var projectMinidex = document.getElementById("project3");
var projectAddsUp = document.getElementById("project4");
var projectLindenmayer = document.getElementById("project5");
var projectTaquinSudoku = document.getElementById("project6");
var projectGDC = document.getElementById("project7");
var projectNation = document.getElementById("project8");
var selectedProject = projectEyefox;

function selectEyefox() {
	selectedProject.style.background = backgroundColor;
	projectEyefox.style.background = hoverColor;
	selectedProject = projectEyefox;
	projectContent.innerHTML = `
				<img src='img/logo/Python.png' alt='python'>
				<h2>Eyefox Puzzle</h2>
				<h3>Personnal Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/puzzle.png' alt='Eyefox Puzzle'>
	`;
}

function selectBattle() {
	selectedProject.style.background = backgroundColor;
	projectBattle.style.background = hoverColor;
	selectedProject = projectBattle;
	projectContent.innerHTML = `
				<img src='img/logo/Python.png' alt='python'>
				<h2>Card Game</h2>
				<h3>Personnal Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/battle.png' alt='Eyefox Puzzle'>
	`;
}

function selectMinidex() {
	selectedProject.style.background = backgroundColor;
	projectMinidex.style.background = hoverColor;
	selectedProject = projectMinidex;
	projectContent.innerHTML = `
				<img src='img/logo/Python.png' alt='python'>
				<h2>Minidex [FR]</h2>
				<h3>Personnal Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/minidex.png' alt='Eyefox Puzzle'>
	`;
}

function selectAddsUp() {
	selectedProject.style.background = backgroundColor;
	projectAddsUp.style.background = hoverColor;
	selectedProject = projectAddsUp;
	projectContent.innerHTML = `
				<img src='img/logo/Python.png' alt='python'>
				<h2>It Adds Up</h2>
				<h3>Personnal Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/AddsUp.png' alt='Eyefox Puzzle'>
	`;
}

function selectLindenmayer() {
	selectedProject.style.background = backgroundColor;
	projectLindenmayer.style.background = hoverColor;
	selectedProject = projectLindenmayer;
	projectContent.innerHTML = `
				<img src='img/logo/Java.png' alt='Java'>
				<h2>L-Systems</h2>
				<h3>School Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/Lindenmayer.png' alt='Eyefox Puzzle'>
	`;
}

function selectTaquinSudoku() {
	selectedProject.style.background = backgroundColor;
	projectTaquinSudoku.style.background = hoverColor;
	selectedProject = projectTaquinSudoku;
	projectContent.innerHTML = `
				<img src='img/logo/Python.png' alt='python'>
				<h2>Taquin's Sudoku</h2>
				<h3>Personnal Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/TaquinSudoku.png' alt='Eyefox Puzzle'>
	`;
}

function selectGDC() {
	selectedProject.style.background = backgroundColor;
	projectGDC.style.background = hoverColor;
	selectedProject = projectGDC;
	projectContent.innerHTML = `
				<img src='img/logo/C.png' alt='C'>
				<h2>Race Event</h2>
				<h3>School Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/GDC.png' alt='Eyefox Puzzle'>
	`;
}

function selectNation() {
	selectedProject.style.background = backgroundColor;
	projectNation.style.background = hoverColor;
	selectedProject = projectNation;
	projectContent.innerHTML = `
				<img src='img/logo/Java.png' alt='java'>
				<h2>Nation's Waltz</h2>
				<h3>Personnal Project</h3>
				<p>
					This game is a python project where you have to reproduce the left's grid by modifying the right's grid. How does it work?  Tap a square to swap its face and its neighbors' face. Be careful, the difficulty is considerably growing up every 30 levels. 
				</p>
				<img src='img/project/nation.png' alt='Eyefox Puzzle'>
	`;
}

