const fs = require('fs');
const readline = require('readline');

// On va charger les données dans le fichier utilisateurs.json qui est notre fichier de données .json
function loadUtilisateurs() {
    try {
        const data = fs.readFileSync('utilisateurs.json', 'utf-8');
        return JSON.parse(data);
        console.log(data)
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return [];
    }
}

// Initialize users
const utilisateurs = loadUtilisateurs();

// Get references to form elements
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Handle form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const identifiant = document.getElementById('identifiant').value;
    const password = document.getElementById('password').value;

    // Find the user by idCard
    const utilisateur = utilisateurs.find(u => u.idCard === identifiant);

    if (!utilisateur) {
        errorMessage.textContent = "Identifiant de carte introuvable.";
        errorMessage.style.display = "block";
        return;
    }

    if (utilisateur.etatCmpt) {
        errorMessage.textContent = "Compte bloqué. Veuillez contacter votre banque.";
        errorMessage.style.display = "block";
        return;
    }

    if (utilisateur.mdp !== password) {
        errorMessage.textContent = "Mot de passe incorrect.";
        errorMessage.style.display = "block";
        return;
    }

    // Successful login
    alert(`Authentification réussie! Bienvenue, ${utilisateur.prenom} ${utilisateur.nom}.`);
    errorMessage.style.display = "none";

    // Redirect to the user's dashboard or main page
    window.location.href = 'dashboard.html'; // Replace with actual dashboard URL
});

