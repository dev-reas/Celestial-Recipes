//listen to auth status changes

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('user logged in :', user);
        setupUI(user);
    }

    else {
        setupUI();
        if(window.location.href == 'http://localhost:5000/profile.html'){
            var urlLink = "localhost:5000";
            window.location.replace('login-page.html')
        }
    }
});

