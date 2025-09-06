async function fetchMultiplePokemon(start = 1, end = 151) {
    const container = document.getElementById('pokemonList');
    container.innerHTML = '';
    try {
        const promises = [];
        for (let id = start; id <= end; id++) {
            promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
        }
        const results = await Promise.all(promises);
        results.forEach(data => {
            const item = createPokemonItemColor(data);
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

function capitalize(str) {
    if(!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchSpeciesData(speciesUrl) {
    const res = await fetch(speciesUrl);
    return await res.json();
}

function extractEvolutionNames(evoChainData) {
    const names = [];
    for (let currentEvo = evoChainData.chain; currentEvo; currentEvo = currentEvo.evolves_to[0]) {
        names.push(currentEvo.species.name);
    }
    return names;
}

async function getPokemon(name) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const { name: pokeName, sprites } = await res.json();
    return {
        name: capitalize(pokeName),
        image: sprites.other['official-artwork'].front_default || sprites.front_default
    };
}

async function fetchPokemonDetails(names) {
    return Promise.all(names.map(getPokemon));
}

async function loadEvolutionChain(speciesUrl) {
    const evolutionTab = document.getElementById('evochain');
    evolutionTab.innerHTML = `<p>Loading evolution chain...</p>`;
    try {
        const speciesData = await fetchSpeciesData(speciesUrl);
        const resEvoChain = await fetch(speciesData.evolution_chain.url);
        const evoChainData = await resEvoChain.json();
        const evolutionNames = extractEvolutionNames(evoChainData);
        const evolutions = await fetchPokemonDetails(evolutionNames);
        return evolutions;
    } catch (error) {
        console.error('Error loading evolution chain:', error);
        return [];
    }
}

function createPokemonItemColor(data) {
    const minimalData = extractMinimalData(data);
    const mainType = minimalData.types[0].type.name;
    const item = document.createElement('div');
    item.className = 'pokemon-item';
    item.classList.add(mainType);
    item.appendChild(createCardHeader(minimalData));
    item.appendChild(createCardElement(minimalData));
    return item;
}

function extractMinimalData({
  id, name, height, weight, stats, base_experience, sprites, abilities, types, species
}) {
  return {
    id, name: capitalize(name), height, weight, base_experience,
    stats: stats.map(s => ({ stat: { name: s.stat.name }, base_stat: s.base_stat })),
    sprites: {
      front_default: sprites.front_default,
      official_artwork: sprites.other['official-artwork'].front_default
    },
    abilities: abilities.map(a => ({ ability: { name: a.ability.name } })),
    types: types.map(t => ({ type: { name: t.type.name } })),
    species: { url: species.url }
  };
}

function createCardHeader(data) {
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
        <div class="pokemon-header">
            <h2 class="pokemon-id">#${data.id}</h2>
            <h3 class="pokemon-name">${data.name}</h3>
        </div>
    `;
    return header;
}

function createCardElement(data) {
    const mainType = data.types[0].type.name;
    const card = document.createElement('div');
    card.className = `card ${mainType}`;
    card.innerHTML = `
        <img src="${data.sprites.official_artwork}" class="card-img-top" alt="${data.name}">
        <div class="card-body-hidden"></div>
        <div class="card-footer">${generateTypeIcons(data)}</div>`;
    card.dataset.pokemon = JSON.stringify(data);
    card.addEventListener('click', () => {
    const pokemon = JSON.parse(card.dataset.pokemon);
    showOverlay(pokemon);
    });
    return card;
}

function generateTypeIcons(data) {
    return data.types.map(t => {
        const typeName = t.type.name;
        const iconPath = `img-types/${typeName}.svg`;
        return `<img src="${iconPath}" alt="${typeName}" class="type-icon ${typeName}" title="${typeName}">`;
    }).join('');
}
