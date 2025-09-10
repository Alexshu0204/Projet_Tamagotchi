function start() {
  const startSound = document.getElementById('sound-start');
  startSound.currentTime = 0; 
  startSound.play();
}
function eggCrack() {
  const eggSound = document.getElementById('sound-egg');
  eggSound.currentTime = 0; 
  eggSound.play();
}

let hunger = 2;      
let energy = 70;      
let happiness = 100;  
let toggle = true;

const modal = document.getElementById('start-modal');
const hungerBar = document.querySelector('#hunger-bar .progress');
const energyBar = document.querySelector('#energy-bar .progress');
const happinessBar = document.querySelector('#happiness-bar .progress');
const sectionActions = document.getElementById('actions');
const open = document.getElementById('btn-open');

const btnFeed  = document.getElementById('btn-feed');
const btnPlay  = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');
const egg = document.getElementById('egg');
const pet = document.getElementById('pet');

const popup_foodsList = document.getElementById("popup-foodsList");
const popup = document.getElementById("popup-feed");
const closePopup = document.getElementById ("close-popup");



const clamp = (n) => Math.max(0, Math.min(100, n));

/***************************************************
 ----------------------Pop up-----------------------
 **************************************************/

modal.addEventListener('click', () => {
  modal.style.display = 'none';
  start();
 
});

const eggAnimation = setInterval(() => {
  if (toggle) {
    egg.style.animation = "bounce 2s infinite";
  } else {
    egg.style.animation = "shake 0.5s infinite alternate";
  }
  toggle = !toggle;
}, 1500); 


// Ouvre le menu des nourritures quand on clique sur "Nourrir"
btnFeed.addEventListener("click", () => {
  popup_foodsList.style.display = "flex";
});

// Quand on clique sur la pomme
const btnApple = document.getElementById("choose-apple");
btnApple.addEventListener("click", () => {
  popup_foodsList.style.display = "none"; // ferme le menu
  popup.style.display = "flex";           // ouvre la popup "il mange"

  // Effet sur les stats
  hunger = clamp(hunger - 15);
  happiness = clamp(happiness + 5);
  updateUI();
});

// Quand on ferme la popup "il mange" 
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

function checkDeath() {
  if (hunger >= 100 || energy <= 0 || happiness <= 0) {
    const deathAlert = document.querySelector('.alert');
    deathAlert.style.display = 'block';
  

  
    btnFeed.disabled = true;
    btnPlay.disabled = true;
    btnSleep.disabled = true;
    pet.style.filter = 'grayscale(100%)';

    btnFeed.style.filter = 'grayscale(100%)';
    btnPlay.style.filter = 'grayscale(100%)';
    btnSleep.style.filter = 'grayscale(100%)';

    clearInterval(gameInterval);
    return true;
  }
  return false;
}


sectionActions.style.display = 'none';

open.addEventListener('click', () => {
eggCrack();
sectionActions.style.display ='block'; 
open.style.display = 'none';
clearInterval(eggAnimation);
egg.style.opacity = '0';
pet.style.opacity = '1';
pet.style.animation = "bounce 2s infinite";
 const TICK_MS = 3000; 
 setInterval(() => {

  hunger = clamp(hunger + 1);

 
  energy = clamp(energy - 1);

  
  happiness = clamp(happiness - 1);

  checkDeath();
  updateUI();
}, TICK_MS);
});

function getColorClass(value) {
  if (value > 50) return 'green';
  if (value > 20) return 'orange';
  return 'red';
}


function updateUI() {
  
  hungerBar.style.width = hunger + '%';

  hungerBar.className = `progress ${getColorClass(100 - hunger)}`; 
  

  energyBar.style.width = energy + '%';

  energyBar.className = `progress ${getColorClass(energy)}`;

  happinessBar.style.width = happiness + '%';

  happinessBar.className = `progress ${getColorClass(happiness)}`;

  


  if (hunger > 80 || energy < 20 || happiness < 20) {
    pet.style.filter = 'grayscale(60%)';
  } else {
    pet.style.filter = 'none';
  }

  
}



/* Déplacé dans la partie popup nourriture

btnFeed.addEventListener('click', () => {
  hunger = clamp(hunger - 15);
  happiness = clamp(happiness + 5);
  updateUI();
});

*/

btnPlay.addEventListener('click', () => {
  happiness = clamp(happiness + 12);
  energy = clamp(energy - 6);
  hunger = clamp(hunger + 4);
  updateUI();
});


btnSleep.addEventListener('click', () => {
  energy = clamp(energy + 15);
  happiness = clamp(happiness - 4);
  hunger = clamp(hunger + 6);
  updateUI();
});


updateUI();



// function saveGame() {
//   const gameState = {
//     hunger,
//     energy,
//     happiness,
//     timestamp: Date.now()
//   };
//   localStorage.setItem('tamagotchi', JSON.stringify(gameState));
//   console.log('Jeu sauvegardé !');
// }

// setInterval(saveGame, 10000); // sauvegarde toutes les 10s

// function resetGame() {
//   localStorage.removeItem('tamagotchi');
//   hunger = 50;
//   energy = 50;
//   happiness = 50;
//   updateStats();
//   updatePetState();
// }