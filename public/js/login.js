const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        var errorCode = error.Code;
        var errorMessage = error.message;

        document.getElementsByClassName("helper-text").innerHTML =  + errorMessage;
        }).then((user) => {
        if (user) {
            loginForm.reset();
            window.location = 'index.html';
        }
    });
});


//google sign in
const googleSignIn = document.querySelector('#googleSignIn');
googleSignIn.addEventListener('click', (e) => {
    var googleProvider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
        .signInWithPopup(googleProvider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            window.location = 'home.html';
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });

});


//facebook sign in
const facebookSignIn = document.querySelector('#facebookSignIn');
facebookSignIn.addEventListener('click', (e) => {
    var facebookProvider = new firebase.auth.FacebookAuthProvider();

    firebase
        .auth()
        .signInWithPopup(facebookProvider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var user = result.user;
            var accessToken = credential.accessToken;
            window.location = 'home.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
});