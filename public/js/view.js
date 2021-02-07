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
    });
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

shoppingAlternate.setAttribute('class', 'hide');
shoppingListBtn.textContent = 'Add this all these ingredients to shopping list';

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
