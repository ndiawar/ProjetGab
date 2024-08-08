//Déclaration du tableau utilisateurs avec des valeurs d'objets
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

//Sauvegarder les données initials de l'utilisateur dans localStorage si ce n'est pas déja fait
if (!localStorage.getItem('utilisateurs')) {
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
}

//Déclaration de variable pour enregister le nombre maximum de tentative 
//et une variable pour mettre dans le local storage si l'utilisateur est bloqué aprés trois tentative
const maxAttempts = 3;
const userAttempts = JSON.parse(localStorage.getItem('userAttempts')) || {};

// Charge les données de l'utilisateur depuis le LocalStorage
let storedUsers = JSON.parse(localStorage.getItem('utilisateurs')) || [];
//On recupère lesélément id du formulaire pour interagir avec l'événement
//Récupére id du paragraphe pour afficher les msg d'rreurs
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
// Lafonction qui lance l'événement connexion
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
//On recupère les valeurs saisient par les utilisateurs
    const identifiant = document.getElementById('identifiant').value;
    const password = document.getElementById('password').value;
//On recherche l'utilisateur dans le store qui enregistre notre tableau  
//Pour le vérifier ensuite avec l'information que l'utilisateur à saisie "identifiant"
    const utilisateur = storedUsers.find(u => u.idCard === identifiant);

    if (!utilisateur) {
        errorMessage.textContent = "Identifiant de carte introuvable,Veuillez réessayer.";
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

    userAttempts[identifiant] = 0; // Réinitialise les tentatives
    localStorage.setItem('userAttempts', JSON.stringify(userAttempts));
    alert(`Authentification réussie! Bienvenue, ${utilisateur.prenom} ${utilisateur.nom}.`);
    errorMessage.style.display = "none";
    window.location.href = './bienvenue.html'; // Redirection vers la page bienvenue
});
