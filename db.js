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
        const typeIconsHTML = data.types.map(t => {
        const typeName = t.type.name;
        const iconPath = `img-types/${typeName}.svg`;
        return `<img src="${iconPath}" alt="${typeName}" class="type-icon ${typeName}" title="${typeName}">`;
    }).join('');

    const mainType = data.types[0].type.name;
    const item = document.createElement('div');
    item.className = 'pokemon-item';
    item.classList.add(mainType);
    item.innerHTML = `
        <div class="card-header">
        <div class="pokemon-header">
        <h2 class="pokemon-id">#${data.id}</h2>
        <h3 class="pokemon-name">${data.name}</h3>
        </div>
        </div>
        <div class="card ${mainType}" onclick="toggleCardBody(this)">
        <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.name}">
        <div class="card-body-hidden" id="cardBody${data.id}">
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
        <p>Abilities: ${data.abilities.map(a => a.ability.name).join(', ')}</p>
        <p>Elements: ${data.types.map(t => t.type.name).join(', ')}</p>
        <p>Base Experience: ${data.base_experience}</p>
      </div>
      <div class="card-footer">
      ${typeIconsHTML}
      </div>
      `;
    return item;
}
