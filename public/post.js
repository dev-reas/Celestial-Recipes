// post data with users info
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('user logged in :', user);
        postRecipe(user);
    }

    else {
        postRecipe(null);
    }
});

const postRecipe = (user) => {
    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('recipeFile');
    fileButton.addEventListener('change', (e) => {
        e.preventDefault();
        var file = e.target.files[0];
        var storageRef = store.ref('foodImages/' + file.name);
        var task = storageRef.put(file);
        task.on('state_changed', function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.style.width = percentage * 20;
        }, (error) => {
            console.error(error);

        }, () => {
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                const createRecipe = document.querySelector('#create-recipe');
                createRecipe.addEventListener('submit', (e) => {
                    e.preventDefault();
                    db.collection('recipe').add({
                        recipeTitle: createRecipe['recipeTitle'].value,
                        recipeDesc: createRecipe['recipeDesc'].value,
                        recipeInstrct: createRecipe['recipeInstrct'].value,
                        recipeIngrdnt: createRecipe['recipeIngrdnt'].value,
                        recipeImg: downloadURL,
                        recipeAuthor: user.displayName,
                        recipeAuthorUID: user.uid,
                        recipeAuthorPhoto: user.photoURL,
                        recipeDate: new Date(firebase.firestore.Timestamp.now().seconds*1000).toLocaleDateString(),
                    }).then(() => {
                        createRecipe.reset();
                        window.location = 'home.html';
                    }).catch(err => {
                        console.log(err.message);
                    });
                });
            });
        });
    });
}

