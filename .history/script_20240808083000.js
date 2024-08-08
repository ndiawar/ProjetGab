// Définition initiale des utilisateurs
const utilisateurs = [
    { idCard: '1001', mdp: '51234', etatCmpt: false, nom: 'Dupont', prenom: 'Jean', solde: 100000 },
    { idCard: '1002', mdp: '95678', etatCmpt: false, nom: 'Martin', prenom: 'Marie', solde: 85000 },
    { idCard: '1003', mdp: '45637', etatCmpt: false, nom: 'Durand', prenom: 'Pierre', solde: 75000 },
    { idCard: '1004', mdp: '98712', etatCmpt: false, nom: 'Leroy', prenom: 'Luc', solde: 120000 },
    { idCard: '1005', mdp: '45632', etatCmpt: false, nom: 'Moreau', prenom: 'Sophie', solde: 95000 },
    { idCard: '1006', mdp: '54832', etatCmpt: false, nom: 'Simon', prenom: 'Laura', solde: 60000 },
    { idCard: '1007', mdp: '12345', etatCmpt: false, nom: 'Lambert', prenom: 'Alex', solde: 50000 },
    { idCard: '1008', mdp: '67890', etatCmpt: false, nom: 'Garcia', prenom: 'Elena', solde: 130000 },
    { idCard: '1009', mdp: '11223', etatCmpt: false, nom: 'Bernard', prenom: 'Nicolas', solde: 40000 },
    { idCard: '1010', mdp: '44556', etatCmpt: false, nom: 'Petit', prenom: 'Lucie', solde: 55000 }
];

// Sauvegarde des données initiales de l'utilisateur dans localStorage si ce n'est pas déjà fait
if (!localStorage.getItem('utilisateurs')) {
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
}

// Déclaration de variable pour enregistrer le nombre maximum de tentatives
// et une variable pour mettre dans le local storage si l'utilisateur est bloqué après trois tentatives
const maxAttempts = 3;
const userAttempts = JSON.parse(localStorage.getItem('userAttempts')) || {};

// Chargement des données de l'utilisateur depuis le LocalStorage
let storedUsers = JSON.parse(localStorage.getItem('utilisateurs')) || [];

// Récupération des éléments id du formulaire pour interagir avec l'événement
// Récupération id du paragraphe pour afficher les messages d'erreurs
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// La fonction qui lance l'événement de connexion
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Récupération des valeurs saisies par les utilisateurs
    const identifiant = document.getElementById('identifiant').value;
    const password = document.getElementById('password').value;

    // Recherche de l'utilisateur dans le store qui enregistre notre tableau  
    // Pour le vérifier ensuite avec l'information que l'utilisateur a saisie "identifiant"
    const utilisateur = storedUsers.find(u => u.idCard === identifiant);

    if (!utilisateur) {
        errorMessage.textContent = "Identifiant de carte introuvable, veuillez réessayer.";
        errorMessage.style.display = "block";
        return;
    }

    if (utilisateur.etatCmpt) {
        errorMessage.textContent = "Compte bloqué. Veuillez contacter votre banque.";
        errorMessage.style.display = "block";
        return;
    }

    if (!userAttempts[identifiant]) {
        userAttempts[identifiant] = 0;
    }

    if (utilisateur.mdp !== password) {
        userAttempts[identifiant]++;
        if (userAttempts[identifiant] >= maxAttempts) {
            utilisateur.etatCmpt = true;
            localStorage.setItem('utilisateurs', JSON.stringify(storedUsers));
            errorMessage.textContent = "Compte bloqué après trois tentatives échouées.";
            errorMessage.style.display = "block";
        } else {
            localStorage.setItem('userAttempts', JSON.stringify(userAttempts));
            errorMessage.textContent = `Mot de passe incorrect. Tentative ${userAttempts[identifiant]} sur ${maxAttempts}.`;
            errorMessage.style.display = "block";
        }
        return;
    }

    // Réinitialise les tentatives
    userAttempts[identifiant] = 0;
    localStorage.setItem('userAttempts', JSON.stringify(userAttempts));
    localStorage.setItem('currentUser', JSON.stringify(utilisateur));
    alert(`Authentification réussie! Bienvenue, ${utilisateur.prenom} ${utilisateur.nom}.`);
    errorMessage.style.display = "none";
    window.location.href = './bienvenue.html'; // Redirection vers la page bienvenue
});

// Code pour la page 'bienvenue.html'
window.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Vérifie si un utilisateur est authentifié
    if (!currentUser) {
        alert("Vous n'êtes pas connecté. Redirection vers la page de connexion.");
        window.location.href = './home.html';
    }

    // Fonction pour afficher le solde
    document.getElementById('soldeButton').addEventListener('click', () => {
        const soldeMessage = document.getElementById('soldeMessage');
        soldeMessage.textContent = `Votre solde actuel est de ${currentUser.solde} FCFA.`;
        soldeMessage.style.display = 'block';
        document.getElementById('retraitSection').style.display = 'none';
    });

    // Fonction pour afficher la section de retrait
    document.getElementById('retraitButton').addEventListener('click', () => {
        const retraitSection = document.getElementById('retraitSection');
        retraitSection.style.display = 'block';
        document.getElementById('soldeMessage').style.display = 'none';
    });

    // Fonction pour effectuer un retrait
    function retirer(montant) {
        const retraitMessage = document.getElementById('retraitMessage');

        if (montant > currentUser.solde) {
            retraitMessage.textContent = "Fonds insuffisants. Solde actuel: " + currentUser.solde + " FCFA.";
            retraitMessage.style.display = 'block';
        } else {
            currentUser.solde -= montant;
            retraitMessage.textContent = `Retrait de ${montant} FCFA effectué avec succès. Nouveau solde: ${currentUser.solde} FCFA.`;
            retraitMessage.style.display = 'block';

            // Mettre à jour l'utilisateur courant dans localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Mettre à jour les utilisateurs dans localStorage
            const updatedUsers = storedUsers.map(user =>
                user.idCard === currentUser.idCard ? currentUser : user
            );
            localStorage.setItem('utilisateurs', JSON.stringify(updatedUsers));
        }
    }

    // Gestion des événements de retrait
    document.querySelectorAll('.retrait-option').forEach(button => {
        button.addEventListener('click', () => {
            const montant = parseInt(button.getAttribute('data-amount'), 10);
            retirer(montant);
        });
    });

    // Option de retrait avec un montant personnalisé
    document.getElementById('autreMontant').addEventListener('click', () => {
        let montant = prompt("Entrez le montant à retirer (multiple de 1000) :");

        if (montant && montant % 1000 === 0) {
            retirer(parseInt(montant, 10));
        } else {
            alert("Montant invalide. Veuillez entrer un montant multiple de 1000.");
        }
    });

    // Fonction pour retourner au menu principal
    document.getElementById('retourButton').addEventListener('click', () => {
        window.location.href = './home.html';
    });

    // Fonction pour gérer la déconnexion
    document.getElementById('deconnexionButton').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert("Déconnexion réussie.");
        window.location.href = './home.html';
    });
});
