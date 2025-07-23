function init() {
    fetchMultiplePokemon(1,35);
}

document.addEventListener('DOMContentLoaded', init);

function toggleCardBody(cardElement) {
  cardElement.classList.toggle('show-details');
}