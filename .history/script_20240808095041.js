// Déclaration du tableau utilisateurs avec des valeurs d'objets
const utilisateurs = [
    { idCard: '1001', mdp: '51234', etatCmpt: false, nom: 'Dupont', prenom: 'Jean', solde: 1000000 },
    { idCard: '1002', mdp: '95678', etatCmpt: false, nom: 'Martin', prenom: 'Marie', solde: 1500000 },
    { idCard: '1003', mdp: '45637', etatCmpt: false, nom: 'Durand', prenom: 'Pierre', solde: 500000 },
    { idCard: '1004', mdp: '98712', etatCmpt: false, nom: 'Leroy', prenom: 'Luc', solde: 750000 },
    { idCard: '1005', mdp: '45632', etatCmpt: false, nom: 'Moreau', prenom: 'Sophie', solde: 2000000 },
    { idCard: '1006', mdp: '54832', etatCmpt: false, nom: 'Simon', prenom: 'Laura', solde: 3000000 },
    { idCard: '1007', mdp: '12345', etatCmpt: false, nom: 'Lambert', prenom: 'Alex', solde: 1200000 },
    { idCard: '1008', mdp: '67890', etatCmpt: false, nom: 'Garcia', prenom: 'Elena', solde: 1800000 },
    { idCard: '1009', mdp: '11223', etatCmpt: false, nom: 'Bernard', prenom: 'Nicolas', solde: 2500000 },
    { idCard: '1010', mdp: '44556', etatCmpt: false, nom: 'Petit', prenom: 'Lucie', solde: 2200000 }
];

// Sauvegarder les données initiales de l'utilisateur dans localStorage si ce n'est pas déjà fait
if (!localStorage.getItem('utilisateurs')) {
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
}

// Déclaration de variable pour enregistrer le nombre maximum de tentatives
// et une variable pour mettre dans le local storage si l'utilisateur est bloqué après trois tentatives
const maxAttempts = 3;
const userAttempts = JSON.parse(localStorage.getItem('userAttempts')) || {};

// Charge les données de l'utilisateur depuis le LocalStorage
let storedUsers = JSON.parse(localStorage.getItem('utilisateurs')) || [];
let currentUser = null; // Stocke l'utilisateur actuellement connecté

// On récupère les éléments id du formulaire pour interagir avec l'événement
// Récupère id du paragraphe pour afficher les messages d'erreurs
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Ajoute un gestionnaire d'événement pour le formulaire de connexion
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre de manière classique

    // Récupère les valeurs saisies par l'utilisateur
    const identifiant = document.getElementById('identifiant').value;
    const password = document.getElementById('password').value;

    // Recherche l'utilisateur correspondant à l'identifiant saisi
    const utilisateur = storedUsers.find(u => u.idCard === identifiant);

    if (!utilisateur) {
        // Affiche un message d'erreur si l'identifiant est incorrect
        errorMessage.textContent = "Identifiant de carte introuvable, veuillez réessayer.";
        errorMessage.style.display = "block";
        return;
    }

    if (utilisateur.etatCmpt) {
        // Affiche un message d'erreur si le compte est bloqué
        errorMessage.textContent = "Compte bloqué. Veuillez contacter votre banque.";
        errorMessage.style.display = "block";
        return;
    }

    if (!userAttempts[identifiant]) {
        // Initialise les tentatives de connexion pour l'utilisateur si elles n'existent pas encore
        userAttempts[identifiant] = 0;
    }

    if (utilisateur.mdp !== password) {
        // Vérifie si le mot de passe est correct
        userAttempts[identifiant]++;
        if (userAttempts[identifiant] >= maxAttempts) {
            // Bloque le compte après trois tentatives échouées
            utilisateur.etatCmpt = true;
            localStorage.setItem('utilisateurs', JSON.stringify(storedUsers));
            errorMessage.textContent = "Compte bloqué après trois tentatives échouées.";
            errorMessage.style.display = "block";
        } else {
            // Met à jour les tentatives de connexion restantes
            localStorage.setItem('userAttempts', JSON.stringify(userAttempts));
            errorMessage.textContent = `Mot de passe incorrect. Tentative ${userAttempts[identifiant]} sur ${maxAttempts}.`;
            errorMessage.style.display = "block";
        }
        return;
    }

    // Réinitialise les tentatives de connexion après une connexion réussie
    userAttempts[identifiant] = 0;
    localStorage.setItem('userAttempts', JSON.stringify(userAttempts));

    // Stocke les informations de l'utilisateur connecté dans sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(utilisateur));

    // Affiche un message de bienvenue et redirige vers la page de gestion
    alert(`Authentification réussie! Bienvenue, ${utilisateur.prenom} ${utilisateur.nom}.`);
    errorMessage.style.display = "none";
    window.location.href = './bienvenue.html'; // Redirection vers la page bienvenue
});

// Fonction pour vérifier le solde de l'utilisateur connecté
function verifierSolde() {
    // Récupère les informations de l'utilisateur depuis sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(currentUser)
    if (currentUser) {
        // Affiche le solde de l'utilisateur s'il est connecté
        alert(`Votre solde actuel est de ${currentUser.solde} Fcfa.`);
    } else {
        // Affiche un message d'erreur si aucun utilisateur n'est connecté
        alert("Utilisateur non connecté.");
    }
}

// Récupération des éléments du DOM pour les boutons
//const soldeBtn = document.getElementById('soldeBtn');

// Ajoute un gestionnaire d'événement pour le bouton "Vérifier le solde"
//soldeBtn.addEventListener('click', verifierSolde);
