let paramsString = window.location.search;
let searchParams = new URLSearchParams(paramsString);
let title = decodeURIComponent(searchParams.get('view'));

const recipeTitle = document.querySelector('#recipeTitle');
const userName = document.querySelector('#recipeAuthor');
const authorHref = document.querySelector('#recipeAuthorProfile');
const recipeDate = document.querySelector('#recipeDate');
const userImage = document.querySelector('#recipeAuthorImage');
const recipeImg = document.querySelector('.recipe-img');
const recipeDesc = document.querySelector('#recipeDesc');
const mainIngredient = document.querySelector('#mainIngredient');
const cuisine = document.querySelector('#cuisine');
const meal = document.querySelector('#meal');
const occasion = document.querySelector('#occasion');
const prepTime = document.querySelector('#prepTime');
const ingredientCol = document.querySelector('.ingredientCol');
const instructionCol = document.querySelector('.instructionCol');
const ingredientCB2 = document.querySelectorAll('.ingredientCB');
const shoppingList = document.querySelector('#shopping-list');
const shoppingListBtn = document.querySelector('.shopping-list-button');
const shoppingAlternate = document.querySelector('#shoppingIdAlternate');
const shoppingIdText = document.querySelector('.shoppingIdText');
const titleRate = document.querySelector('#titleRate');
const heartReaction = document.querySelector('#heartReaction');
const numRating = document.querySelector('.numRating');

shoppingAlternate.setAttribute('class', 'hide');
shoppingListBtn.textContent = 'Add ingredients to shopping list';
heartReaction.textContent = "The default rating is 5 hearts";

function changeText() {
    heartReaction.textContent = "The default rating is 5 hearts";
}

const WowRating = document.querySelector('#WowRating');
WowRating.addEventListener('mouseover', (e) => {
    e.preventDefault();
    heartReaction.textContent = "I'm in heaven with this recipe";
});

WowRating.addEventListener('mouseout', changeText, false);

const LikeRating = document.querySelector('#LikeRating');
LikeRating.addEventListener('mouseover', (e) => {
    e.preventDefault();
    heartReaction.textContent = "Surely like this recipe";
});

LikeRating.addEventListener('mouseout', changeText, false);

const OkRating = document.querySelector('#OkRating');
OkRating.addEventListener('mouseover', (e) => {
    e.preventDefault();
    heartReaction.textContent = "It's not bad but it's not ok";
});

OkRating.addEventListener('mouseout', changeText, false);

const BadRating = document.querySelector('#BadRating');
BadRating.addEventListener('mouseover', (e) => {
    e.preventDefault();
    heartReaction.textContent = "Don't like this recipe";
});

BadRating.addEventListener('mouseout', changeText, false);

const PoorRating = document.querySelector('#PoorRating');
PoorRating.addEventListener('mouseover', (e) => {
    e.preventDefault();
    heartReaction.textContent = "Terrible recipe. Couldn't eat it";
});

PoorRating.addEventListener('mouseout', changeText, false);

const radioCB = document.querySelectorAll('.radioCB');
for (let i = 0; i < radioCB.length; i++) {
    radioCB[i].addEventListener("change", function () {
        if (radioCB[i].checked) {
            if (radioCB[i].value == 5) {
                heartReaction.textContent = "I'm in heaven with this recipe";
            }
            else if (radioCB[i].value == 4) {
                heartReaction.textContent = "Surely like this recipe";
            }
            else if (radioCB[i].value == 3) {
                heartReaction.textContent = "It's not bad but it's not ok";
            }
            else if (radioCB[i].value == 2) {
                heartReaction.textContent = "Don't like this recipe";
            }
            else if (radioCB[i].value == 1) {
                heartReaction.textContent = "Terrible recipe. Couldn't eat it";
            }
            WowRating.removeEventListener('mouseout', changeText, false);
            LikeRating.removeEventListener('mouseout', changeText, false);
            OkRating.removeEventListener('mouseout', changeText, false);
            BadRating.removeEventListener('mouseout', changeText, false);
            PoorRating.removeEventListener('mouseout', changeText, false);
        }
    });
}

