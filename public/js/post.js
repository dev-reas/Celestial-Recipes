// post data with users info
auth.onAuthStateChanged((user) => {
    if (user) {
        postRecipe(user);
    }

    else {
        postRecipe(null);
    }
});
let photoDownURL = '';

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
                photoDownURL = downloadURL;
            });
        });
    });

    const createRecipe = document.querySelector('#create-recipe');
    createRecipe.addEventListener('submit', (e) => {
        e.preventDefault();
        var area = document.getElementById("recipeInstrct");
        var lines = area.value.replace(/\r\n/g, "\n").split("\n");
        var ingr = document.getElementById("recipeIngrdnt");
        var linesIngr = ingr.value.replace(/\r\n/g, "\n").split("\n");

        db.collection('recipe').add({
            recipeTitle: createRecipe['recipeTitle'].value,
            recipeDesc: createRecipe['recipeDesc'].value,
            mainIngredient: createRecipe['mainIngredient'].value,
            cuisine: createRecipe['cuisine'].value,
            mealType: createRecipe['meal'].value,
            occasion: createRecipe['occasion'].value,
            prepTime: createRecipe['prepTime'].value,
            instruction: lines,
            ingredient: linesIngr,
            recipeImg: photoDownURL,
            recipeAuthor: user.displayName,
            recipeAuthorUID: user.uid,
            recipeAuthorPhoto: user.photoURL,
            recipeDate: firebase.firestore.Timestamp.now(),
            avrRating: 0,
            numRatings: 0,
        }).then((docRef) => {

            createRecipe.reset();
            window.location = 'home.html';
        }).catch(err => {
            console.log(err);
        });
    });

    $('.modal').modal({
        onCloseEnd() {
            createRecipe.reset();
        }
    })
}