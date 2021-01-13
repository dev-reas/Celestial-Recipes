// get data
auth.onAuthStateChanged((user) => {
    if (user) {
        userId = user.uid;
        db.collection('recipe').where("recipeAuthorUID", "==", userId).get().then(snapshot => {
            setupRecipes(snapshot.docs);
        })

        const recipeList = document.querySelector('.recipes');
        const setupRecipes = (data) => {

            let html = '';
            data.forEach(doc => {
                const recipeCol = doc.data();
                console.log(recipeCol);

                const li = `
                    <div class="col l3 m4 s12" data-id="${doc.id}">
                        <div class="card sticky-action">
                            <div class="card-reveal">
                                <p>Reveal reveal</p>
                                <span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span>
                                <p>${recipeCol.recipeDesc}</p>
                            </div>
                            <div class="card-action">
                                <div class="center">${recipeCol.recipeTitle}</div>
                                <a class="btn red btn-floating halfway-fab pulse activator left"><i class="material-icons">add</i></a>
                            </div>
                            <div class="card-image">
                                <img src="${recipeCol.recipeImg}">
                                
                            </div>
                            <div class="card-content">
                                <p style="padding-left: 1vw">By: ${recipeCol.recipeAuthor}</p>
                            </div>
                            <div class="card-action center">
                                <a>Show this Recipe</a>
                            </div>
                        </div>
                    </div>
                `;

                html += li;
            });

            recipeList.innerHTML = html;
        }
    }

    else {

    }
});


