// drag and drop 
const eggDisplay = document.getElementById('egg-display');
let startX = 0;
let isDragging = false;


function onMouseDown(e) {
  startX = e.clientX;
  isDragging = true;
}
function onTouchStart(e) {
  startX = e.touches[0].clientX;
  isDragging = true;
}
function onMouseUp(e) {
  if(!isDragging) return;
  const diff = e.clientX - startX;
  if(diff > 30) prevBtn.click();
  else if(diff < -30) nextBtn.click();
  isDragging = false;
}
function onTouchEnd(e) {
  if(!isDragging) return;
  const diff = e.changedTouches[0].clientX - startX;
  if(diff > 30) prevBtn.click();
  else if(diff < -30) nextBtn.click();
  isDragging = false;
}
function onMouseLeave() { isDragging = false; }


eggDisplay.addEventListener('mousedown', onMouseDown);
eggDisplay.addEventListener('touchstart', onTouchStart);
eggDisplay.addEventListener('mouseup', onMouseUp);
eggDisplay.addEventListener('touchend', onTouchEnd);
eggDisplay.addEventListener('mouseleave', onMouseLeave);


// Chargement de la partie
function loadGame() {
  const saved = localStorage.getItem("tamagotchi");
  if (saved) {
    const gameState = JSON.parse(saved);
    hunger = gameState.hunger;
    energy = gameState.energy;
    happiness = gameState.happiness;
    eggOpened = gameState.eggOpened || false;
    currentChoice = gameState.currentChoice || 0;
    updatePetDisplay();
   

    if (eggOpened) {
      
      sectionActions.style.display ='block'; 
      startButton.innerHTML = "Continuer ton aventure";
      open.style.display = 'none';
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      egg.style.opacity = '0';
      pet.style.opacity = '1';
      pet.style.animation = "bounce 2s infinite";

  eggDisplay.removeEventListener('mousedown', onMouseDown);
  eggDisplay.removeEventListener('touchstart', onTouchStart);
  eggDisplay.removeEventListener('mouseup', onMouseUp);
  eggDisplay.removeEventListener('touchend', onTouchEnd);
  eggDisplay.removeEventListener('mouseleave', onMouseLeave);

     
      const TICK_MS = 3000;
      clearInterval(gameInterval);
      gameInterval = setInterval(() => {
        hunger = clamp(hunger + 1);
        energy = clamp(energy - 1);
        happiness = clamp(happiness - 1);

        checkDeath();
        updateUI();
      }, TICK_MS);
    }

    updateUI();
    console.log(" Partie chargée !");
  } else {
    console.log("Nouvelle partie !");
    eggAnimation();

    
  }
}


window.addEventListener("load", () => {
  loadGame();
});


function start() {
  const startSound = document.getElementById('sound-start');
  startSound.play();
}
function eggCrack() {
  const eggSound = document.getElementById('sound-egg');
  eggSound.play();
}

let hunger = 2;      
let energy = 70;      
let happiness = 100;  
let toggle = true;
let gameInterval; 
let eggOpened = false;



const modal = document.getElementById('start-modal');
const startButton = document.getElementById('btn-start');
const hungerBar = document.querySelector('#hunger-bar .progress');
const energyBar = document.querySelector('#energy-bar .progress');
const happinessBar = document.querySelector('#happiness-bar .progress');
const sectionActions = document.getElementById('actions');
const open = document.getElementById('btn-open');
const btnReset = document.getElementById('btn-reset');
const prevBtn = document.getElementById("prev-egg");
const nextBtn = document.getElementById("next-egg");

const btnFeed  = document.getElementById('btn-feed');
const btnPlay  = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');
const egg = document.getElementById('egg');
const pet = document.getElementById('pet');
const btnSound = document.getElementById('sound-btn');
const soundOver = document.getElementById('sound-over');
const allButtons = document.querySelectorAll("button");
const soundFeed = document.getElementById("sound-feed");
const btnSave = document.getElementById("btn-save");

const popup = document.getElementById("popup-feed");
const closePopup = document.getElementById ("close-popup");
const popupFoodsList = document.getElementById("popup-foodsList");
const btnApple = document.getElementById("choose-apple");

// ---------------------- Popups Nourriture -----------------------


// Quand on clique sur "Nourrir" → ouvre le menu des nourritures
btnFeed.addEventListener("click", () => {
  popupFoodsList.style.display = "flex";
});

// Quand on choisit la pomme → ferme le menu, ouvre popup "il mange"
btnApple.addEventListener("click", () => {
  popupFoodsList.style.display = "none";
  popup.style.display = "flex";

  // Son de nourrissage
  soundFeed.currentTime = 0;
  soundFeed.play();

  // Effets sur les stats
  hunger = clamp(hunger - 15);
  happiness = clamp(happiness + 5);
  updateUI();
});

// Quand on ferme la popup "il mange"
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});


const clamp = (n) => Math.max(0, Math.min(100, n));



const miniGame = document.getElementById("mini-game");
const closeGame = document.getElementById("close-game");
const miniPet = document.getElementById("mini-pet");
const scoreDisplay = document.getElementById("score");

let score = 0;

btnPlay.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = "Score : 0";
  miniGame.style.display = "flex";
  miniPet.src = choices[currentChoice].pet;

  gameInterval = setInterval(() => {
    const x = Math.random() * 300; 
    const y = Math.random() * 140; 
    miniPet.style.left = x + "px";
    miniPet.style.top = y + "px";
  }, 800);
});

