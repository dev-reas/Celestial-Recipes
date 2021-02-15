const recipeList = document.querySelector('.recipes');
const updateRecipe = document.querySelector('#update-recipe');
const ShoppingList = document.querySelector('#shoppingList');
const setStatus = document.querySelector('#setStatus');
const deleteShopping = document.querySelector('#deleteShopping');


// render recipes
function renderRecipe(recipeDocs, userDocs) {
    let titleCut = '';
    if (recipeDocs.data().recipeTitle.length > 35) {
        titleCut = recipeDocs.data().recipeTitle.substring(0, 35) + ' ...';
    }

    else {
        titleCut = recipeDocs.data().recipeTitle;
    }
    let event = new Date(recipeDocs.data().recipeDate.toDate());
    let html = [
        `
        <div class="card">
            <div class="card-image waves-effect hoverable waves-block waves-light">
                <img class="activator responsive-img" src="${recipeDocs.data().recipeImg}">
                <a class='dropdown-trigger right' href='#' data-target='editBtn${recipeDocs.id}'>
                        <i class="material-icons right" style="color: #b71c1c;">more_vert</i>
                    </a>

                    <ul id='editBtn${recipeDocs.id}' class='dropdown-content'>
                        <li>
                            <a id="edit${recipeDocs.id}" class="modal-trigger" href="#modal1">
                                <i class="material-icons">edit</i>Edit
                            </a>
                        </li>
                        <li><a href="#!" id="del${recipeDocs.id}"><i class="material-icons">delete_forever</i>Delete</a></li>
                        <li><a href="#!"><i class="material-icons">pageview</i>View</a></li>
                        </ul>
            </div>
            <div class="card-content">
                <div class="card--recipe-info">
                    <div class="card-title activator grey-text text-darken-4 truncate">
                        <h5 class="flow-text truncate">${titleCut}</h5>
                    </div>
                </div>
                
                <div class="card--recipe-info">
                    <a>
                        <h2 class="card--recipe-category flow-text">
                            By: ${userDocs.data().userName}
                        </h2>
                    </a>
                </div>
                <div class="card--recipe-info">
                    <p class="card--recipe-time flow-text">
                        <i class="material-icons left tiny">schedule</i>
                        ${recipeDocs.data().prepTime}
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
                        <a href="view.html?view=${encodeURIComponent(recipeDocs.data().recipeTitle)}">View Recipe</a>
                    </div>
                </div>
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">
                    ${recipeDocs.data().recipeTitle}
                    <i class="material-icons right">
                        close
                    </i>
                </span>
                <div class="card--description">
                    ${recipeDocs.data().recipeDesc}
                </div>
            </div>
        </div>
    `].join('');

    let fragment = new DocumentFragment();
    let div = document.createElement('div');
    div.setAttribute('class', 'col l4 m6 s12');
    div.setAttribute('data-id', recipeDocs.id);

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

    const editBtn = document.getElementById('edit' + recipeDocs.id);

    editBtn.addEventListener('click', (e) => {
        let id = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
        var docRef = db.collection("recipe").doc(id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                var uploader = document.getElementById('updateUploader');
                var fileButton = document.getElementById('updateRecipeFile');
                fileButton.addEventListener('change', (e) => {
                    e.preventDefault();
                    var file = e.target.files[0];
                    var storageRef = store.ref('foodImages/' + file.name);
                    var task = storageRef.put(file);
                    task.on('state_changed', function progress(snapshot) {
                        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        uploader.style.width = percentage + '%';
                    }, (error) => {
                        console.error(error);
                    }, () => {
                        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            console.log('File available at', downloadURL);
                            updateRecipe.addEventListener('submit', (e) => {
                                e.preventDefault();

                                auth.onAuthStateChanged((user) => {
                                    if (user) {
                                        var ingr = document.getElementById("updateRecipeIngrdnt");
                                        var linesIngr = ingr.value.replace(/\r\n/g, "\n").split("\n");
                                        var area = document.getElementById("updateRecipeInstrct");
                                        var lines = area.value.replace(/\r\n/g, "\n").split("\n");

                                        db.collection('recipe').doc(id).update({
                                            recipeTitle: updateRecipe['updateRecipeTitle'].value,
                                            recipeDesc: updateRecipe['updateRecipeDesc'].value,
                                            mainIngredient: updateRecipe['updateMainIngredient'].value,
                                            cuisine: updateRecipe['updateCuisine'].value,
                                            mealType: updateRecipe['updateMeal'].value,
                                            occasion: updateRecipe['updateOccasion'].value,
                                            prepTime: updateRecipe['updatePrepTime'].value,
                                            instruction: lines,
                                            ingredient: linesIngr,
                                            recipeImg: downloadURL,
                                            recipeDate: firebase.firestore.Timestamp.now(),
                                        }).then(() => {
                                            location.reload();
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    }

                                    else {
                                        updateRecipe.reset();
                                        $('#modal1').modal('close');
                                        alert('Not permitted');
                                    }
                                })
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    });
                });
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        $('#modal1').modal({
            onCloseEnd() {
                updateRecipe.reset();
            },
        });
    });

    const delBtn = document.getElementById('del' + recipeDocs.id);

    delBtn.addEventListener('click', (e) => {
        const delId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
        db.collection("recipe").doc(delId).delete().then(function () {
            location.reload();
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    });
}

// render shopping list
const renderShopping = (recipeId, userShoppingList) => {
    var li = document.createElement('li');
    var divBody = document.createElement('div');
    divBody.setAttribute('class', 'collapsible-body shoppingContent row');
    var fragment = new DocumentFragment();

    var divHeader = document.createElement('div');
    divHeader.setAttribute('class', 'collapsible-header');

    db.collection('recipe').doc(recipeId).get().then((doc) => {
        if (doc.exists) {
            divHeader.textContent = doc.data().recipeTitle;
        }
        else {
            divHeader.textContent = 'Recipe is deleted';
        }
    });

    for (var index = 0; index < userShoppingList.length; index += 2) {
        html = [
            `
                <p>
                    <label>
                        <input type="checkbox" name="ingredientList" value="${userShoppingList[index + 1]}" />
                        <span>
                            <p>
                                ${userShoppingList[index].userShoppingList}
                            </p>
                        </span>
                    </label>
                </p>
            `
        ].join('');
        var span = document.createElement('span');
        span.setAttribute('data-id', userShoppingList[index + 1]);
        span.setAttribute('class', 'col s12 grocery');
        span.innerHTML = html;

        var p = document.createElement('span');
        p.setAttribute('class', 'alertSet');

        var icon = document.createElement('i');
        icon.setAttribute('class', 'material-icons left iconAlert');
        icon.textContent = 'done';

        p.textContent = 'You have this ingredient';

        if (userShoppingList[index].status == false) {
            p.setAttribute('hidden', true);
        }

        else {
            p.removeAttribute('hidden');
        }

        p.appendChild(icon);
        span.appendChild(p);
        divBody.appendChild(span);
    }

    fragment.appendChild(divHeader);
    fragment.appendChild(divBody);
    li.appendChild(fragment);
    ShoppingList.appendChild(li);
}

// get users collection and send in function renderRecipe
const getUsers = (recipeDocs) => {
    db.collection('users').where('userUID', '==', recipeDocs.data().recipeAuthorUID).get().then(snapshot => {
        snapshot.docs.forEach(userDocs => {
            renderRecipe(recipeDocs ,userDocs);
        });
    });
}

// get all collection which have the current user ID
const ProfileView = (user) => {
    userId = user.uid;
    db.collection('recipe').where("recipeAuthorUID", "==", userId).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            getUsers(doc);
        });
    });

    db.collection('shoppingList').where("userId", "==", userId).get().then(snapshot => {
        var recipeGroups = {};

        snapshot.docs.forEach((doc) => {
            if (!recipeGroups[doc.data().recipeId]) {
                recipeGroups[doc.data().recipeId] = [];
            }
            recipeGroups[doc.data().recipeId].push(doc.data(), doc.id);
        });

        Object.keys(recipeGroups).forEach(recipeId => {
            var userShoppingList = recipeGroups[recipeId];
            renderShopping(recipeId, userShoppingList);
        });
    });
}

// get current user
const profileDesc = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            ProfileView(user);

            const profileImg = document.querySelector('#profileImg');
            const profileName = document.querySelector('#profileName');
            const dataName = document.querySelector('#dataName');
            const dataEmail = document.querySelector('#dataEmail');
            const dataNumber = document.querySelector('#dataNumber');
            const dataAddress = document.querySelector('#dataAddress');
            const dataJob = document.querySelector('#dataJob');
            db.collection('users').doc(user.uid).get().then(doc => {
                profileImg.setAttribute('src', doc.data().userImg);
                profileName.textContent = doc.data().userName;

                dataName.textContent = doc.data().userName;
                dataEmail.textContent = doc.data().userEmail;
                dataNumber.textContent = doc.data().userContact;
                dataAddress.textContent = doc.data().userAddress;
                dataJob.textContent = doc.data().userJob;
            });
        }

        else {
            if (window.location.href == 'http://localhost:5000/profile.html') {
                window.location.replace('auth.html');
            }
        }
    });
}

