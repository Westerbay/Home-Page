document.querySelectorAll('.rating').forEach(el => {
    const value = parseInt(el.textContent.trim(), 10);
    el.style.setProperty('--value', value);
    el.textContent = "";

    let color;
    if (value >= 75) color = "linear-gradient(90deg, #00c853, #64dd17)"; 
    else if (value >= 50) color = "linear-gradient(90deg, #ffeb3b, #ffc107)"; 
    else color = "linear-gradient(90deg, #ff5722, #e53935)"; 

    el.querySelector("::before"); 
    el.style.setProperty("--gradient", color);
});
