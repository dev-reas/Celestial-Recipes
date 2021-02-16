//listen to auth status changes
const profileAuth = document.querySelectorAll('.profileAuth');
auth.onAuthStateChanged((user) => {
    if (user) {
        setupUI(user);
        renderUser(user);
        if (profileAuth) {
            profileAuth.forEach(item => {
                item.setAttribute('href', `profile.html?user=${encodeURIComponent(user.uid)}`);
            });
        }
    }

    else {
        setupUI();
        // if (window.location.href == 'http://localhost:5000/profile.html') {
        //     window.location.replace('auth.html');
        // }

        // if (window.location.href == 'http://https://celestial-recipes.web.app/profile.html') {
        //     window.location.replace('auth.html');
        // }
    }
});

const loggedOutlinks = document.querySelectorAll('.logged-out');
const loggedInlinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
    if (user) {
        //toggle UI elements

        loggedInlinks.forEach(item => item.style.display = 'block');
        loggedOutlinks.forEach(item => item.style.display = 'none');
    }

    else {
        //toggle UI elements

        loggedInlinks.forEach(item => item.style.display = 'none');
        loggedOutlinks.forEach(item => item.style.display = 'block');
    }
};

const userView = document.querySelectorAll('.authUserView');

const renderUser = (user) => {
    if (user) {
        db.collection('users').where('userUID', '==', user.uid).get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.docs.forEach(userDocs => {
                    userView.forEach(item => {
                        let html = [
                            `
                            <a>
                                <img class="circle" src="${userDocs.data().userImg}" class="dp">
                            </a>
                            <a>
                                <span class="white-text name">
                                    ${userDocs.data().userName}
                                </span>
                            </a>
                            <a>
                                <span class="white-text email">
                                    ${userDocs.data().userEmail}
                                </span>
                            </a>
                        `].join('');

                        const div = document.createElement('div');
                        div.innerHTML = html;
                        item.append(div);
                    });
                });
            }

            else {
                console.log('no document!');
            }
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
}