profileDesc();

// upload image for user
let userPhotoDownURL = '';
var uploader = document.getElementById('profileImgUploader');
var fileButton = document.getElementById('updateProfileImg');
fileButton.addEventListener('change', (e) => {
    e.preventDefault();
    var file = e.target.files[0];
    var storageRef = store.ref('userImages/' + file.name);
    var task = storageRef.put(file);
    task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.style.width = percentage + '%';
    }, (error) => {
        console.error(error);

    }, () => {
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            userPhotoDownURL = downloadURL;
        });
    });
});

// update user Info
const updateProfileDesc = document.querySelector('#update-profile');
updateProfileDesc.addEventListener('submit', (e) => {
    e.preventDefault();
    var name = updateProfileDesc['first_name'].value + ' ' + updateProfileDesc['last_name'].value;
    auth.onAuthStateChanged((user) => {
        if (user) {
            user.updateProfile({
                displayName: name,
                photoURL: userPhotoDownURL
            });

            db.collection('users').doc(user.uid).update({
                userName: name,
                userContact: updateProfileDesc['contact'].value,
                userJob: updateProfileDesc['occupation'].value,
                userAddress: updateProfileDesc['address'].value,
                userImg: userPhotoDownURL,
            }).then(() => {
                const profileModal = document.querySelector('#modal-profile');
                M.Modal.getInstance(profileModal).close();
                updateProfileDesc.reset();
                profileDesc();
            });
        }
    });
});


