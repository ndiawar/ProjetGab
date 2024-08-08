// Récupération des éléments
const modal = document.getElementById('myModal');
const openModalButton = document.getElementById('openModalButton');
const closeButton = document.getElementsByClassName('close')[0];

// Quand l'utilisateur clique sur le bouton, ouvrir le modal
openModalButton.onclick = function() {
    modal.style.display = 'block';
}

// Quand l'utilisateur clique sur le <span> (x), fermer le modal
closeButton.onclick = () => {
    modal.style.display = 'none';
}

// Quand l'utilisateur clique en dehors du modal, fermer le modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    
}// Afficher les informations utilisateur dans le modal
function displayUserInfo() {
    const userInfo = getUserInfo();

    document.getElementById('idCard').textContent = utilisateur.idCard;
    

    // Afficher la date actuelle
    document.getElementById('date').textContent = new Date().toLocaleDateString();
}

