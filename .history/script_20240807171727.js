let utilisateurs = [];

// On va utilisée la méthode fetch pour utiliser les données du fichier JSON
fetch('utilisateurs.json')
    .then(response => response.json())
    .then(data => {
        utilisateurs = data;
        console.log(utilisateurs);
    })
    .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));

// On récupère les éléments pour interagir avec le DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// On déclare la fonction envoie du formulaire
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const identifiant = document.getElementById('identifiant').value;
    const password = document.getElementById('password').value;

    // On recherche l'id du client dans le tableau et on l'enregistre sur la variable utilisateur
    const utilisateur = utilisateurs.find(u => u.idCard === identifiant);

    if (!utilisateur) {
        errorMessage.textContent = "Identifiant de carte introuvable,veuillez réessayer.";
        errorMessage.style.display = "block";
        return;
    }

    if (utilisateur.etatCmpt) {
        errorMessage.textContent = "Compte bloqué. Veuillez contacter votre banque.";
        errorMessage.style.display = "block";
        return;
    }

    if (utilisateur.mdp !== password) {
        errorMessage.textContent = "Mot de passe incorrect, veuillez saisir un mot de passe valide.";
        errorMessage.style.display = "block";
        return;
    }

    // Successful login
    alert(`Authentification réussie! Bienvenue, ${utilisateur.prenom} ${utilisateur.nom}.`);
    errorMessage.style.display = "none";

    // Redirect to the user's dashboard or main page
    window.location.href = './bienvenue.html'; // Replace with actual dashboard URL
});