// update Email
const updateEmail = document.querySelector('#update-email');
updateEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    auth.onAuthStateChanged((user) => {
        if (user) {
            const helperText = document.querySelectorAll('.helper-text');
            const oldEmailText = document.querySelector('.oldEmailText');
            console.log(user.email);
            if (updateEmail['oldEmail'].value == user.email) {
                updateEmail['oldEmail'].removeAttribute('class', 'invalid');
                if (updateEmail['email'].value == updateEmail['confirmEmail'].value) {
                    updateEmail['email'].removeAttribute('class', 'invalid');
                    updateEmail['confirmEmail'].removeAttribute('class', 'invalid');

                    user.updateEmail(updateEmail['email'].value).then(() => {
                        db.collection('users').doc(user.uid).update({
                            userEmail: updateEmail['email'].value,
                        }).then(() => {
                            auth.signOut();
                            window.location.replace('auth.html');
                        });
                    }).catch((error) => {
                        // An error happened.
                    });
                }

                else {
                    updateEmail['email'].setAttribute('class', 'invalid');
                    updateEmail['confirmEmail'].setAttribute('class', 'invalid');
                    for (var index = 0; index < helperText.length; index++) {
                        helperText[index].setAttribute('data-error', 'Check email if same');
                    }
                }
            }

            else {
                updateEmail['oldEmail'].setAttribute('class', 'invalid');
                oldEmailText.setAttribute('data-error', 'Email Mismatch');
            }
        }
    });
});

