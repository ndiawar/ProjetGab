// Initialisation des utilisateurs dans le localStorage
if (!localStorage.getItem('users')) {
    const users = [
        { idCard: '1001', mdp: '51234', etatCmpt: false, nom: 'Dupont', prenom: 'Jean', balance: 10000000 },
        { idCard: '1002', mdp: '95678', etatCmpt: false, nom: 'Martin', prenom: 'Marie', balance: 200000000 },
        { idCard: '1003', mdp: '45637', etatCmpt: false, nom: 'Durand', prenom: 'Pierre', balance: 10000000 },
        { idCard: '1004', mdp: '98712', etatCmpt: false, nom: 'Leroy', prenom: 'Luc', balance: 10090010 },
        { idCard: '1005', mdp: '45632', etatCmpt: false, nom: 'Moreau', prenom: 'Sophie', balance: 50000046000 },
        { idCard: '1006', mdp: '54832', etatCmpt: false, nom: 'Simon', prenom: 'Laura', balance: 4000000 },
        { idCard: '1007', mdp: '12345', etatCmpt: false, nom: 'Lambert', prenom: 'Alex', balance: 60000 },
        { idCard: '1008', mdp: '67890', etatCmpt: false, nom: 'Garcia', prenom: 'Elena', balance: 60038 },
        { idCard: '1009', mdp: '11223', etatCmpt: false, nom: 'Bernard', prenom: 'Nicolas', balance: 12338403 },
        { idCard: '1010', mdp: '44556', etatCmpt: false, nom: 'Petit', prenom: 'Lucie', balance: 10000000 }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

// Variable pour garder trace de l'utilisateur actuel
let currentUserIndex = localStorage.getItem('currentUserIndex') || 0;

// Fonction pour mettre à jour l'affichage du solde
function updateBalanceDisplay() {
    let users = JSON.parse(localStorage.getItem('users'));
    alert(`Votre nouveau solde est de : ${users[currentUserIndex].balance} FCFA`);
}

// Fonction pour effectuer un retrait
function withdrawAmount(amount) {
    let users = JSON.parse(localStorage.getItem('users'));
    if (users[currentUserIndex].balance >= amount) {
        users[currentUserIndex].balance -= amount;
        localStorage.setItem('users', JSON.stringify(users));
        alert(`Vous avez retiré ${amount} FCFA`);
        updateBalanceDisplay();
    } else {
        alert("Solde insuffisant");
    }
}

// Fonction pour demander un montant personnalisé
function withdrawCustomAmount() {
    let input = prompt("Veuillez saisir le montant à retirer (multiple de 1000) :");

    // Vérifier si l'entrée est un nombre entier valide et s'il est multiple de 1000
    let customAmount = parseFloat(input);
    
    // Vérifier si l'entrée est un nombre valide, entier, et multiple de 1000
    if (Number.isInteger(customAmount) && customAmount > 0 && customAmount % 1000 === 0) {
        withdrawAmount(customAmount);
    } else {
        alert("Montant invalide. Veuillez saisir un montant entier et multiple de 1000, sans virgule.");
    }
}

// Fonction pour changer l'utilisateur actuel
function selectUser(index) {
    currentUserIndex = index;
    localStorage.setItem('currentUserIndex', currentUserIndex);
    document.getElementById('current-user').textContent = JSON.parse(localStorage.getItem('users'))[currentUserIndex].nom;
    alert(`Utilisateur sélectionné : ${JSON.parse(localStorage.getItem('users'))[currentUserIndex].nom}`);
}

// Initialisation de l'utilisateur affiché
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-user').textContent = JSON.parse(localStorage.getItem('users'))[currentUserIndex].nom;
});
