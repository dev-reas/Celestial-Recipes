let paramsString = window.location.search;
let searchParams = new URLSearchParams(paramsString);
let title = decodeURIComponent(searchParams.get('view'));


const recipeTitle = document.querySelector('#recipeTitle');
const userName = document.querySelector('#recipeAuthor');
const recipeDate = document.querySelector('#recipeDate');
const userImage = document.querySelector('#recipeAuthorImage');
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

shoppingAlternate.setAttribute('class', 'hide');
shoppingListBtn.textContent = 'Add this all these ingredients to shopping list';
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

db.collection("recipe").where("recipeTitle", "==", title).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        let event = new Date(doc.data().recipeDate.toDate());

        userImage.setAttribute('src', doc.data().recipeAuthorPhoto);
        userName.textContent = 'By: ' + doc.data().recipeAuthor;
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

                shoppingIdText.textContent = $('.ingredientCB:checked').length + ' ingredients are added to shopping list';
            }

            else {
                $("input:checkbox[name=ingredientList]:not(:checked)").each(function () {
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
                shoppingIdText.textContent = 'All ingredients are added to shopping list';
            }

            shoppingAlternate.removeAttribute('class', 'hide');
            shoppingListBtn.setAttribute('class', 'hide');
        });

        submitRatings(doc.id);
        getComments(doc.id);
    });
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

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
    auth.onAuthStateChanged((user) => {
        if (user) {
            const heartRate = document.querySelector('#heartRate');
            heartRate.addEventListener('submit', (e) => {
                e.preventDefault();
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
                    recipeId: params,
                    userId: user.uid,
                });
            });
        }

        else {
            window.location.replace("http://localhost:5000/login-page.html");
        }
    });
}

const getComments = (commentsId) => {
    db.collection("ratings").where("recipeId", "==", commentsId)
        .get()
        .then((querySnapshot) => {
            var commentsArray = [];
            querySnapshot.forEach((doc) => {
                commentsArray.push(doc.data());
            });
            console.log(commentsArray.length);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}