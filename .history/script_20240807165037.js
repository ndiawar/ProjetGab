let utilisateurs = [];

// Fetch users from the JSON file
fetch('utilisateurs.json')
    .then(response => response.json())
    .then(data => {
        utilisateurs = data;
    })
    .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));

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
