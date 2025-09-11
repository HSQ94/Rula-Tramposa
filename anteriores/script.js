
let saldo = 5000;
let eleccion = null;
let giroCount = 0;

const saldoEl = document.getElementById("saldo");
const infoOutput = document.getElementById("info-output");
const resultadoEl = document.getElementById("resultado");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const ruleta = document.getElementById("roulette");
const audioGiro = document.getElementById("audio-giro");
const audioGanar = document.getElementById("audio-ganar");
const audioPerder = document.getElementById("audio-perder");

document.getElementById("verde").onclick = () => eleccion = "verde";
document.getElementById("rojo").onclick = () => eleccion = "rojo";

document.getElementById("jugar").onclick = () => {
  if (!eleccion) return alert("Elegí un color primero!");
  if (saldo < 500) return alert("No tenés suficiente saldo!");
  saldo -= 500;
  giroCount++;

  let resultadoReal;
  let mostrarMensaje = "";
  let isWin = false;

  if (giroCount === 4) {
    resultadoReal = eleccion;
    mostrarMensaje = "GANASTE!";
  } else if (Math.random() < 0.2) {
    resultadoReal = eleccion;
    isWin = true;
  } else {
    resultadoReal = eleccion === "verde" ? "rojo" : "verde";
  }

  infoOutput.textContent = "// Próximo tiro: " + (resultadoReal === "verde" ? "rojo" : "verde");

  // Giro visual
  const rot = Math.floor(Math.random() * 360 + 720);
  ruleta.style.transform = `rotate(${rot}deg)`;
  audioGiro.play();

  setTimeout(() => {
    resultadoEl.textContent = "Salió: " + resultadoReal.toUpperCase();

    if (giroCount === 4) {
      audioGanar.play();
      showModal(mostrarMensaje);
      setTimeout(() => {
        audioPerder.play();
        resultadoReal = eleccion === "verde" ? "rojo" : "verde";
        resultadoEl.textContent = "Salió: " + resultadoReal.toUpperCase();
        showModal("Perdón, nos equivocamos. PERDISTE");
      }, 2000);
    } else {
      if (isWin) {
        saldo += 1000;
        audioGanar.play();
        showModal("¡Ganaste!");
      } else {
        audioPerder.play();
        showModal("Perdiste...");
      }
    }

    saldoEl.textContent = "Saldo: $" + saldo;
  }, 2100);
};

function showModal(text) {
  modalText.textContent = text;
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("hidden"), 2500);
}
