function show(className) {
	const articles = document.querySelectorAll("article");
    articles.forEach(article => {
        article.style.display = "none";
    });
	const profileHide = document.getElementsByClassName('profile');
    for (let i = 0; i < profileHide.length; i++) {
        profileHide[i].style.display = "none";
    }
	const sectionToShow = document.getElementsByClassName(className);
    for (let i = 0; i < sectionToShow.length; i++) {
		var type = className == 'skills' ? "inline-block" : "block";
        sectionToShow[i].style.display = type;
    }
}
