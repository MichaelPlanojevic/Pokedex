function init() {
  fetchMultiplePokemon(1, 35);
}

document.addEventListener('DOMContentLoaded', init);

function toggleCardBody(cardElement) {
  cardElement.classList.toggle('show-details');
}

function showOverlay(data) {
  const overlay = document.getElementById('pokemonOverlay');
  const content = overlay.querySelector('.overlay-content');
  const mainType = data.types[0].type.name;
  content.className = 'overlay-content ';
  content.classList.add(mainType);
  document.getElementById('overlayImg').src = data.sprites.front_default;
  document.getElementById('overlayName').textContent = data.name;
  document.getElementById('tab-attacks').innerHTML = data.moves && data.moves.length > 0
    ? `<ul>${data.moves.slice(0, 10).map(m => `<li>${m.move.name}</li>`).join('')}</ul>`
    : 'Keine Attacken gefunden.';
  document.getElementById('tab-stats').innerHTML = `
        <p><strong>Größe:</strong> ${data.height}cm</p>
        <p><strong>Gewicht:</strong> ${data.weight}kg</p>
        <p><strong>Erfahrung:</strong> ${data.base_experience}Exp</p>`;
  document.getElementById('tab-abilities').innerHTML = `
        <ul>${data.abilities.map(a => `<li>${a.ability.name}</li>`).join('')}</ul>`;
  switchOverlayTab('attacks');
  overlay.style.display = 'flex';
}

function closeOverlay() {
  document.getElementById('pokemonOverlay').style.display = 'none';
}

function switchOverlayTab(tabName) {
  const allTabs = ['attacks', 'stats', 'abilities'];
  allTabs.forEach(tab => {
    document.getElementById('tab-' + tab).style.display = (tab === tabName) ? 'block' : 'none';
  });
}