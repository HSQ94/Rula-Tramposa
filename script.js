//Variables del juego

let userChoice = null;
let saldo = 0;
let tiro = 0;
let currentAngle = 0;
let outcome = null;
let triviaOn = false;
//barra
const progress = document.querySelector(".progress");

window.addEventListener("load", () => {
  let progress = 0;
  const progressContainer = document.querySelector(".progress");

  const interval = setInterval(() => {
    progress += 1;
    progressContainer.style.setProperty("--progress", progress + "%");

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        document.getElementById("loader-overlay").style.opacity = "0";
        document.getElementById("loader-overlay").style.display = "none";
        document.getElementById("age-check").style.display = "flex";
      }, 500);
    }
  }, 30); // velocidad de llenado
});

//Verificación de edad
function handleAge(isAdult) {
  document.getElementById("age-check").style.display = "none";
  document.getElementById("age-message").style.display = "flex";

  const message = isAdult
    ? "¡Perfecto campeón, podés pasar a ganar!"
    : "No te preocupes campeón, te guardamos el secreto 😉";

  document.getElementById("age-response-text").textContent = message;
}
function proceed() {
  console.log("Botón apretado")
  document.getElementById("age-check").style.display = "none";
  document.getElementById("age-message").style.display = "none";

  document.getElementById("main-content").style.display = "block";
}

