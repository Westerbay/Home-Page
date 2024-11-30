let articlesArray = {
	0 : {
		"title" : "Eyefox Puzzle",
		"img" : "img/screenshots/coverFox.png",
		"alt" : "EyefoxPuzzle",
		"desc" : "In Eyefox Puzzle, your goal is simple: replicate the grid on the left by manipulating the grid on the right. Each level begins with two grids, one on the left and one on the right.",
		"href" : "EyefoxPuzzle.html"
	},
	1 : {
		"title" : "Lindenmayer",
		"img" : "img/screenshots/sliderLindenmayer3.png",
		"alt" : "Lindenmayer",
		"desc" : "This project is an L-System interpreter developed as a university project. L-Systems are formal systems used to model plant growth, create fractals, and generate algorithmic patterns.",
		"href" : "Lindenmayer.html"
	},
	2 : {
		"title" : "Eyefox Puzzle",
		"img" : "img/screenshots/coverFox.png",
		"alt" : "EyefoxPuzzle",
		"desc" : "In Eyefox Puzzle, your goal is simple: replicate the grid on the left by manipulating the grid on the right. Each level begins with two grids, one on the left and one on the right.",
		"href" : "EyefoxPuzzle.html"
	}
};

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
	const mean = Math.floor(Object.keys(articles).length / 2);
	document.getElementById("left").innerHTML = articles[mean - 1];
	document.getElementById("main").innerHTML = articles[mean];
	document.getElementById("right").innerHTML = articles[mean + 1];
}

function right() {
	var tmp = document.getElementById("left").innerHTML;
	document.getElementById("right").classList.add('hidden');
	document.getElementById("left").classList.add('hidden');
	document.getElementById("main").classList.add('hidden');
	setTimeout(() => {
		document.getElementById("right").innerHTML = document.getElementById("main").innerHTML;
		document.getElementById("left").innerHTML = document.getElementById("main").innerHTML;
		document.getElementById("main").innerHTML = tmp;
		document.getElementById("right").classList.remove('hidden');
		document.getElementById("left").classList.remove('hidden');
		document.getElementById("main").classList.remove('hidden');
	}, 200);	
}

function left() {
	right();
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
