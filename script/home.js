const aboutButton = document.getElementById("aboutButton");
const aboutSection = document.getElementById("about");

aboutButton.addEventListener('click', () => {
    aboutButton.classList.toggle("hidden");
    aboutSection.classList.toggle("hidden");
});
