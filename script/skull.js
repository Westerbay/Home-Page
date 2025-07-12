function makeHeader() {
    const header = document.createElement("header");
    header.innerHTML = `
        <a href="https://westerbay.github.io/Home-Page/">
            <img src="https://westerbay.github.io/Home-Page/img/icon.png" alt="" class="circle">
            <img src="https://westerbay.github.io/Home-Page/img/wester.png" alt="Wester">
        </a>
        <nav>
            <a href="https://westerbay.github.io/Home-Page/" id="navHome">Home</a>
            <a href="https://westerbay.github.io/Home-Page/Project.html" id="navProject">Project</a>
            <a href="https://westerbay.github.io/Home-Page/Prototype.html" id="navPrototype">Prototype</a>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);
}

function makeFooter() {
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <nav>
            <a href="https://www.youtube.com/@Westerbay" target="_blank"><img src="https://westerbay.github.io/Home-Page/logo/yt.png" alt="Youtube"></a>
            <a href="https://github.com/Westerbay" target="_blank"><img src="https://westerbay.github.io/Home-Page/logo/github.svg" alt="GitHub"></a>
            <a href="https://westerbay.itch.io/" target="_blank"><img src="https://westerbay.github.io/Home-Page/logo/itchIO.png" alt="itch.io"></a>
            <a href="https://play.google.com/store/apps/dev?id=5075211406810866844" target="_blank"><img src="https://westerbay.github.io/Home-Page/logo/playStore.png" alt="Google Play Store"></a>
            <a href="https://www.linkedin.com/in/mathis-dubuisson" target="_blank"><img src="https://westerbay.github.io/Home-Page/logo/LinkedIn.png" alt="LinkedIn"></a>
        </nav>
    `;
    document.body.appendChild(footer);
}

function load(pagename) {
    makeHeader();
    makeFooter();
    try {
        const idNav = `nav${pagename}`;
        const navElement = document.getElementById(idNav);
        navElement.classList.add("selected");
    } catch (ignored) {}
}
