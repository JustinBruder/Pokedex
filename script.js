let currentPokemon;
let pokemon = [];
let pokemonNames = [];
let pokemonStats = [];
let pokemonId = [];
let pokemonLoadStart = 1;

async function loadPokemon(start) {
  start = start || 1;
  for (let i = start; i < start + 20; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();

    pokemon.push(currentPokemon);
    pokemonNames.push(currentPokemon["name"]);
    pokemonStats.push(currentPokemon["stats"]);
    pokemonId.push(currentPokemon["id"]);

    renderPokemonInfoSmallCards(currentPokemon);
  }
}



function renderPokemonInfoSmallCards(currentPokemon) {
  let type1 = currentPokemon.types[0].type.name;

  // ich prüfe ob das Array types mehr als eine Stelle hat, getrennt durch tenären Operator (?), Bedingung ? AusdruckWennWahr : AusdruckWennFalsch

  let type2 =
    currentPokemon.types.length > 1 ? currentPokemon.types[1].type.name : null;
  
  // durch .charAt(0) extrahiere ich den ersten Buchstaben des aktuellen Pokemon den ich dann durch .toUpperCase() in einen Großbuchstaben umwandle, mit .slice(1) wird der Name ab dem 2. Buchstaben wieder angehangen
  let pokemonNameFormatted = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);

  document.getElementById("content").innerHTML += generateHTMLPokemonInfoSmallCards(type1, type2, pokemonNameFormatted, currentPokemon);
}



function generateHTMLPokemonInfoSmallCards(type1, type2, pokemonNameFormatted, currentPokemon) {
  return `
    <div onclick="openCardBig(${currentPokemon.id})" class="pokemonContainerSmall transition bg-${type1}">
      <div class="TextContainerCardSmall">
        <h2 id="pokemonCardSmallName">${pokemonNameFormatted}</h2>
        <h4 id="pokedexNumberCardSmall">#${currentPokemon.id}</h4>
      </div>
      <span id="typeCardSmall">${type1}${type2 ? " / " + type2 : ""}</span>
      <div class="containerImageSmall">
        <img class="pokeballTransparent" src="./img/pokeballTransparent.png">
        <img src="${currentPokemon.sprites.other.home.front_default}" id="pokemonImageSmall">
      </div>
    </div>
  `;
}

async function loadMorePokemon() {
  pokemonLoadStart += 20;
  await loadPokemon(pokemonLoadStart);
}

function openCardBig(i) {
  document.getElementById("dialogContainer").classList.remove("d-none");
  document.getElementById("dialogContainer").innerHTML = generateHTMLCardBig(i);
  generateAboutHTML(i);
}

function closeCardBig() {
  document.getElementById("dialogContainer").classList.add("d-none");
}

function generateHTMLCardBig(i) {
  let type1 = pokemon[i - 1].types[0].type.name;
  let type2 =
    pokemon[i - 1].types.length > 1 ? pokemon[i - 1].types[1].type.name : null;
    
  let pokemonNameFormatted = formatPokemonName(pokemonNames[i - 1]);

  return `
      <div id="dialogContainer" class="dialogContainer">
          <div id="containerPokemonBig" class="containerPokemonBig bg-${type1}">
              ${generateCardTopPart(i, type1, type2, pokemonNameFormatted)}
              ${generateCardBottomPart(i)}
          </div>
      </div>
      `;
}

function formatPokemonName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateCardTopPart(i, type1, type2, pokemonNameFormatted) {
  return `
      <div id="containerPokemonBigTopPart">
          <div class="TextContainerCardBig">
              <h1 id="pokemonName">${pokemonNameFormatted}</h1>
              <h3 id="pokedexNumber">#${pokemon[i - 1].id}</h3>
              <img onclick="closeCardBig(${i})" class="closeImage" src="./img/close.png">
          </div>
          <div class="typeContainer">
              <p id="typeText">${type1}${type2 ? " / " + type2 : ""}</p>
          </div>
      </div>
  `;
}

