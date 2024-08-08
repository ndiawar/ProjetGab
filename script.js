if (!localStorage.getItem('users')) {
    // Initialisation des utilisateurs dans le localStorage
    let users = [
        { name: 'Alice', balance: 100000 },
        { name: 'Bob', balance: 150000 },
        { name: 'Charlie', balance: 200000 },
        { name: 'David', balance: 250000 },
        { name: 'Eve', balance: 300000 }
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
    let customAmount = parseInt(prompt("Veuillez saisir le montant à retirer (multiple de 1000) :"), 10);
    if (!isNaN(customAmount) && customAmount % 1000 === 0) {
        withdrawAmount(customAmount);
    } else {
        alert("Montant invalide. Veuillez saisir un multiple de 1000.");
    }
}

// Fonction pour changer l'utilisateur actuel
function selectUser(index) {
    currentUserIndex = index;
    localStorage.setItem('currentUserIndex', currentUserIndex);
    document.getElementById('current-user').textContent = JSON.parse(localStorage.getItem('users'))[currentUserIndex].name;
    alert(`Utilisateur sélectionné : ${JSON.parse(localStorage.getItem('users'))[currentUserIndex].name}`);
}

// Initialisation de l'utilisateur affiché
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-user').textContent = JSON.parse(localStorage.getItem('users'))[currentUserIndex].name;
});