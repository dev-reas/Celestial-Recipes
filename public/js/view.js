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
                            <input type="checkbox" class="indeterminate-checkbox" />
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
                            <input type="checkbox" class="indeterminate-checkbox" />
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
    });
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});