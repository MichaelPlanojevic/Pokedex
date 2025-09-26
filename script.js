let currentIndex = 0;
let allPokemonData = [];

async function init() {
  document.getElementById("closeOverlayBtn").addEventListener("click", closeOverlayBtn);
  document.getElementById("searchInput").addEventListener("input", filterSearchPokemon);
  document.getElementById("nextBtn").addEventListener("click", nextPokemon);
  document.getElementById("prevBtn").addEventListener("click", previousPokemon);
  document.getElementById("mainTab").addEventListener("click", () => switchOverlayTab('main'));
  document.getElementById("statsTab").addEventListener("click", () => switchOverlayTab('stats'));
  document.getElementById("evochainTab").addEventListener("click", () => switchOverlayTab('evochain'));
  await loadingScreen();
  document.getElementById("loadingScreen").classList.add("hidden");
  document.querySelector(".pokemon-list").style.display = "flex";
  document.getElementById("overlayContent").addEventListener("click", event => event.stopPropagation());
  document.getElementById("loadMoreBtn").addEventListener("click", loadMorePokemon);
}

async function loadingScreen() {
  await Promise.all([
    fetchMultiplePokemon(1, 35),
    new Promise(resolve => setTimeout(resolve, 2000))
  ]);
}

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
  document.getElementById('main').innerHTML = `
        <p class="overlay-text"><strong>Height:</strong> ${data.height}m</p>
        <p class="overlay-text"><strong>Weight:</strong> ${data.weight}kg</p>
        <p class="overlay-text"><strong>Experience:</strong> ${data.base_experience}Exp</p>`
}

function renderStatsTab(data) {
  document.getElementById('stats').innerHTML = `
       <ul class="stats-list">
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
  const evoContainer = document.getElementById('evochain');
  evoContainer.innerHTML = `
        <div class="evolution-container">
          ${evolutions.map((poke, index) => `
            <div class="evolution-item">
              <img src="${poke.image}" alt="${poke.name}">
              <div class="evolution-name">${poke.name}</div>
            </div>
            ${index < evolutions.length - 1 ? `<div class="evolution-arrow"></div>` : ''}
          `).join('')}
        </div>`;
}

async function showOverlay(data) {
  setOverlayTheme(data);
  renderMainTab(data);
  renderStatsTab(data);
  await renderEvolutionTab(data.species.url);
  switchOverlayTab('main');
  document.getElementById('pokemonOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  enableOverlayClosing();
}

function enableOverlayClosing() {
  const overlay = document.getElementById('pokemonOverlay');
  function closeOverlay(event) {
    if (event.target === overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  overlay.addEventListener('click', closeOverlay);
  overlay.addEventListener('touchstart', closeOverlay);
}

function closeOverlayBtn() {
  const overlay = document.getElementById('pokemonOverlay');
  overlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function switchOverlayTab(tabName) {
  document.querySelectorAll('.overlay-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  const tabToShow = document.getElementById(tabName);
  if (tabToShow) {
    tabToShow.classList.add('active');
  }
  document.querySelectorAll('.overlay-tabs button').forEach(btn => {
    btn.classList.remove('active');
  });
  const btnToActivate = document.querySelector(`.overlay-tabs button[onclick*="${tabName}"]`);
  if (btnToActivate) {
    btnToActivate.classList.add('active');
  }
}

async function nextPokemon() {
  if (allPokemonData.length === 0) return;
  currentIndex = (currentIndex + 1) % allPokemonData.length;
  showOverlay(allPokemonData[currentIndex]);
}

async function previousPokemon() {
  if (allPokemonData.length === 0) return;
  currentIndex = (currentIndex - 1 + allPokemonData.length) % allPokemonData.length;
  showOverlay(allPokemonData[currentIndex]);
}

function filterSearchPokemon() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const message = document.getElementById("searchMessage");
  if (query.length === 0) {
    refreshPokemon();
    return;
  }
  if (query.length < 3) {
    message.textContent = "Please enter at least 3 characters.";
    message.style.display = "flex";
    return;
  } else {
    message.style.display = "none";
  }
  const allPokemon = document.querySelectorAll("#pokemonList .pokemon-item");
  allPokemon.forEach(pokemon => {
    const name = pokemon.querySelector(".pokemon-name").textContent.toLowerCase();
    pokemon.style.display = name.includes(query) ? "block" : "none";
  });
}

function refreshPokemon() {
  const allPokemon = document.querySelectorAll("#pokemonList .pokemon-item");
  allPokemon.forEach(pokemon => (pokemon.style.display = "block"));
  document.getElementById("searchMessage").style.display = "none";
}

async function loadMorePokemon() {
  const currentCount = allPokemonData.length;
  const nextStart = currentCount + 1;
  const nextEnd = currentCount + 20;
  document.getElementById("loadingScreen").classList.remove("hidden");
  const newPokemon = await fetchMultiplePokemon(nextStart, nextEnd);
  await new Promise(resolve => setTimeout(resolve, 2000));
  const uniqueNewPokemon = newPokemon.filter(newPoke =>
    !allPokemonData.some(existingPoke => existingPoke.name === newPoke.name)
  );
  allPokemonData.push(...uniqueNewPokemon);
  document.getElementById("loadingScreen").classList.add("hidden");
}