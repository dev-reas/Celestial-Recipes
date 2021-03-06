const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        var errorCode = error.Code;
        var errorMessage = error.message;

        loginForm['login-email'].setAttribute('class', 'invalid');
        loginForm['login-password'].setAttribute('class', 'invalid');
        const helper = document.querySelector('.helperText');
        helper.setAttribute('data-error', errorMessage);

        loginForm['login-password'].value = "";
    }).then((user) => {
        if (user) {
            loginForm.reset();
            location.replace('index.html');
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

            db.collection("users").where("userUID", "==", user.uid).get().then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    location.replace('index.html');
                }

                else {
                    console.log('undefined');
                    db.collection('users').add({
                        userAddress: 'N/A',
                        userContact: 0000000,
                        userEmail: email,
                        userImg: userImg,
                        userJob: 'N/A',
                        userName: userName,
                        userUID: user.uid,
                    }).catch((e) => {
                        console.log(e);
                    });

                    location.replace('index.html');
                }
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });

        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            const errorText = document.querySelector('#errorMessage');
            errorText.textContent = error.message;
            errorText.style.display = 'initial';
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

            db.collection("users").where("userUID", "==", user.uid).get().then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    location.replace('index.html');
                }

                else {
                    console.log('undefined');
                    db.collection('users').add({
                        userAddress: 'N/A',
                        userContact: 0000000,
                        userEmail: email,
                        userImg: userImg,
                        userJob: 'N/A',
                        userName: userName,
                        userUID: user.uid,
                    }).catch((e) => {
                        console.log(e);
                    });

                    location.replace('index.html');
                }
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });

        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            const errorText = document.querySelector('#errorMessage');
            errorText.textContent = error.message;
            errorText.style.display = 'initial';
        });
});

const resetPassword = document.querySelector('#resetPassword');
resetPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const forgot = document.querySelector('.forgot');

    var emailAddress = resetPassword['emailReset'].value;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        forgot.textContent = 'Reset password sent';
    }).catch(function (error) {
        console.log(error);
    });
});