async function fetchMultiplePokemon(start = 1, end = 151) {
    const container = document.getElementById('pokemonList');
    container.innerHTML = '';
    for (let id = start; id <= end; id++) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            const item = createPokemonItemColor(data);
            container.appendChild(item);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
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

function extractMinimalData(data) {
    return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        base_experience: data.base_experience,
        sprites: {
            front_default: data.sprites.front_default
        },
        abilities: data.abilities.map(a => ({ ability: { name: a.ability.name } })),
        types: data.types.map(t => ({ type: { name: t.type.name } }))
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
        <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.name}">
        <div class="card-body-hidden"></div>
        <div class="card-footer">${generateTypeIcons(data)}</div>
    `;
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

