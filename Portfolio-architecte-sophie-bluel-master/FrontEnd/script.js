

// ÉTAPE 1 - récupération des photos de la galerie :

async function getWork() {
    const response = await fetch("http://localhost:5678/api/works");
    let projets = await response.json();
    return (projets)
}

async function genererProjet(projets) {
    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = ""

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];

        // pour dire que c'est à la SUITE DE et non a la PLACE DE on fait : += et non = 
        galerie.innerHTML += ` 
                <figure workId="${projet.id}">
                    <img src="${projet.imageUrl}" alt ="${projet.title}">
                    <figcaption>${projet.title}</figcaption>
                </figure> `
    }
}

async function displayImage() {
    const images = await getWork();
    genererProjet(images)
}
displayImage();


// ÉTAPE 2 - création du filtre par catégorie :

//récupération du tableau des catégories
async function getCategorie() {
    const res = await fetch("http://localhost:5678/api/categories");
    let resCategorie = await res.json();
    return (resCategorie);
}

// affichage de nos boutons par catégorie
async function categorieButton() {
    const filtres = document.querySelector(".filtres");
    const categories = await getCategorie();
    categories.forEach(category => {
        filtres.innerHTML += `
            <button class="category-title" id="${category.id}">${category.name}</button>
            `
    });
}

// filtrage au click par catégories
async function filtreCategorie() {
    const galerie = document.querySelector(".gallery")
    const allWork = await getWork()
    console.log(allWork);

    const allBoutons = document.querySelectorAll(".category-title");
    console.log(allBoutons);

    allBoutons.forEach((button) => {

        button.addEventListener("click", (e) => {
            let buttonId = e.target.id;

            galerie.innerHTML = "";
            if (buttonId !== "0") {
                const triWork = allWork.filter((image) => {
                    return image.categoryId == buttonId;
                });
                genererProjet(triWork);
            } else {
                displayImage();
            }
        })
    });
}

// debug des boutons filtres 
async function categorieMain() {
    await categorieButton();
    filtreCategorie();
}
categorieMain();

// ÉTAPE 3 : lien avec la page de connexion :

function verifToken() {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
        return (true)
    } else {
        return (false)
    }
}
verifToken();

const loged = window.sessionStorage.loged;
console.log(loged)
const logout = document.querySelector("header nav .logout");

if (loged == "true") {
    logout.textContent = "logout";
    logout.addEventListener("click", () => {
        window.sessionStorage.loged = false;
    })

    const isLoggedIn = true; // ou false, selon l'état de la connexion

    // Fonction pour afficher ou masquer les éléments
    function toggleElements() {
        var topBar = document.querySelector('.top-bar');
        var btnModif = document.querySelector('.btnModif');
        var filtres = document.querySelector(".filtres");

        if (isLoggedIn) {
            topBar.style.display = 'flex';
            btnModif.style.display = 'flex';
            filtres.style.display = 'none';
        } else {
            topBar.style.display = 'none';
            btnModif.style.display = 'none';
            filtres.style.display = 'flex';
        }
    }

    // Appel de la fonction au chargement de la page
    document.addEventListener('DOMContentLoaded', toggleElements);

}

// ÉTAPE 4 : création de la modale : 

const btnModif = document.querySelector(".btnModif");
const displayModale = document.querySelector(".creationModale");

btnModif.addEventListener("click", () => {
    displayModale.style.display = "flex"
})

const closeModale = document.querySelector(".fa-xmark");

closeModale.addEventListener("click", () => {
    displayModale.style.display = "none"
})