// update Password
const updatePassword = document.querySelector('#update-password');
updatePassword.addEventListener('submit', (e) => {
    e.preventDefault();
    auth.onAuthStateChanged((user) => {
        if (user) {
            const spanPassword = document.querySelectorAll('.spanPassword');
            const oldPasswordText = document.querySelector('.oldPasswordText');
            const passwordText = document.querySelector('.passwordText');

            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                updatePassword['oldPassword'].value,
            );

            user.reauthenticateWithCredential(credential).then(function () {
                updatePassword['oldPassword'].removeAttribute('class', 'invalid');
                if (updatePassword['password'].value.length > 8) {
                    updatePassword['password'].removeAttribute('class', 'invalid');
                    console.log(updatePassword['password'].value);
                    console.log(updatePassword['confirmPassword'].value);
                    if (updatePassword['password'].value == updatePassword['confirmPassword'].value) {
                        console.log(updatePassword['password'].value);
                        console.log(updatePassword['confirmPassword'].value);
                        updatePassword['password'].removeAttribute('class', 'invalid');
                        updatePassword['confirmPassword'].removeAttribute('class', 'invalid');

                        user.updatePassword(updatePassword['password'].value).then(function () {
                            auth.signOut();
                            window.location.replace('auth.html');
                        }).catch(function (error) {
                            // An error happened.
                        });
                    }

                    else {
                        updatePassword['password'].setAttribute('class', 'invalid');
                        updatePassword['confirmPassword'].setAttribute('class', 'invalid');
                        for (var index = 0; index < spanPassword.length; index++) {
                            spanPassword[index].setAttribute('data-error', 'Check password if same');
                        }
                    }
                }

                else {
                    updatePassword['password'].setAttribute('class', 'invalid');
                    passwordText.setAttribute('data-error', 'Password must be greater than 8 characters');
                }
            }).catch(function (error) {
                updatePassword['oldPassword'].setAttribute('class', 'invalid');
                oldPasswordText.setAttribute('data-error', error.message);
            });
        }
    });
});

// set status of shopping list where checkbox is checked
setStatus.addEventListener('click', (e) => {
    e.preventDefault();

    var ingredientArray = [];
    $("input:checkbox[name=ingredientList]:checked").each(function () {
        ingredientArray.push($(this).val());
    });

    console.log(ingredientArray);

    auth.onAuthStateChanged((user) => {
        if (user) {
            let ingredientStatus = false;
            ingredientArray.forEach(element => {
                var sfDocRef = db.collection("shoppingList").doc(element);

                return db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }

                        else {
                            if (sfDoc.data().status == ingredientStatus) {
                                ingredientStatus = true;
                                transaction.update(sfDocRef, { status: ingredientStatus });
                            }

                            else {
                                transaction.update(sfDocRef, { status: ingredientStatus });
                            }
                        }
                        location.reload();
                    });
                }).then(() => {
                    console.log("Transaction successfully committed!");
                }).catch((error) => {
                    console.log("Transaction failed: ", error);
                });
            });

        } else {
            console.log('no user login');
        }
    });
});

// delete shopping list where checkbox is checked
deleteShopping.addEventListener('click', (e) => {
    e.preventDefault();

    var ingredientArray = [];
    $("input:checkbox[name=ingredientList]:checked").each(function () {
        ingredientArray.push($(this).val());
    });

    console.log(ingredientArray);

    auth.onAuthStateChanged((user) => {
        if (user) {
            let ingredientStatus = false;
            ingredientArray.forEach(element => {
                var sfDocRef = db.collection("shoppingList").doc(element);

                return db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }

                        transaction.delete(sfDocRef);
                        location.reload();
                    });
                }).then(() => {
                    console.log("Transaction successfully committed!");
                }).catch((error) => {
                    console.log("Transaction failed: ", error);
                });
            });

        } else {
            console.log('no user login');
        }
    });
});
