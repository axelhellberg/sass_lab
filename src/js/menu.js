const toggleMenu = function(e) {
    if (!e.target.classList.contains('menu-btn')) return;
    e.target.classList.toggle('close');
    document.getElementById('main-menu').classList.toggle('closed');
}

document.addEventListener('click', toggleMenu, false);

document.addEventListener('mousedown', function(e) {
    if (!e.target.classList.contains('menu-btn')) return;
    e.preventDefault();
}, false);

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' || e.key === ' ') toggleMenu(e); // allow enter and space for toggle
}, false);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') e.target.blur(); // remove focus with escape key
}, false);