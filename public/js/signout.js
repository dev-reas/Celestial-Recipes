const webSignout = document.querySelector('#web');
webSignout.addEventListener('click', (e) => {
    auth.signOut();
    location.replace('auth.html');
});

const mobileSignOut = document.querySelector('#mobile');
mobileSignOut.addEventListener('click', (e) => {
    auth.signOut();
    location.replace('auth.html');
});