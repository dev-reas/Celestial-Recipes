// sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get value
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const firstName = signupForm['firstName'].value;
    const lastName = signupForm['lastName'].value;

    auth.createUserWithEmailAndPassword(email, password).then((user) => {
        if (user) {
            var signupUser = firebase.auth().currentUser;

            signupUser.updateProfile({
                displayName: firstName + ' ' + lastName,
                photoURL: "https://static.vecteezy.com/system/resources/thumbnails/000/364/628/original/Chef_Avatar_Illustration-03.jpg"
            }).then(function () {
                console.log('update confirmed');
                window.location('index.html');
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
});
