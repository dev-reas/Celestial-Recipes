// get data
const recipeList = document.querySelector('.recipes');

function renderRecipe(doc) {
    let event = new Date(doc.data().recipeDate.toDate());
    let html = [
        `
            <div class="card">
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">
                        <i class="material-icons right">close</i>
                    </span>
                    <h5>${doc.data().recipeTitle}</h5>
                    <p>${doc.data().recipeDesc}</p>
                    <p>${event.toLocaleString('en-GB')}</p>
                </div>
                <div class="card-action">
                    <div class="center">${doc.data().recipeTitle}</div>
                    <a class="btn red btn-floating halfway-fab pulse activator left">
                            <i class="material-icons">
                                add
                            </i>
                     </a>
                </div>
                <div class="card-image">
                    <img src="${doc.data().recipeImg}">
                </div>
                <div class="card-content"><p style="padding-left: 1vw">${doc.data().recipeAuthor}</p></div>
                <div class="card-action center"><a>Show this Recipe</a></div>
            </div>
    `].join('');

    let fragment = new DocumentFragment();
    let div = document.createElement('div');
    div.setAttribute('class', 'col l3 m4 s12');
    div.setAttribute('data-id', doc.id);

    div.innerHTML = html;

    let spanEdit = document.createElement('span');
    let editBtn = document.createElement('a');
    let iconEdit = document.createElement('i');

    spanEdit.setAttribute('class', 'left');
    editBtn.setAttribute('class', 'waves-effect waves-light btn modal-trigger');
    editBtn.setAttribute('href', '#modal1');
    editBtn.textContent = 'Edit';
    iconEdit.setAttribute('class', 'material-icons left');
    iconEdit.textContent = 'edit';

    let spanDel = document.createElement('span');
    let delBtn = document.createElement('a');
    let iconDel = document.createElement('i');

    spanDel.setAttribute('class', 'right');
    delBtn.setAttribute('class', 'waves-effect waves-light btn modal-trigger');
    delBtn.setAttribute('href', '#modal1');
    delBtn.setAttribute('id', 'delButton');
    delBtn.textContent = 'Delete';
    iconDel.setAttribute('class', 'material-icons left');
    iconDel.textContent = 'delete';

    editBtn.appendChild(iconEdit);
    delBtn.appendChild(iconDel);

    spanEdit.appendChild(editBtn);
    spanDel.appendChild(delBtn);

    div.appendChild(spanEdit);
    div.appendChild(spanDel);
    fragment.appendChild(div);
    recipeList.appendChild(fragment);

    editBtn.addEventListener('click', (e) => {
        var id = e.target.parentNode.parentNode.getAttribute('data-id');
        const updateRecipe = document.querySelector('#update-recipe');
        $(document).ready(function () {
            $('.modal').modal({
                onOpenEnd() {
                    db.collection('recipe').doc(id).get().then(function () {
                        document.getElementById('recipeTitle').value = doc.data().recipeTitle;
                        document.getElementById('recipeDesc').value = doc.data().recipeDesc;
                        db.collection('recipeInstruction').where("recipeId", "==", id).get().then(snapshot => {
                            snapshot.docs.forEach(doc => {
                                document.getElementById('recipeInstrct').value += (doc.data().instruction + '\n');
                            });
                        });

                        db.collection('recipeIngredient').where("recipeId", "==", id).get().then(snapshot => {
                            snapshot.docs.forEach(doc => {
                                document.getElementById('recipeIngrdnt').value += (doc.data().instruction + '\n');
                            });
                        });


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

                                        auth.onAuthStateChanged((user) => {
                                            if (user) {
                                                db.collection('recipe').doc(id).update({
                                                    recipeTitle: updateRecipe['recipeTitle'].value,
                                                    recipeDesc: updateRecipe['recipeDesc'].value,
                                                    recipeImg: downloadURL,
                                                    recipeAuthor: user.displayName,
                                                    recipeAuthorUID: user.uid,
                                                    recipeAuthorPhoto: user.photoURL,
                                                    recipeDate: firebase.firestore.Timestamp.now(),
                                                }).then(() => {

                                                    var recipeInst = db.collection('recipeInstruction').where('recipeId', '==', id);
                                                    recipeInst.get().then(function (querySnapshot) {
                                                        querySnapshot.forEach(function (doc) {
                                                            doc.ref.delete();
                                                        });
                                                    });

                                                    var recipeIngr = db.collection('recipeIngredient').where('recipeId', '==', id);
                                                    recipeIngr.get().then(function (querySnapshot) {
                                                        querySnapshot.forEach(function (doc) {
                                                            doc.ref.delete();
                                                        });
                                                    });

                                                    var area = document.getElementById("recipeInstrct");
                                                    var lines = area.value.replace(/\r\n/g, "\n").split("\n");
                                                    const promises = [];
                                                    let i = 0;
                                                    lines.forEach(instrct => {
                                                        i += 1;
                                                        promises.push(db.collection('recipeInstruction').doc().set({
                                                            instruction: instrct,
                                                            order: i,
                                                            recipeId: id,
                                                            status: false,
                                                            userId: user.uid,
                                                        }));
                                                    });

                                                    Promise.all(promises).then(results => {

                                                    }).catch(err => console.log(err.message));

                                                    //textarea for ingredients
                                                    var ingr = document.getElementById("recipeIngrdnt");
                                                    var linesIngr = ingr.value.replace(/\r\n/g, "\n").split("\n");
                                                    const promisesIngr = [];
                                                    let k = 0;
                                                    linesIngr.forEach(ingr => {
                                                        k += 1;
                                                        promisesIngr.push(db.collection('recipeIngredient').doc().set({
                                                            instruction: ingr,
                                                            order: k,
                                                            recipeId: id,
                                                            status: false,
                                                            userId: user.uid,
                                                        }));
                                                    });

                                                    Promise.all(promisesIngr).then(results => {

                                                    }).catch(err => console.log(err.message));

                                                    updateRecipe.reset();
                                                    window.location = 'profile.html';
                                                }).catch(err => {
                                                    console.log(err);
                                                });
                                            }

                                            else {
                                                $('#modal1').modal('close');
                                                alert('Not permitted');
                                            }
                                        })
                                    })
                                });
                            });
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                },
                onCloseEnd() {
                    updateRecipe.reset();
                }
            });
            $('#modal1').modal('open');
        });
    }, false);
    delBtn.addEventListener('click', deleteItem, false);

    function deleteItem(e) {
        var id = e.target.parentNode.parentNode.getAttribute('data-id');
        db.collection('recipe').doc(id).delete().then(() => {
            let delRecipeInst = db.collection('recipeInstruction').where('recipeId', '==', id);
            delRecipeInst.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                });
            });

            let delRecipeIngr = db.collection('recipeIngredient').where('recipeId', '==', id);
            recipeIngr.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                });
            });
            location.reload();
        });
    }
}

const ProfileView = (user) => {
    userId = user.uid;
    db.collection('recipe').where("recipeAuthorUID", "==", userId).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            renderRecipe(doc);
        });
    });
}


auth.onAuthStateChanged((user) => {
    if (user) {
        ProfileView(user);
    }

    else {
        if (window.location.href == 'http://localhost:5000/profile.html') {
            var urlLink = "localhost:5000";
            window.location.replace('login-page.html')
        }
    }
});



