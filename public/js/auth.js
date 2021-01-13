//listen to auth status changes

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('user logged in :', user);
        setupUI(user);
    }

    else {
        setupUI();
    }
});

