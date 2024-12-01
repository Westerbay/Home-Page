let articlesArray = {
	0 : {
		"title" : "High School Project",
		"img" : "img/screenshots/highschool1.png",
		"alt" : "HighSchoolProject",
		"desc" : "This project is a 2D platformer build with Python, featuring gravity and collision physics.",
		"href" : "HighSchoolProject.html"
	},
	1 : {
		"title" : "Farworld",
		"img" : "img/screenshots/farworld3.png",
		"alt" : "Farworld",
		"desc" : "This project is a card game build with Python in french. It was a group effort for the final semester of the first year in a Bachelor's degree in Mathematics.",
		"href" : "Farworld.html"
	},
	2 : {
		"title" : "Battle Brawlers Card Game",
		"img" : "img/screenshots/battle.png",
		"alt" : "BattleBrawlersCardGame",
		"desc" : "Battle Brawlers Card Game is a turn-based strategy game where every card, every Brawler, and every move counts!",
		"href" : "BattleBrawlersCardGame.html"
	},
	3 : {
		"title" : "Minidex",
		"img" : "img/screenshots/minidex.png",
		"alt" : "Minidex",
		"desc" : "This project is a a web scraping tool in Python to extract Pokémon data from the French website Poképédia.",
		"href" : "Minidex.html"
	},
	4 : {
		"title" : "It adds up",
		"img" : "img/screenshots/math2.png",
		"alt" : "ItAddsUp",
		"desc" : "This project is a Python version of The Countdown Game.",
		"href" : "ItAddsUp.html"
	},
	5 : {
		"title" : "Taquin's Sudoku",
		"img" : "img/screenshots/taquin1.png",
		"alt" : "TaquinSudoku",
		"desc" : "This project is a game where you can play the classic 15-puzzle (sliding puzzle), Sudoku, and a new hybrid mode that combines both.",
		"href" : "TaquinSudoku.html"
	}
};

let index = 2;
const size = 6;

function createArticle(article) {
	content = `<h2>${article['title']}</h2>`;
	content += "<figure>";
	content += `<img src="${article['img']}" alt="${article['alt']}">`;
	content += `<figcaption>${article['desc']}</figcaption>`;
	content += "</figure>";
	content += `<a href="${article['href']}">More About</a>`;
	return content;
}

let articles = {};

for (var article in articlesArray) {
	articles[article] = createArticle(articlesArray[article]);
}

function display() {
	let leftIndex = (index - 1 + size) % size;
	let rightIndex = (index + 1) % size;
	document.getElementById("right").innerHTML = articles[rightIndex];
	document.getElementById("left").innerHTML = articles[leftIndex];
	document.getElementById("main").innerHTML = articles[index];
}

function update() {
	document.getElementById("right").classList.add('hidden');
	document.getElementById("left").classList.add('hidden');
	document.getElementById("main").classList.add('hidden');
	let leftIndex = (index - 1 + size) % size;
	let rightIndex = (index + 1) % size;
	setTimeout(() => {
		document.getElementById("right").innerHTML = articles[rightIndex];
		document.getElementById("left").innerHTML = articles[leftIndex];
		document.getElementById("main").innerHTML = articles[index];
		document.getElementById("right").classList.remove('hidden');
		document.getElementById("left").classList.remove('hidden');
		document.getElementById("main").classList.remove('hidden');
	}, 200);
}

function right() {
	index = (index + 1) % size;
	update();
}

function left() {
	index = (index - 1 + size) % size;
	update();
}


let startX;
let endX;
let minSwipeDistance = 30;

document.addEventListener('touchstart', function(event) {
	startX = event.touches[0].pageX;
}, false);

document.addEventListener('touchend', function(event) {
	endX = event.changedTouches[0].pageX;
	let distance = endX - startX;
	if (distance > minSwipeDistance) {
		right();
	}
	else if (distance < -minSwipeDistance) {
		left();
	}
}, false);
