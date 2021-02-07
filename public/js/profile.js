const recipeList = document.querySelector('.recipes');
const updateRecipe = document.querySelector('#update-recipe');
const ShoppingList = document.querySelector('#shoppingList');
const setStatus = document.querySelector('#setStatus');
const deleteShopping = document.querySelector('#deleteShopping');
const statusAlert = document.querySelectorAll('.status-alert');

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
        const id = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
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

    const delBtn = document.getElementById('del' + doc.id);

    delBtn.addEventListener('click', (e) => {
        const delId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
        db.collection("recipe").doc(delId).delete().then(function () {
            location.reload();
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    });
}

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

const ProfileView = (user) => {
    userId = user.uid;
    db.collection('recipe').where("recipeAuthorUID", "==", userId).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            renderRecipe(doc);
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
            var urlLink = "localhost:5000";
            window.location.replace('login-page.html')
        }
    }
});


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