db.collection("recipe").where("recipeTitle", "==", title).onSnapshot((querySnapshot) => {
    querySnapshot.forEach(function (doc) {
        let event = new Date(doc.data().recipeDate.toDate());


        db.collection('users').where('userUID', '==', doc.data().recipeAuthorUID).onSnapshot((querySnapshot) => {
            querySnapshot.forEach((sfDoc) => {
                userImage.setAttribute('src', sfDoc.data().userImg);
                userName.textContent = 'By: ' + sfDoc.data().userName;
                authorHref.href = `profile.html?user=${encodeURIComponent(sfDoc.data().userUID)}`;
            });
        });

        recipeImg.setAttribute('src', doc.data().recipeImg);

        recipeTitle.textContent = doc.data().recipeTitle;
        recipeDate.textContent = event.toLocaleString();
        recipeDesc.textContent = doc.data().recipeDesc;
        mainIngredient.textContent = doc.data().mainIngredient;
        cuisine.textContent = doc.data().cuisine;
        meal.textContent = doc.data().mealType;
        occasion.textContent = doc.data().occasion;
        prepTime.textContent = doc.data().prepTime;
        titleRate.textContent = doc.data().recipeTitle;

        var fragmentInstrct = new DocumentFragment();

        let i = 1;
        doc.data().ingredient.forEach(element => {
            html = [
                `
                    <p>
                        <label>
                            <input type="checkbox" name="ingredientList" class="ingredientCB" value="${element}" />
                            <span class="black-text">Ingredient${' ' + i + ': ' + element}</span>
                        </label>
                    </p>
                `
            ].join('');
            var li = document.createElement('li');
            li.setAttribute('class', 'collection-item');

            li.innerHTML = html;
            fragmentInstrct.appendChild(li);

            i += 1;
        });

        ingredientCol.appendChild(fragmentInstrct);

        var fragmentIngrdnt = new DocumentFragment();

        let k = 1;
        doc.data().instruction.forEach(element => {
            html = [
                `
                    <p>
                        <label>
                            <input type="checkbox" />
                            <span class="black-text">Step${' ' + k + ': ' + element}</span>
                        </label>
                    </p>
                `
            ].join('');
            var li = document.createElement('li');
            li.setAttribute('class', 'collection-item');

            li.innerHTML = html;
            fragmentIngrdnt.appendChild(li);

            i += 1;
        });

        instructionCol.appendChild(fragmentIngrdnt);

        shoppingList.addEventListener('submit', (e) => {
            e.preventDefault();

            var ingredientArray = [];

            if (ingredientCB2.checked) {
                $("input:checkbox[name=ingredientList]:checked").each(function () {
                    ingredientArray.push($(this).val());
                });

                auth.onAuthStateChanged((user) => {
                    if (user) {
                        const promises = [];
                        let i = 0;
                        ingredientArray.forEach(element => {
                            i += 1;
                            promises.push(db.collection('shoppingList').add({
                                userShoppingList: element,
                                order: i,
                                recipeId: doc.id,
                                status: false,
                                userId: user.uid,
                            }));
                        });

                        Promise.all(promises).then(results => {

                        }).catch(err => console.log(err.message));
                    } else {

                    }
                });
            }
            
            shoppingIdText.textContent = $('.ingredientCB:checked').length + ' ingredients are added to shopping list';
            shoppingAlternate.removeAttribute('class', 'hide');
            shoppingListBtn.setAttribute('class', 'hide');
        });

        submitRatings(doc);
        showRating(doc);
    });
})

let myList = setTimeout(() => {
    const ingredientCB = document.querySelectorAll('.ingredientCB');

    for (let i = 0; i < ingredientCB.length; i++) {
        ingredientCB[i].addEventListener("change", function () {
            if (ingredientCB[i].checked) {
                shoppingListBtn.textContent = 'Add this ' + $('.ingredientCB:checked').length + ' ingredients to shopping list';

            } else {
                shoppingListBtn.textContent = 'Add this all these ingredients to shopping list';
            }
        });
    }
}, 2000);

const submitRatings = (params) => {

    const heartRate = document.querySelector('#heartRate');
    heartRate.addEventListener('submit', (e) => {
        e.preventDefault();
        auth.onAuthStateChanged((user) => {
            if (user) {
                var data = 0;
                if (heartRate['rating'].value == '' || heartRate['rating'].value == ' ') {
                    heartRate['rating'].value = 5;
                    data = heartRate['rating'].value;
                }
                else {
                    data = heartRate['rating'].value;
                }

                db.collection('ratings').add({
                    comment: heartRate['commentRate'].value,
                    rating: data,
                    ratingDate: firebase.firestore.Timestamp.now(),
                    recipeId: params.id,
                    userId: user.uid,
                });


                db.collection("avrRatings").where("recipeId", "==", params.id).get().then((querySnapshot) => {
                    querySnapshot.forEach((docRatings) => {
                        var newNumRatings = docRatings.data().numRatings + 1;
                        var newAverage = parseInt((docRatings.data().numRatings * docRatings.data().ratingAverage + parseInt(data)) / (newNumRatings));
                        db.collection('avrRatings').doc(docRatings.id).update({
                            ratingAverage: parseFloat(newAverage).toFixed(),
                            numRatings: newNumRatings,
                        }).then(() => {
                            const modal = document.querySelector('#modal1');
                            M.Modal.getInstance(modal).close();
                            heartRate.reset();
                            $('#reviews').empty();
                            showRating(params);
                        });
                    });
                });
            }

            else {
                location.replace('auth.html');

            }
        });
    });
}

