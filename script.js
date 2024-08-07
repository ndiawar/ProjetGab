// Récupération des éléments
const modal = document.getElementById('myModal');
const openModalButton = document.getElementById('openModalButton');
const closeButton = document.getElementsByClassName('close')[0];

// Quand l'utilisateur clique sur le bouton, ouvrir le modal
openModalButton.onclick = function() {
    modal.style.display = 'block';
}

// Quand l'utilisateur clique sur le <span> (x), fermer le modal
closeButton.onclick = function() {
    modal.style.display = 'none';
}

// Quand l'utilisateur clique en dehors du modal, fermer le modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
/*Lorsque l'utilisateur clique n'importe où en dehors du modal, fermer le modal*/
window.onclick = function(event) {
 if (event.target == modal) {
modal.style.display = "none";
 }
}