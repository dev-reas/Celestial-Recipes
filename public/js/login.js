const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        var errorCode = error.Code;
        var errorMessage = error.message;

        document.getElementsByClassName("helper-text").innerHTML = + errorMessage;
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

            let userName = '';
            let email = '';
            let userImg = '';

            user.providerData.forEach(function (profile) {
                console.log("Sign-in provider: " + profile.providerId);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
                userName = profile.displayName;
                email = profile.email;
                userImg = profile.photoURL;
            });

            var docRef = db.collection("users").doc(user.uid);

            docRef.get().then(function (doc) {
                if (doc.exists) {
                    window.location = 'index.html';
                }
                else {
                    db.collection('users').doc(user.uid).set({
                        userAddress: 'N/A',
                        userContact: 0000000,
                        userEmail: email,
                        userImg: userImg,
                        userJob: 'N/A',
                        userName: userName,
                        userUID: user.uid,
                    }).then(() => {
                        window.location = 'home.html';
                    }).catch((e) => {
                        console.log(e);
                    });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            console.log(error);
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

            let userName = '';
            let email = '';
            let userImg = '';
            user.providerData.forEach(function (profile) {
                console.log("Sign-in provider: " + profile.providerId);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
                userName = profile.displayName;
                email = profile.email;
                userImg = profile.photoURL;
            });
            var docRef = db.collection("users").doc(user.uid);

            docRef.get().then(function (doc) {
                if (doc.exists) {
                    window.location = 'index.html';
                }
                else {
                    db.collection('users').doc(user.uid).set({
                        userAddress: 'N/A',
                        userContact: 0000000,
                        userEmail: email,
                        userImg: userImg,
                        userJob: 'N/A',
                        userName: userName,
                        userUID: user.uid,
                    }).then(() => {
                        window.location = 'home.html';
                    }).catch((e) => {
                        console.log(e);
                    });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            console.log(error);
        });
});