const showRating = (docRef) => {
    const progressForFive = document.querySelector('#progressForFive');
    const progressForFour = document.querySelector('#progressForFour');
    const progressForThree = document.querySelector('#progressForThree');
    const progressForTwo = document.querySelector('#progressForTwo');
    const progressForOne = document.querySelector('#progressForOne');

    db.collection('ratings').where('recipeId', '==', docRef.id).orderBy('ratingDate', 'desc').get().then((querySnapshot) => {
        var ratingFive = [];
        var ratingFour = [];
        var ratingThree = [];
        var ratingTwo = [];
        var ratingOne = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().rating == 5) {
                ratingFive.push(doc.data().rating);
            }

            else if (doc.data().rating == 4) {
                ratingFour.push(doc.data().rating);
            }

            else if (doc.data().rating == 3) {
                ratingThree.push(doc.data().rating);
            }

            else if (doc.data().rating == 2) {
                ratingTwo.push(doc.data().rating);
            }

            else if (doc.data().rating == 1) {
                ratingOne.push(doc.data().rating);
            }

            getReviews(doc);
            showUserRating(doc);

        });

        db.collection("avrRatings").where("recipeId", "==", docRef.id).get().then((querySnapshot) => {
            querySnapshot.forEach((queries) => {
                var ratingFiveWidth = 0;
                var ratingFourWidth = 0;
                var ratingThreeWidth = 0;
                var ratingTwoWidth = 0;
                var ratingOneWidth = 0;
                numRating.textContent = parseFloat(queries.data().ratingAverage).toFixed();

                ratingFiveWidth = (ratingFive.length / queries.data().numRatings) * 100;
                ratingFourWidth = (ratingFour.length / queries.data().numRatings) * 100;
                ratingThreeWidth = (ratingThree.length / queries.data().numRatings) * 100;
                ratingTwoWidth = (ratingTwo.length / queries.data().numRatings) * 100;
                ratingOneWidth = (ratingOne.length / queries.data().numRatings) * 100;

                progressForFive.style.width = ratingFiveWidth + '%';
                progressForFour.style.width = ratingFourWidth + '%';
                progressForThree.style.width = ratingThreeWidth + '%';
                progressForTwo.style.width = ratingTwoWidth + '%';
                progressForOne.style.width = ratingOneWidth + '%';
            });
        });
    });
}

const getReviews = (doc) => {
    const reviews = document.querySelector('#reviews');
    let event = new Date(doc.data().ratingDate.toDate());
    let html = [
        `
                    <img alt="profile-img" class="circle">
                    <a>
                        <span class="title"></span>
                    </a>
                    <p class="ratingDateText">${event.toLocaleString()}</p>
                    <p>
                        ${doc.data().comment}
                    </p>
                    <div class="card--rating-stars--wrapper secondary-content heartRatings">
                        <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                        <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                        <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                        <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                        <div class="card--rating-star"><i class='material-icons'>favorite</i></div>
                    </div>                       
                `
    ].join('');

    const li = document.createElement('li');
    li.setAttribute('class', 'collection-item avatar');
    li.setAttribute('data-id', doc.id);

    li.innerHTML = html;
    reviews.appendChild(li);
}

const showUserRating = (doc) => {
    setTimeout(() => {
        const heartRatings = document.querySelectorAll('.heartRatings');

        heartRatings.forEach(element => {
            var id = element.parentNode.getAttribute('data-id');

            if (doc.id == id) {
                for (var index = 0; index < doc.data().rating; index++) {
                    element.children[index].style.color = '#b71c1c';
                }

                db.collection('users').where('userUID', '==', doc.data().userId).get().then((querySnapshot) => {
                    querySnapshot.docs.forEach((userDocs) => {
                        element.previousElementSibling.previousElementSibling.previousElementSibling.href = `profile.html?user=${encodeURIComponent(userDocs.data().userUID)}`;
                        element.previousElementSibling.previousElementSibling.previousElementSibling.getElementsByClassName('title')[0].textContent = userDocs.data().userName;
                        element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('src', userDocs.data().userImg);
                    });
                });
            }
        });
    }, 500);
}