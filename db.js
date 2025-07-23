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
    const typeColors = {
        fire: '#F08030',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dark: '#705848',
        dragon: '#7038F8',
        steel: '#B8B8D0',
        fairy: '#EE99AC',
        normal: '#A8A878'
    };
    
    const mainType = data.types[0].type.name;
    const bgColor = typeColors[mainType] || '#A8A878';
    const item = document.createElement('div');
    item.className = 'pokemon-item';
    item.innerHTML = `
        <div class="card" style="background-color: ${bgColor};" onclick="toggleCardBody(this)">
        <p># ${data.id}</p>
        <h3>${data.name}</h3>
        <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.name}">
        <div class="card-body-hidden" id="cardBody${data.id}">
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
        <p>Abilities: ${data.abilities.map(a => a.ability.name).join(', ')}</p>
        <p>Elements: ${data.types.map(t => t.type.name).join(', ')}</p>
        <p>Base Experience: ${data.base_experience}</p>
      </div>
      </div>   
      `;
    return item;
}