// injection des images dans la div class="imagesTravaux" du HTML
async function genererProjetModale() {
    const imagesTravaux = document.querySelector(".imagesTravaux"); // Récupération des éléments de la galerie
    const projets = await getWork();
    imagesTravaux.innerHTML = "";

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];

        const figure = document.createElement('figure');
        figure.classList.add('ajoutTravaux');
        figure.setAttribute("workId", projet.id);

        const img = document.createElement('img');
        img.src = `${projet.imageUrl}`;
        img.alt = `${projet.title}`;
        img.classList.add('miseEnPage');

        // ÉTAPE 5 : mettre les icones poubelles sur les images :  

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-alt', 'trashIcon');
        trashIcon.addEventListener('click', () => {


            // pour supprimer l'image dans la modale
            const token = localStorage.getItem("token");
            const id = figure.getAttribute("workId");

            fetch(`http://localhost:5678/api/works/${id}`, {        // ajout id work 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(response)
                    }
                    else {
                        figure.remove();                        // ajout de la logique de suppression d'image lorsqu'on clique sur l'icône de poubelle 
                        displayImage()
                    }
                })
        });
        figure.appendChild(trashIcon);
        figure.appendChild(img);
        imagesTravaux.appendChild(figure);
    }
}
genererProjetModale();


// ÉTAPE 6 : au click "ajouter une image"

// faire apparaitre la 2ème modale
const btnAjoutModale = document.querySelector(".modaleProjets button");
const modaleAjoutImg = document.querySelector(".modaleAjoutImg");
const modaleUne = document.querySelector(".creationModale");
const arrowLeft = document.querySelector(".fa-arrow-left");
const closeModaleAjout = document.querySelector(".closeModaleAjout")

async function genererModaleAjout() {
    btnAjoutModale.addEventListener("click", () => {
        modaleAjoutImg.style.display = "flex"
        modaleUne.style.display = "none"
    });

    arrowLeft.addEventListener("click", () => {
        modaleAjoutImg.style.display = "none";
        modaleUne.style.display = "flex";
    });

    closeModaleAjout.addEventListener("click", () => {
        modaleAjoutImg.style.display = "none"
    })
}
genererModaleAjout();


// liste de catégorie dans le filtre input select 
async function displayFiltreModale() {
    const select = document.querySelector(".modaleAjoutImg select")
    const categories = await getCategorie()

    categories.forEach(category => {
        const option = document.createElement("option")
        option.value = category.id
        option.textContent = category.name
        select.appendChild(option)
    })
}
displayFiltreModale();


// Sélection des éléments nécessaires
const afficheImg = document.querySelector(".contenuFichier img");
const inputFile = document.querySelector(".contenuFichier input");
const labelFile = document.querySelector(".contenuFichier label");
const iconeFile = document.querySelector(".contenuFichier i");
const paragrapheFile = document.querySelector(".contenuFichier p");

const form = document.querySelector(".modaleAjoutImg form");
const title = document.querySelector(".modaleAjoutImg #title");
const category = document.querySelector(".modaleAjoutImg #category");
const submitButton = document.querySelector(".modaleAjoutImg button");
const token = localStorage.getItem("token");

// Limite de taille en octets (4 Mo)
const maxFileSize = 4 * 1024 * 1024;

// Types de fichiers autorisés
const allowedFileTypes = ['image/jpeg', 'image/png'];

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];

    if (file) {
        if (!allowedFileTypes.includes(file.type)) {
            alert("Veuillez sélectionner un fichier JPG ou PNG.");
            inputFile.value = ''; // Réinitialiser l'input
            return;
        }

        if (file.size > maxFileSize) {
            alert("Le fichier doit être inférieur à 4 Mo.");
            inputFile.value = ''; // Réinitialiser l'input
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            afficheImg.src = e.target.result;
            afficheImg.style.display = "flex";
            labelFile.style.display = "none";
            iconeFile.style.display = "none";
            paragrapheFile.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // annule le comportement par défaut

    const formData = new FormData();
    formData.append("image", inputFile.files[0]);
    formData.append("title", title.value);
    formData.append("category", category.value);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();
        console.log(data);
        console.log("nouvelle image", data);
        displayImage();
        genererProjetModale();

        // Change the submit button color to green
        submitButton.style.backgroundColor = "#1D6154";

        // Clear the input fields
        afficheImg.style.display = "none";
        labelFile.style.display = "block";
        iconeFile.style.display = "block";
        paragrapheFile.style.display = "block";
        inputFile.value = '';
        title.value = '';
        category.value = '';

    } catch (error) {
        console.error("Error:", error);
    }
});