//UI
const WINNING_SPINS = [2, 5, 8, 11, 12, 16, 21];
const pointer = document.getElementById("pointer");
const contenedorRuleta = document.getElementById("wrapperRuleta");
const roulette = document.getElementById('roulette');
const prediction = document.getElementById('prediction');
const saldoDisplay = document.getElementById('saldo');
const playBtn = document.getElementById('play-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('result-modal');
const colorModal = document.getElementById('color-modal');
const colorModalContent = document.getElementsByClassName('colormodal-content')[0];
const colorMessage = document.getElementById('color-message');
const resultMsg = document.getElementById('result-message');
const closeModal = document.getElementById('close-modal');

//Sonidos
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const clickSound = document.getElementById('click-sound').cloneNode();

const introBox = document.getElementById('intro-box');
const triviaBox = document.getElementById('trivia-box');
const triviaResult = document.getElementById('trivia-result');
const triviaFeedback = document.getElementById('trivia-feedback');
const goToGameBtn = document.getElementById('go-to-game');
const rouletteControls = document.querySelector('.controls');
const playBtnEl = document.getElementById('play-btn');

//Mensajes aleatorios después de cada tirada
const winMessages = [
  "¡Le pegaste, muy bien!",
  "¡Excelente tiro, estás cada vez mejor!",
  "¡Muy buena, ya estás listo para el gran reto",
  "¡Eso fue épico!",
  "¡Ganaste como un campeón!"
];

const loseMessages = [
  "¡Muy cerca! Vamos a intentarlo nuevamente.",
  "Cerca, pero la próxima seguro es tuya!",
  "Casi casi, dale otro intento",
  "No pudo ser ¡Pero ya va a salir!",
  "Ay, por muy poco ¡La próxima tiene que ser!"
];

function getRandomMessage(messagesArray) {
  const index = Math.floor(Math.random() * messagesArray.length);
  return messagesArray[index];
}

//Elección del color
document.getElementById('choose-red').addEventListener('click', () => {
  userChoice = 'rojo';
  updatePrediction();
});

document.getElementById('choose-green').addEventListener('click', () => {
  userChoice = 'verde';
  updatePrediction();
});

function updatePrediction() {
  const nextOutcome = getNextOutcome();
  setPredictionText(`Próximo tiro: ${nextOutcome}`);
}



function getNextOutcome() {
  console.log("es el tiro número: " + tiro.toString());
  if (tiro === 3) {
    console.log("se muestra la info secreta");
    document.getElementById('info-secreta').classList.add('visible');
  }
  const nextSpinWillWin = WINNING_SPINS.includes(tiro + 1);

  if (nextSpinWillWin) {
    return userChoice;
  } else {
    return userChoice === 'rojo' ? 'verde' : 'rojo';
  }
  return userChoice === 'rojo' ? 'verde' : 'rojo';
}

function isFibonacci(n) {
  let a = 0, b = 1;
  while (b < n) {
    [a, b] = [b, a + b];
  }
  return b === n;
}

function setPredictionText(text) {
  const prediction = document.getElementById('prediction');
  prediction.querySelectorAll('.glitch-layer').forEach(span => {
    span.textContent = text;
  });
}

//Función botón JUGAR
playBtn.addEventListener('click', () => {
  clickSound.play();
  if (!userChoice) return alert("Elegí un color primero.");

  disableControls();
  saldo -= 1000;
  updateSaldo();

  const anglePerSection = 12;
  let resultIndex = getManipulatedResultIndex();
  const angle = 3600 + resultIndex * anglePerSection;
  currentAngle += angle;

  roulette.style.transform = `rotate(${currentAngle}deg)`;
  contenedorRuleta.classList.remove('zoom');
  void roulette.offsetWidth;
  contenedorRuleta.classList.add('zoom');
  spinSound.play();

  setTimeout(() => {
    const actualWin = tiro === 4
      ? true
      : WINNING_SPINS.includes(tiro + 1) || outcome === userChoice;

    showResult(actualWin);
    showColorModal(outcome);
    tiro++;
    outcome = getNextOutcome();
    enableControls();
  }, 3200);
});

function disableControls() {
  playBtn.disabled = true;
  playBtn.classList.add('disabled');
  ['choose-red', 'choose-green'].forEach(id => {
    const el = document.getElementById(id);
    el.disabled = true;
    el.classList.add('disabled');
  });
}

function enableControls() {
  playBtn.disabled = false;
  playBtn.classList.remove('disabled');
  ['choose-red', 'choose-green'].forEach(id => {
    const el = document.getElementById(id);
    el.disabled = false;
    el.classList.remove('disabled');
  });
}

function updateSaldo() {
  saldoDisplay.textContent = `Saldo: $${saldo}`;
}

function getManipulatedResultIndex() {
  let index = Math.floor(Math.random() * 36);
  outcome = getNextOutcome();
  const shouldWin = WINNING_SPINS.includes(tiro + 1);
  const isRed = userChoice === 'rojo';

  const matchParity = shouldWin ? isRed : !isRed;

  while ((index % 2 === 0) !== matchParity) {
    index = Math.floor(Math.random() * 36);
  }

  return index;
}

function showResult(win) {
  if (tiro === 4) {
    resultMsg.textContent = "¡Ganaste!";
    winSound.play();
    document.body.classList.add('flash-win');
    setTimeout(() => document.body.classList.remove('flash-win'), 500);
    setTimeout(() => {
      if (getComputedStyle(colorModalContent).getPropertyValue('--colorFondo') !== "#e74c3c") {
        colorModalContent.style.setProperty("--colorFondo", "#e74c3c");
        colorMessage.textContent = `ROJO`;


      } else {
        colorModalContent.style.setProperty("--colorFondo", "#27ae60");
        colorMessage.textContent = `VERDE`;


      }


      resultMsg.textContent = "Perdón... nos equivocamos. Perdiste.";
      loseSound.play();
    }, 2000);
  } else {
    resultMsg.textContent = win
      ? getRandomMessage(winMessages)
      : getRandomMessage(loseMessages);

    if (win) {
      saldo += 1500;
      winSound.play();
      document.body.classList.add('flash-win');
      setTimeout(() => document.body.classList.remove('flash-win'), 500);
    } else {
      loseSound.play();
    }
    updateSaldo();
  }

  modal.classList.remove('hidden');
}

function showColorModal(color) {
  console.log("resultado recibido", color);
  modalOverlay.classList.remove('hidden');
  colorModal.classList.remove('hidden');
  const fondo = color === 'rojo' ? '#e74c3c' : '#27ae60'; // rojo o verde
  console.log("color de fondo asignado:", fondo);
  colorModalContent.style.setProperty("--colorFondo", fondo);
  colorMessage.textContent = `${color.toUpperCase()}`;
}



closeModal.addEventListener('click', () => {
  clickSound.play();

  modalOverlay.classList.add("hidden");
  modal.classList.add('hidden');
  colorModal.classList.add('hidden');
});

// roulette.style.display = "none";
// document.querySelector(".pointer").style.display = "none";
rouletteControls.style.display = "none";
playBtnEl.style.display = "none";
document.getElementById('info-secreta').style.display = "none";

// Paso 1: Al presionar "Responder"
document.getElementById('start-trivia').addEventListener('click', () => {
  clickSound.play();

  triviaOn = true;
  introBox.classList.add('hidden');
  triviaBox.classList.remove('hidden');
});

// Paso 2: Elegir una respuesta
document.querySelectorAll('.trivia-option').forEach(button => {
  button.addEventListener('click', () => {
    clickSound.play();

    if (triviaOn) {
      const answer = button.textContent.trim();
      triviaBox.classList.add('hidden');
      triviaResult.classList.remove('hidden');

      if (answer === 'Gonzalo Montiel') {
        triviaFeedback.innerHTML = `
  <strong>¡Felicitaciones!</strong> Acertaste la respuesta y te llevaste 
  <span class="saldo-positivo">$5000 de saldo</span> para apostar. 
  <br><br>
  Ahora <span class="instruccion">elegí el color</span> en el que creés que va a detenerse el piquito de la ruleta.
  <br><br>
  <span class="detalle">Cada tiro vale <strong>$1000</strong>.</span> 
  Si acertás, <strong>duplicás tu saldo</strong> al instante.
  <br><br>
  <em>¡Dale al giro y que decida el destino!</em>
`;
        saldo += 5000;
      } else {
        loseSound.play();
        triviaFeedback.textContent = "Incorrecto... pero tranqui igual te damos $5000 😉";
        saldo += 5000;
      }

      saldoDisplay.textContent = `Saldo: $${saldo}`;
    }
  });
});

// Paso 3: Al presionar "Ir a jugar"
goToGameBtn.addEventListener('click', () => {
  triviaResult.classList.add('hidden');
  roulette.style.display = "block";
  document.querySelector("#pointer").style.display = "block";
  rouletteControls.style.display = "block";
  playBtnEl.style.display = "inline-block";
  document.getElementById('info-secreta').style.display = "block";
});

document.getElementById('choose-red').addEventListener('click', () => {
  userChoice = 'rojo';
  updatePrediction();
  document.getElementById('choose-red').classList.add('selected');
  document.getElementById('choose-green').classList.remove('selected');
});

document.getElementById('choose-green').addEventListener('click', () => {
  userChoice = 'verde';
  updatePrediction();
  document.getElementById('choose-green').classList.add('selected');
  document.getElementById('choose-red').classList.remove('selected');
});

introBox.classList.remove('hidden');      // Se muestra
triviaBox.classList.add('hidden');        // Oculto
triviaResult.classList.add('hidden');     // Oculto
rouletteControls.style.display = "none";  // Oculto
playBtnEl.style.display = "none";         // Oculto
document.getElementById('info-secreta').style.display = "none"; // Oculto

document.querySelector('#info-secreta .collapsible-header').addEventListener('click', () => {
  document.getElementById('info-secreta').classList.toggle('expanded');
});

