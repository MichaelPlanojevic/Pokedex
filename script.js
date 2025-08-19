function init() {
  fetchMultiplePokemon(1, 35);
}

document.addEventListener('DOMContentLoaded', init);

function toggleCardBody(cardElement) {
  cardElement.classList.toggle('show-details');
}

function setOverlayTheme(data) {
    const content = document.querySelector('#pokemonOverlay .overlay-content');
    const mainType = data.types[0].type.name;
    content.className = 'overlay-content ' + mainType;
    document.getElementById('overlayName').textContent = data.name;
    document.getElementById('overlayImg').src = data.sprites.official_artwork;
}

function renderMainTab(data) {
    document.getElementById('tab-main').innerHTML = `
        <p><strong>Height:</strong> ${data.height}cm</p>
        <p><strong>Weight:</strong> ${data.weight}kg</p>
        <p><strong>Experience:</strong> ${data.base_experience}Exp</p>
        <p><strong>Abilities:</strong></p>
        <ul>${data.abilities.map(a => `<li>${a.ability.name}</li>`).join('')}</ul>
    `;
}

function renderStatsTab(data) {
    document.getElementById('tab-stats').innerHTML = `
       <ul>
        ${data.stats.map(stat => `
            <li class="stat-item">
                <span class="stat-name">${stat.stat.name}</span>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${(stat.base_stat / 255) * 100}%"></div>
                </div>
                <span class="stat-value">(${stat.base_stat})</span>
            </li>
        `).join('')}
    </ul>
    `;
}

async function renderEvolutionTab(speciesUrl) {
    const evolutions = await loadEvolutionChain(speciesUrl);
    const evoContainer = document.getElementById('tab-evochain');
    if (!evolutions.length) {
        evoContainer.innerHTML = '<p>No evolution data found.</p>';
        return;
    }
    evoContainer.innerHTML = `
        <div class="evolution-container">
          ${evolutions.map((poke, index) => `
            <div class="evolution-item">
              <img src="${poke.image}" alt="${poke.name}">
              <div class="evolution-name">${poke.name}</div>
            </div>
            ${index < evolutions.length - 1 ? `<div class="evolution-arrow"></div>` : ''}
          `).join('')}
        </div>
    `;
}

async function showOverlay(data) {
    setOverlayTheme(data);
    renderMainTab(data);
    renderStatsTab(data);
    await renderEvolutionTab(data.species.url);
    switchOverlayTab('main');
    document.getElementById('pokemonOverlay').style.display = 'flex';
}

function closeOverlay() {
  document.getElementById('pokemonOverlay').style.display = 'none';
}

function switchOverlayTab(tabName) {
  document.querySelectorAll('.overlay-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  const tabToShow = document.getElementById('tab-' + tabName);
  if (tabToShow) {
    tabToShow.classList.add('active');
  } else {
    console.warn('Tab nicht gefunden:', tabName);
  }
  document.querySelectorAll('.overlay-tabs button').forEach(btn => {
    btn.classList.remove('active');
  });
  const btnToActivate = document.querySelector(`.overlay-tabs button[onclick*="${tabName}"]`);
  if (btnToActivate) {
    btnToActivate.classList.add('active');
  }
}
