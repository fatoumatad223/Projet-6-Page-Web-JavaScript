/*const email = document.getElementById('email').value
const password = document.getElementById('password').value;
const form = document.querySelector("form");
const messageErreur = document.querySelector(".login p");

requête POST avec FETCH (GET/PUT/PATCH/DELETE) 
- method : post 
- headers :
- chargeUtile 
*/

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre normalement

  // Récupère les valeurs saisies par l'utilisateur
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // Envoie les données d'identification au backend
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect'); // Lancer une exception
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      localStorage.setItem("token", data.token);
      window.sessionStorage.loged = true;
      // Connexion réussie
      // alert('Connexion réussie ! Redirection vers la page d\'accueil...');
      // Redirection vers la page d'accueil
      window.location.href = 'index.html';
    })
    .catch(error => {
      // Affiche un message d'erreur si la connexion échoue
      document.getElementById('error').textContent = error.message;
    })
});

