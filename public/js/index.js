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
const recipeList = document.querySelector('.recipes')
db.collection('recipe').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderRecipe(doc);
    });
});

function renderRecipe(doc) {
    let event = new Date(doc.data().recipeDate.toDate());
    let html = [
        `
        <div class="col l3 m4 s12" id="${doc.id}">
            <div class="card">
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">
                        <i class="material-icons right">close</i>
                    </span>
                    <h5>${doc.data().recipeTitle}</h5>
                    <p>${doc.data().recipeDesc}</p>
                    <p>${event.toLocaleString('en-GB')}</p>
                </div>
                <div class="card-action">
                    <div class="center">${doc.data().recipeTitle}</div>
                    <a class="btn red btn-floating halfway-fab pulse activator left"><i class="material-icons">add</i></a>
                </div>
                <div class="card-image">
                    <img src="${doc.data().recipeImg}">
                </div>
                <div class="card-content"><p style="padding-left: 1vw">By: ${doc.data().recipeAuthor}</p></div>
                <div class="card-action center"><a>Show this Recipe</a></div>
            </div>
        </div>
    `].join('');
    
    const div = document.createElement('div');
    div.innerHTML = html;
    recipeList.appendChild(div);
}