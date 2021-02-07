// get data
const recipeList = document.querySelector('.recipes');

function renderRecipe(doc) {
    let titleCut = '';
    if (doc.data().recipeTitle.length > 20) {
        titleCut = doc.data().recipeTitle.substring(0, 20) + ' ...';
    }

    else {
        titleCut = doc.data().recipeTitle;
    }

    let event = new Date(doc.data().recipeDate.toDate());
    let html = [
        `
        <div class="card">
            <div class="card-image waves-effect hoverable waves-block waves-light">
                <img class="activator responsive-img" src="${doc.data().recipeImg}">
                <a class='dropdown-trigger right' href='#' data-target='editBtn${doc.id}'>
                        <i class="material-icons right" style="color: #b71c1c;">more_vert</i>
                    </a>

                    <ul id='editBtn${doc.id}' class='dropdown-content'>
                        <li>
                            <a id="edit${doc.id}" class="modal-trigger" href="#modal1">
                                <i class="material-icons">edit</i>Edit
                            </a>
                        </li>
                        <li><a href="#!" id="del${doc.id}"><i class="material-icons">delete_forever</i>Delete</a></li>
                        <li><a href="#!"><i class="material-icons">pageview</i>View</a></li>
                        </ul>
            </div>
            <div class="card-content">
                <div class="card--recipe-info">
                    <div class="card-title activator grey-text text-darken-4 ">
                        <h5 class="flow-text">${titleCut}</h5>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="card--recipe-info">
                    <a>
                        <h2 class="card--recipe-category flow-text">
                            By: ${doc.data().recipeAuthor}
                        </h2>
                    </a>
                </div>
                <div class="card--recipe-info">
                    <p class="card--recipe-time flow-text">
                        <i class="material-icons left tiny">schedule</i>
                        ${doc.data().prepTime}
                    </p>
                </div>
                <div class="card--recipe-info">
                    <p class="card--description">
                        Recipe Ratings:
                        <div class="card--rating-wrapper right">
                            <div class="card--rating-stars--wrapper">
                                <div class="card--rating-star filled">☆</div>
                                <div class="card--rating-star filled">☆</div>
                                <div class="card--rating-star filled">☆</div>
                                <div class="card--rating-star filled">☆</div>
                                <div class="card--rating-star">☆</div>
                            </div>
                        </div>
                    </p>
                </div>
                <div class="card-action">
                    <div class="viewrecipe center">
                        <a href="view.html?view=${encodeURIComponent(doc.data().recipeTitle)}">View Recipe</a>
                    </div>
                </div>
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">
                    ${doc.data().recipeTitle}
                    <i class="material-icons right">
                        close
                    </i>
                </span>
                <div class="card--description">
                    ${doc.data().recipeDesc}
                </div>
            </div>
        </div>
    `].join('');

    let fragment = new DocumentFragment();
    let div = document.createElement('div');
    div.setAttribute('class', 'col l4 m6 s12');
    div.setAttribute('data-id', doc.id);

    div.innerHTML = html;

    $(document).ready(function () {
        $('.dropdown-trigger').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false,
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'right', // Displays dropdown with edge aligned to the left 
            stopPropagation: false // Stops event propagation
        });
    });

    fragment.appendChild(div);
    recipeList.appendChild(fragment);

    const editBtn = document.getElementById('edit' + doc.id);

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
    const delBtn = document.getElementById('del' + doc.id);

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
