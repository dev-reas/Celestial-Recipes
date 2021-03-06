const modalSubmit = document.querySelector('#modal-submit');
const searchData = document.querySelector('#search-data');
const tags = document.querySelector('#tags');

modalSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#search-data').empty();
    $('#tags').empty();
    mainIngredient = modalSubmit['mainIngredient'].value;
    cuisine = modalSubmit['cuisine'].value;
    meal = modalSubmit['meal'].value;
    occasion = modalSubmit['occasion'].value;
    prepTime = modalSubmit['prepTime'].value;

    var query = db.collection('recipe');

    if (mainIngredient !== '') {
        query = query.where('mainIngredient', '==', mainIngredient);
    }

    if (cuisine !== '') {
        query = query.where('cuisine', '==', cuisine);
    }

    if (meal !== '') {
        query = query.where('meal', '==', meal);
    }

    if (occasion !== '') {
        query = query.where('occasion', '==', occasion);
    }

    if (prepTime !== '') {
        query = query.where('prepTime', '==', prepTime);
    }


    query.orderBy('recipeDate', 'desc').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            getComments(doc);
        });
    });

    let fragment = new DocumentFragment();
    let p = document.createElement('p');

    if (mainIngredient == '') {
        mainIngredient = 'Any main ingredient';
    }

    if (cuisine == '') {
        cuisine = 'Any cuisine';
    }

    if (meal == '') {
        meal = 'Any type of meal';
    }

    if (occasion == '') {
        occasion = 'Non specific';
    }

    if (prepTime == '') {
        prepTime = 'Non specific';
    }

    p.textContent = mainIngredient + ', ' + cuisine + ', ' + meal + ', ' + occasion + ', ' + prepTime;
    fragment.appendChild(p);
    tags.appendChild(fragment);
});

const getComments = (recipeData) => {
    db.collection("avrRatings").where("recipeId", "==", recipeData.id).get().then((querySnapshot) => {
        querySnapshot.forEach((docRef) => {
            getUser(recipeData, docRef.data().numRatings);
            showUserRating(docRef);
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

const getUser = (recipeDocs, dataCounter) => {
    db.collection('users').where('userUID', '==', recipeDocs.data().recipeAuthorUID).get().then((querySnapshot) => {
        querySnapshot.forEach((sfDoc) => {
            renderRecipe(recipeDocs, dataCounter, sfDoc);
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

const renderRecipe = (doc, ratingsCounter, userDocs) => {
    
    let titleCut = '';
    if (doc.data().recipeTitle.length > 37) {
        titleCut = doc.data().recipeTitle.substring(0, 40) + ' ...';
    }

    else {
        titleCut = doc.data().recipeTitle;
    }
    let event = new Date(doc.data().recipeDate.toDate());
    let html = [
        `
        <div class="card">
                <div class="card-image hoverable waves-effect waves-block waves-light">
                    <img class="activator responsive-img" src="${doc.data().recipeImg}">
                </div>
                <div class="card-content">
                    <div class="card--recipe-info">
                        <div class="card-title activator grey-text text-darken-4 truncate">
                            <h5 class="flow-text">${titleCut}</h5>
                        </div>
                    </div>
                    <div class="card--recipe-info">
                        <a href="profile.html?user=${encodeURIComponent(userDocs.data().userUID)}">
                            <h2 class="card--recipe-category flow-text">
                                By: ${userDocs.data().userName}
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
                        <div class="card--rating-wrapper">
                            <div class="card--rating-stars--wrapper heartRatings">
                                <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                                <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                                <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                                <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                                <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                            </div>
                            
                            <span class="commentCounter">
                                <p class="flow-text">${ratingsCounter}</p>
                            </span>
                            <i class="material-icons tiny">comment</i>

                        </div>
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
        `
    ].join('');

    let fragment = new DocumentFragment();
    let div = document.createElement('div');
    div.setAttribute('class', 'col l3 m6 s12');
    div.setAttribute('data-id', doc.id);

    div.innerHTML = html;
    fragment.appendChild(div);
    searchData.appendChild(fragment);
}

const showUserRating = (doc) => {
    setTimeout(() => {
        const heartRatings = document.querySelectorAll('.heartRatings');
        heartRatings.forEach(element => {
            var id = element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');

            if (doc.data().recipeId == id) {
                for (var index = 0; index < parseFloat(doc.data().ratingAverage).toFixed(); index++) {
                    element.children[index].style.color = '#b71c1c';
                }
            }
        });
    }, 1500);
}