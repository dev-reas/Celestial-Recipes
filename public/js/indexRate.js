const recipeListRates = document.querySelector('.recipesRates');

db.collection('recipe').orderBy('avrRating', 'desc').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        getCommentsByRates(doc.id, doc);
        showUserRatingByRates(doc);
    });
});

const getCommentsByRates = (commentsId, doc) => {
    db.collection("ratings").where("recipeId", "==", commentsId)
        .get()
        .then((querySnapshot) => {
            var commentsArray = [];
            querySnapshot.forEach((doc) => {
                commentsArray.push(doc.data().comments);
            });
            renderRecipeByRates(doc, commentsArray.length);

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}


const renderRecipeByRates = (doc, commentsCounter) => {
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
            <div class="card-image hoverable waves-effect waves-block waves-light">
                <img class="activator responsive-img" src="${doc.data().recipeImg}">
            </div>
            <div class="card-content">
                <div class="card--recipe-info">
                    <div class="card-title activator grey-text text-darken-4 ">
                        <h5 class="flow-text">${titleCut}</h5>
                    </div>
                </div>
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
                    <div class="card--rating-wrapper">
                        <div class="card--rating-stars--wrapper heartRatings">
                            <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                            <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                            <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                            <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                            <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                        </div>
                        
                        <span class="commentCounter">
                            <p class="flow-text">${commentsCounter}</p>
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

    let fragmentRates = new DocumentFragment();
    let divRates = document.createElement('div');
    divRates.setAttribute('class', 'col l3 m6 s12');
    divRates.setAttribute('data-id', doc.id);

    divRates.innerHTML = html;
    fragmentRates.appendChild(divRates);
    recipeListRates.appendChild(fragmentRates);
}

const showUserRatingByRates = (doc) => {
    setTimeout(() => {
        const heartRatings = document.querySelectorAll('.heartRatings');
        heartRatings.forEach(element => {
            var id = element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');

            if (doc.id == id) {
                for (var index = 0; index < doc.data().avrRating; index++) {
                    element.children[index].style.color = '#b71c1c';
                }
            }
        });
    }, 1000);
}