function generateCardBottomPart(i) {
  return `
      <div class="containerPokemonBigBottomPart">
          <img src="${pokemon[i - 1].sprites.other.home.front_default}" id="pokemonImage" />
          <div class="changeCardBigContainer">
              <img onclick="previousPokemon(${i})" class="imageArrows" src="./img/left.png">
              <p class="categoryCardBig"  onclick="generateAboutHTML(${i})">About</p>
              <p class="categoryCardBig"  onclick="generateStatsHTML(${i})">Stats</p>
              <p class="categoryCardBig"  onclick="generateMovesHTML(${i})">Moves</p>
              <img onclick="nextPokemon(${i})" class="imageArrows" src="./img/right.png">
          </div>
          <div id="BigCardContent">
          </div>
      </div>
  `;
}


function generateAboutHTML(i) {
  document.getElementById("BigCardContent").innerHTML = "";

  let heightInMeters = (pokemon[i - 1]["height"] / 10).toFixed(2);
  let weightInKilo = (pokemon[i - 1]["weight"] / 10).toFixed(1);

  document.getElementById("BigCardContent").innerHTML = `
  <div>
    <p class="pElementAbout">Height: ${heightInMeters}m</p>
    <p class="pElementAbout">Weight: ${weightInKilo}kg</p>
    <a target="_blank" href="https://pokemondb.net/ability/${
      pokemon[i - 1]["abilities"]["0"]["ability"]["name"]
    }" class="pElementAbout">Abilities: <b>${
    pokemon[i - 1]["abilities"]["0"]["ability"]["name"]
  }</b></a>
    <p class="pElementAbout">Base-Experience: ${
      pokemon[i - 1]["base_experience"]
    } XP</p>
  </div>`;
}



function generateStatsHTML(i) {
  document.getElementById("BigCardContent").innerHTML = "";
  document.getElementById("BigCardContent").innerHTML = `

<div>
    <canvas id="myChart"></canvas>
  </div>`;

  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: [
        "HP",
        "Attack",
        "Defense",
        "Special-Attack",
        "Special-Defense",
        "Speed",
      ],
      datasets: [
        {
          label: "Base Stats",
          data: [
            pokemonStats[i - 1]["0"]["base_stat"],
            pokemonStats[i - 1]["1"]["base_stat"],
            pokemonStats[i - 1]["2"]["base_stat"],
            pokemonStats[i - 1]["3"]["base_stat"],
            pokemonStats[i - 1]["4"]["base_stat"],
            pokemonStats[i - 1]["5"]["base_stat"],
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}



function generateMovesHTML(index) {
  document.getElementById("BigCardContent").innerHTML = "";

  let moves = pokemon[index]["moves"];

  // durch Math.min kann ich das moves-Array auslesen, das Array ist auch 40 beschränkt (eventuell beschränkung entfernen und overflow-y)

  let move = Math.min(moves.length, 40);

  for (let i = 0; i < move; i++) {
    document.getElementById("BigCardContent").innerHTML += `
      <a class="moves">${moves[i]["move"]["name"]}</a>`;
  }
}




function nextPokemon(i) {
  document.getElementById("dialogContainer").innerHTML = "";

  if (i < pokemonId.length) {
    openCardBig(i + 1);
  } else {
    i > pokemonId.length;
    openCardBig((i = 1));
  }
}



function previousPokemon(i) {
  document.getElementById("dialogContainer").innerHTML = "";

  if (i > 1) {
    openCardBig(i - 1);
  } else {
    i < 0;
    openCardBig((i = pokemonId.length));
  }
}



window.addEventListener("load", function () {
  document.getElementById("spinner").classList.add("d-none");
});



function searchPokemon() {

  // die Buchstaben werden nach Eingabe direkt in Kleinbuchstaben umgewandelt damit immer alle Pokemon gefunden werden können

  let searchInput = document.getElementById("searchInput").value.toLowerCase();

  // mit .querySelectorAll kann ich auf alle Einzelkarten mit der Klasse ,pokemonContainerSmall zugreifen 

  let pokemonContainers = document.querySelectorAll(".pokemonContainerSmall");

  pokemonContainers.forEach((container) => {
    let pokemonName = container
      .querySelector("#pokemonCardSmallName")
      .innerText.toLowerCase();
    if (pokemonName.includes(searchInput)) {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  });
}
