const googleSignIn = document.querySelector('#googleSignIn');
const username = document.querySelector('#userName');

googleSignIn.addEventListener('click', (e) => {
    e.preventDefault(); // optional

    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            console.log(user);
            window.location = 'index.html';
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
});

auth.onAuthStateChanged((user) => {
    if (user) {
        
    } else {

    }
});