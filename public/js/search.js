const modalSubmit = document.querySelector('#modal-submit');

modalSubmit.addEventListener('submit', (e) => {
    e.preventDefault();

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
            console.log(doc.data());
        });
    });
});