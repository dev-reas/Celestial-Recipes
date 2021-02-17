const webSignout = document.querySelector('#web');
webSignout.addEventListener('click', (e) => {
    auth.signOut();
    location.replace('auth.html');
    // location.replace('https://celestial-recipes.web.app/auth.html');
});

const mobileSignOut = document.querySelector('#mobile');
mobileSignOut.addEventListener('click', (e) => {
    auth.signOut();
    location.replace('auth.html');
    // location.replace('https://celestial-recipes.web.app/auth.html');
});