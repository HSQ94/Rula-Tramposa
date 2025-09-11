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
const WINNING_SPINS = [2, 5, 8, 11, 12, 16, 21];
const pointer = document.getElementById("pointer");
const contenedorRuleta = document.getElementById("wrapperRuleta");
const roulette = document.getElementById('roulette');
const prediction = document.getElementById('prediction');
const saldoDisplay = document.getElementById('saldo');
const playBtn = document.getElementById('play-btn');
const modal = document.getElementById('result-modal');
const resultMsg = document.getElementById('result-message');
const closeModal = document.getElementById('close-modal');

const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

const introBox = document.getElementById('intro-box');
const triviaBox = document.getElementById('trivia-box');
const triviaResult = document.getElementById('trivia-result');
const triviaFeedback = document.getElementById('trivia-feedback');
const goToGameBtn = document.getElementById('go-to-game');
const rouletteControls = document.querySelector('.controls');
const playBtnEl = document.getElementById('play-btn');

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
    console.log("se muestr la info secreta");
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


playBtn.addEventListener('click', () => {
  if (!userChoice) {
    alert("Elegí un color primero.");
    return;
  }

  // 🔒 Disable the button during spin
  playBtn.disabled = true;
  playBtn.classList.add('disabled'); // Optional: for styling
  document.getElementById('choose-red').disabled = true;
  document.getElementById('choose-red').classList.add('disabled');
  document.getElementById('choose-green').disabled = true;
  document.getElementById('choose-green').classList.add('disabled');
  saldo -= 1000;
  saldoDisplay.textContent = `Saldo: $${saldo}`;
  const anglePerSection = 12; // 360° / 36
  let resultIndex = Math.floor(Math.random() * 36);
  outcome = getNextOutcome();

  const shouldWin = WINNING_SPINS.includes(tiro + 1);
  if (shouldWin) {
    // El jugador gana: manipular para que coincida con su elección
    if (userChoice === 'rojo') {
      while (resultIndex % 2 === 0) resultIndex = Math.floor(Math.random() * 36);
    } else {
      while (resultIndex % 2 !== 0) resultIndex = Math.floor(Math.random() * 36);
    }
  } else {
    // El jugador pierde: lógica original (opuesta a su elección)
    outcome = getNextOutcome();
    if (outcome === 'rojo') {
      while (resultIndex % 2 === 0) resultIndex = Math.floor(Math.random() * 36);
    } else {
      while (resultIndex % 2 !== 0) resultIndex = Math.floor(Math.random() * 36);
    }
  }



  const angle = 3600 + resultIndex * anglePerSection;
  currentAngle += angle;
  roulette.style.transform = `rotate(${currentAngle}deg)`;
  contenedorRuleta.classList.remove('zoom'); // reiniciar si ya estaba
  void roulette.offsetWidth; // forzar reflow para reiniciar animación
  contenedorRuleta.classList.add('zoom');
  spinSound.play();

  setTimeout(() => {
    if (tiro === 4) {
      resultMsg.textContent = "¡Ganaste!";
      winSound.play();
      document.body.classList.add('flash-win');
      setTimeout(() => document.body.classList.remove('flash-win'), 500);

      setTimeout(() => {
        resultMsg.textContent = "Perdón... nos equivocamos. Perdiste.";
        loseSound.play();
      }, 2000);
    } else {
      //determinar si realmente ganó
      const actualWin = shouldWin ? true : (outcome === userChoice);
      resultMsg.textContent = actualWin ? "¡Le pegaste, muy bien!" : "¡Uy más suerte la próxima!";
      if (actualWin) {
        saldo += 1500;
        winSound.play();
        document.body.classList.add('flash-win');
        setTimeout(() => document.body.classList.remove('flash-win'), 500);
      } else {
        loseSound.play();
      }
      saldoDisplay.textContent = `Saldo: $${saldo}`;
    }

    modal.classList.remove('hidden');
    outcome = getNextOutcome();
    tiro++;
    // ✅ Re-enable the button after spin completes
    playBtn.disabled = false;
    playBtn.classList.remove('disabled'); // Optional: for styling
    document.getElementById('choose-red').disabled = false;
    document.getElementById('choose-red').classList.remove('disabled');
    document.getElementById('choose-green').disabled = false;
    document.getElementById('choose-green').classList.remove('disabled');
  }, 3200);

});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// roulette.style.display = "none";
// document.querySelector(".pointer").style.display = "none";
rouletteControls.style.display = "none";
playBtnEl.style.display = "none";
document.getElementById('info-secreta').style.display = "none";

// Paso 1: Al presionar "Responder"
document.getElementById('start-trivia').addEventListener('click', () => {
  triviaOn = true;
  introBox.classList.add('hidden');
  triviaBox.classList.remove('hidden');
});

// Paso 2: Elegir una respuesta
document.querySelectorAll('.trivia-option').forEach(button => {
  button.addEventListener('click', () => {
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
      triviaFeedback.textContent = "Incorrecto... pero tranqui igual te damos $5000 😉";
      saldo += 5000;
    }

    saldoDisplay.textContent = `Saldo: $${saldo}`;
  }});
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

