const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get value
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const firstName = signupForm['firstName'].value;
    const lastName = signupForm['lastName'].value;
    const passwordText = document.querySelector('.passwordText');

    if (password.length > 8) {
        signupForm['signup-password'].removeAttribute('class', 'invalid');
    }

    else {
        signupForm['signup-password'].setAttribute('class', 'invalid');
        passwordText.setAttribute('data-error', 'Password must be greater than 8 characters');
    }
    // auth.createUserWithEmailAndPassword(email, password).then((user) => {
    //     if (user) {
    //         var signupUser = firebase.auth().currentUser;

    //         signupUser.updateProfile({
    //             displayName: firstName + ' ' + lastName,
    //             photoURL: "https://static.vecteezy.com/system/resources/thumbnails/000/364/628/original/Chef_Avatar_Illustration-03.jpg"

    //         }).then(function () {
    //             console.log('update confirmed');
    //             window.location = 'index.html';
    //         }).catch(function (error) {
    //             console.log(error);
    //         });

    //         db.collection('users').add({
    //             userAddress: 'N/A',
    //             userContact: 0000000,
    //             userEmail: signupUser.email,
    //             userImg: 'https://static.vecteezy.com/system/resources/thumbnails/000/364/628/original/Chef_Avatar_Illustration-03.jpg',
    //             userJob: 'N/A',
    //             userName: firstName + ' ' + lastName,
    //             userUID: signupUser.uid,
    //         });
    //     }
    // });
});