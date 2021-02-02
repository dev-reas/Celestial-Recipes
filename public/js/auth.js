//listen to auth status changes

auth.onAuthStateChanged((user) => {
    if (user) {
        setupUI(user);
        renderUser(user);
    }

    else {
        setupUI();
        if (window.location.href == 'http://localhost:5000/profile.html') {
            var urlLink = "localhost:5000";
            window.location.replace('login-page.html')
        }
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
        userView.forEach(item => {
            let html = [
                `
                <a>
                    <img class="circle" src="${user.photoURL}" class="dp">
                </a>
                <a>
                    <span class="white-text name">
                        ${user.displayName}
                    </span>
                </a>
                <a>
                    <span class="white-text email">
                        ${user.email}
                    </span>
                </a>
            `].join('');

            const div = document.createElement('div');
            div.innerHTML = html;
            item.append(div);
        });
    }
}