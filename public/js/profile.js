// get data
const recipeList = document.querySelector('.recipes');

function renderRecipe(doc) {
    let html = [
        `
        <div class="col l3 m4 s12" id="${doc.id}">
            <div class="card">
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${doc.data().recipeTitle}
                    <i class="material-icons right">close</i>
                    </span>
                    <p>${doc.data().recipeDesc}</p>
                </div>
                <div class="card-action">
                    <div class="center">${doc.data().recipeTitle}</div>
                    <a class="btn red btn-floating halfway-fab pulse activator left"><i class="material-icons">add</i></a>
                </div>
                <div class="card-image">
                    <img src="${doc.data().recipeImg}">
                </div>
                <div class="card-content"><p style="padding-left: 1vw">By: ${doc.data().recipeAuthor}</p></div>
                <div class="card-action center"><a>Show this Recipe</a></div>
                <span class="left">
                    <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
                </span>
                <span class="right">
                    <a id="delBtn" class="waves-effect waves-light btn"><i class="material-icons left">delete</i>Delete</a>
                </span>
            </div>
        </div>
    `].join('');
    
    const div = document.createElement('div');
    div.innerHTML = html;
    recipeList.appendChild(div);
}

const ProfileView = (user) => {
    userId = user.uid;
    db.collection('recipe').where("recipeAuthorUID", "==", userId).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            renderRecipe(doc);
            const delBtn = document.getElementById('delBtn');
            delBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (e.target && e.target.matches("#delBtn")) {
                    let id = document.querySelector(`#${doc.id}`).getAttribute('id');
                    db.collection('recipe').doc(id).delete().then(function () {
                        console.log('delete success');
                        location.reload();
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });

            const editBtn = document.querySelector('.modal-trigger');
            editBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (e.target && e.target.matches(".modal-trigger")) {
                    $(document).ready(function () {
                        $('.modal').modal();
                        $('#modal1').modal('open');

                        let id = document.querySelector(`#${doc.id}`).getAttribute('id');
                        db.collection('recipe').doc(id).get().then(function () {
                            document.getElementById('recipeTitle').value = doc.data().recipeTitle;
                            document.getElementById('recipeDesc').value = doc.data().recipeDesc;
                            document.getElementById('recipeInstrct').value = doc.data().recipeInstrct;
                            document.getElementById('recipeIngrdnt').value = doc.data().recipeIngrdnt;


                            const updateRecipe = document.querySelector('#update-recipe');
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
                                        updateRecipe.addEventListener('submit', (e) => {
                                            e.preventDefault();
                                            db.collection('recipe').doc(id).update({
                                                recipeTitle: updateRecipe['recipeTitle'].value,
                                                recipeDesc: updateRecipe['recipeDesc'].value,
                                                recipeInstrct: updateRecipe['recipeInstrct'].value,
                                                recipeIngrdnt: updateRecipe['recipeIngrdnt'].value,
                                                recipeImg: downloadURL,
                                                recipeAuthor: user.displayName,
                                                recipeAuthorUID: user.uid,
                                                recipeAuthorPhoto: user.photoURL,
                                                recipeDate: new Date(firebase.firestore.Timestamp.now().seconds*1000).toLocaleDateString(),
                                            }).then(() => {
                                                updateRecipe.reset();
                                                window.location = 'profile.html';
                                            }).catch(err => {
                                                console.log(err.message);
                                            });
                                        })
                                    });
                                });
                            });
                        }).catch(function (error) {
                            console.log(error);
                        });
                    });
                }
            });
        });
    });
}


auth.onAuthStateChanged((user) => {
    if (user) {
        ProfileView(user);
    }

    else {

    }
});



