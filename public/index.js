const loggedOutlinks = document.querySelectorAll('.logged-out');
const loggedInlinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
    if (user) {
        //toggle UI elements

        loggedInlinks.forEach(item => item.style.display = 'block');
        loggedOutlinks.forEach(item => item.style.display = 'none');
    }

    else {
        //toggle UI elements

        loggedInlinks.forEach(item => item.style.display = 'none');
        loggedOutlinks.forEach(item => item.style.display = 'block');
    }
};

// get data
db.collection('recipe').get().then(snapshot => {
    setupRecipes(snapshot.docs);
})

const recipeList = document.querySelector('.recipes');
const setupRecipes = (data) => {

    let html = '';
    data.forEach(doc => {
        const recipeCol = doc.data();
        console.log(recipeCol);

        const stats = document.querySelectorAll('.authStats');
        if(auth.currentUser != recipeCol.recipeAuthorUID)
        {
            stats.forEach(item => item.style.display = 'block');
            console.log('same');
        }
        else{
            console.log('not same');
        }

        const text = `
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
                        <a href="view.html">Show this Recipe</a>
                    </div>
                </div>
            </div>
        `;

        html += text;
    });

    recipeList.innerHTML = html;
}