miniPet.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = "Score : " + score;
});

closeGame.addEventListener("click", () => {
  miniGame.style.display = "none";
  clearInterval(gameInterval);


  happiness = clamp(happiness + score);
  energy = clamp(energy - score / 2);
  hunger = clamp(hunger + score / 3);
  updateUI();
});



const choices = [{egg: "assets/egg1.png", pet: "assets/pet1.png"}, 
                  {egg: "assets/egg2.png", pet: "assets/pet2.png"},
                  {egg: "assets/egg3.png", pet: "assets/pet3.png"},
                  {egg: "assets/egg4.png", pet: "assets/pet4.png"},
                  {egg: "assets/egg5.png", pet: "assets/pet5.png"}];
let currentChoice = 0;

function updatePetDisplay() {
  const egg = document.getElementById("egg");
  const pet = document.getElementById("pet");
  egg.src = choices[currentChoice].egg;
  pet.src = choices[currentChoice].pet;
}
prevBtn.addEventListener("click", () => {
  currentChoice = (currentChoice - 1 + choices.length) % choices.length;
  updatePetDisplay();
});
nextBtn.addEventListener("click", () => {
  currentChoice = (currentChoice + 1) % choices.length;
  updatePetDisplay();
});
updatePetDisplay();


startButton.addEventListener('click', () => {
  modal.style.display = 'none';
  start();
 
});

pet.addEventListener("click", () => {
  console.log("Coucou !");
  if (!eggOpened) return;
  pet.src = "assets/pet" + (currentChoice + 1) + "-2.png";
  energy = clamp(energy - 5);
  happiness = clamp(happiness + 3);
  updateUI();
  
  setTimeout(() => {
    pet.src = choices[currentChoice].pet;
  }, 1000);
})

function playBtnSound() {
  btnSound.currentTime = 0; // Repart du début
  btnSound.play();
}

allButtons.forEach(btn => {
  btn.addEventListener("click", playBtnSound);
});

function eggAnimation() {
  setInterval(() => {
    if (toggle) {
      egg.style.animation = "bounce 2s infinite";
    } else {
      egg.style.animation = "shake 0.5s infinite alternate";
    }
  }, 1500);
  toggle = !toggle;
}
let eggAnimInterval = setInterval(eggAnimation, 1500);
eggAnimation();


btnSave.addEventListener("click", () => {
  saveGame();
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

function resetGame() {
  localStorage.removeItem("tamagotchi");
  hunger = 2;
  energy = 70;
  happiness = 100;
  updateUI();
  console.log("🗑️ Sauvegarde effacée !");
   
   eggDisplay.addEventListener('mousedown', onMouseDown);
  eggDisplay.addEventListener('touchstart', onTouchStart);
  eggDisplay.addEventListener('mouseup', onMouseUp);
  eggDisplay.addEventListener('touchend', onTouchEnd);
  eggDisplay.addEventListener('mouseleave', onMouseLeave);

}


btnReset.addEventListener("click", () => {

    resetGame();

  hunger = 2;
  energy = 70;
  happiness = 100;
  eggOpened = false;
  saveGame();


  btnFeed.disabled = false;
  btnPlay.disabled = false;
  btnSleep.disabled = false;

  btnFeed.style.filter = "none";
  btnPlay.style.filter = "none";
  btnSleep.style.filter = "none";
  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";

  document.querySelector(".alert").style.display = "none";
  btnReset.style.display = "none";
  pet.style.filter = "none";

  egg.style.opacity = "1";
  pet.style.opacity = "0";
open.style.display = "inline-block";

  sectionActions.style.display = "none";


  clearInterval(gameInterval);
  gameInterval = null;
  updateUI();
});


function checkDeath() {
  if (hunger >= 100 || energy <= 0 || happiness <= 0) {
    const deathAlert = document.querySelector('.alert');
    deathAlert.style.display = 'flex';
    soundOver.play();
    btnFeed.disabled = true;
    btnPlay.disabled = true;
    btnSleep.disabled = true;
    pet.style.filter = 'grayscale(100%)';

    btnFeed.style.filter = 'grayscale(100%)';
    btnPlay.style.filter = 'grayscale(100%)';
    btnSleep.style.filter = 'grayscale(100%)';

    btnReset.style.display = 'block';

    clearInterval(gameInterval);
    return true;
  }
  return false;
}


sectionActions.style.display = 'none';

open.addEventListener('click', () => {
eggCrack();
eggOpened = true;
prevBtn.style.display = "none";
nextBtn.style.display = "none";
sectionActions.style.display ='block'; 
open.style.display = 'none';
clearInterval(eggAnimation);
egg.style.opacity = '0';
pet.style.opacity = '1';
pet.style.animation = "bounce 2s infinite";


  eggDisplay.removeEventListener('mousedown', onMouseDown);
  eggDisplay.removeEventListener('touchstart', onTouchStart);
  eggDisplay.removeEventListener('mouseup', onMouseUp);
  eggDisplay.removeEventListener('touchend', onTouchEnd);
  eggDisplay.removeEventListener('mouseleave', onMouseLeave);


 const TICK_MS = 3000; 

  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
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



/*
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


function saveGame() {
  const gameState = {
    hunger,
    energy,
    happiness,
    eggOpened,
    currentChoice, 

    timestamp: Date.now()
  };
  localStorage.setItem('tamagotchi', JSON.stringify(gameState));
  console.log('Jeu sauvegardé !');
}

setInterval(saveGame, 20000);