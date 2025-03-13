/**************************************************************
 * LÓGICA DE LA CUENTA ATRÁS
 **************************************************************/
let totalMs;        // tiempo total en milisegundos
let interval = null;
let isRunning = false;  // indica si el cronómetro está corriendo
let isPaused = false;   // indica si el cronómetro está en pausa
let isForwardMode = false; // indica si el cronómetro está en modo hacia adelante

// Elementos HTML
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const msEl = document.getElementById('milliseconds');

const startBtn = document.getElementById('start-btn');
const clearBtn = document.getElementById('clear-btn');
const reprogramInput = document.getElementById('reprogram-mins');
const forwardModeCheckbox = document.getElementById('forward-mode');

// Iniciamos en 8 minutos = 8 * 60 * 1000 ms = 480000 ms
let defaultMinutes = 8;
resetTimer(defaultMinutes);

/**************************************************************
 * FUNCIONES
 **************************************************************/

// Actualiza el display con el tiempo en formato hh:mm:ss:ms
function updateDisplay() {
  if (totalMs < 0) totalMs = 0;
  let temp = totalMs;
  const hrs = Math.floor(temp / 3600000);
  temp = temp % 3600000;
  const mins = Math.floor(temp / 60000);
  temp = temp % 60000;
  const secs = Math.floor(temp / 1000);
  const ms = temp % 1000;
  hoursEl.textContent = String(hrs).padStart(2, '0');
  minutesEl.textContent = String(mins).padStart(2, '0');
  secondsEl.textContent = String(secs).padStart(2, '0');
  msEl.textContent = String(ms).padStart(3, '0');
}

// Reinicia el tiempo a los minutos por defecto
function resetTimer(minutes) {
  totalMs = minutes * 60 * 1000;
  updateDisplay();
  // Restaura el fondo normal
  document.body.style.backgroundImage = "";
}

// Reproduce un tono sencillo con la Web Audio API
function playAlertSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
  oscillator.stop(audioCtx.currentTime + 1);
}

// Establece el fondo animado mientras corre
function setAnimatedBackground() {
  document.body.style.backgroundImage = "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmpxYXZhMDZ1aTY5aGFpbHh6ZW5xczRoM3dndjBtaW50dWxtdWc0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2jmma5yWrWUF6uaBkw/giphy.gif')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundAttachment = "fixed";
}

// Inicia o reanuda el conteo regresivo (cada 10 ms)
function startCountdown() {
  // Si ya está corriendo, no iniciamos de nuevo
  if (isRunning) return;
  
  // Quita el símbolo de pausa
  isPaused = false;
  startBtn.textContent = "Start";
  
  // Activa el fondo animado mientras corre
  setAnimatedBackground();
  
  isRunning = true;
  interval = setInterval(() => {
    totalMs -= 10;
    updateDisplay();
    if (totalMs <= 0) {
      clearInterval(interval);
      isRunning = false;
      playAlertSound();
      alert('¡El tiempo se ha agotado!');
      startBtn.textContent = "Start";
      document.body.style.backgroundImage = "";
    }
  }, 10);
}

// Inicia o reanuda el conteo hacia adelante (cada 10 ms)
function startStopwatch() {
  // Si ya está corriendo, no iniciamos de nuevo
  if (isRunning) return;
  
  // Reiniciar a cero en modo cronómetro si no está pausado
  if (!isPaused) {
    totalMs = 0;
  }
  
  // Quita el símbolo de pausa
  isPaused = false;
  startBtn.textContent = "Start";
  
  // Activa el fondo animado mientras corre
  setAnimatedBackground();
  
  isRunning = true;
  const targetMs = defaultMinutes * 60 * 1000; // Tiempo objetivo fijo
  interval = setInterval(() => {
    totalMs += 10;
    updateDisplay();
    if (totalMs >= targetMs) {
      clearInterval(interval);
      isRunning = false;
      playAlertSound();
      alert('¡El tiempo se ha agotado!');
      startBtn.textContent = "Start";
      document.body.style.backgroundImage = "";
    }
  }, 10);
}

// Pausa el conteo actual
function pauseCountdown() {
  if (!isRunning) return;
  clearInterval(interval);
  isRunning = false;
  isPaused = true;
  // Agrega el símbolo de pausa al botón Start
  startBtn.textContent = "Start ⏸";
  // Al pausar, se quita el fondo animado
  document.body.style.backgroundImage = "";
}

// Reinicia el conteo y vuelve al tiempo predefinido
function clearCountdown() {
  clearInterval(interval);
  isRunning = false;
  isPaused = false;
  
  // Reinicia según el modo actual
  if (forwardModeCheckbox.checked) {
    totalMs = 0; // En modo cronómetro, reinicia a cero
  } else {
    resetTimer(defaultMinutes); // En modo cuenta regresiva, usa el tiempo predefinido
  }
  
  startBtn.textContent = "Start";
}

// Actualiza el indicador de modo en la interfaz
function updateModeIndicator() {
  const currentModeEl = document.getElementById('current-mode');
  if (currentModeEl) {
    currentModeEl.textContent = forwardModeCheckbox.checked ? 'Cronómetro' : 'Cuenta Regresiva';
  }
}

/**************************************************************
 * EVENTOS
 **************************************************************/
// Al pulsar Start: si está corriendo, se pausa; si está pausado o detenido, se inicia/reanuda.
startBtn.addEventListener('click', () => {
  isForwardMode = forwardModeCheckbox.checked;
  if (isRunning) {
    pauseCountdown();
  } else {
    if (isForwardMode) {
      startStopwatch();
    } else {
      startCountdown();
    }
  }
});

// El botón Clear reinicia el conteo siempre, incluso si está en pausa.
clearBtn.addEventListener('click', () => {
  clearCountdown();
});

// Permite reprogramar el tiempo (solo cuando no está corriendo)
reprogramInput.addEventListener('change', () => {
  if (isRunning) {
    alert('No se puede reprogramar mientras el conteo está en marcha.');
    reprogramInput.value = '';
  } else {
    const newVal = parseInt(reprogramInput.value);
    if (!isNaN(newVal) && newVal > 0) {
      defaultMinutes = newVal;
      resetTimer(defaultMinutes);
    }
  }
});

// Maneja el cambio entre modos de cronómetro y cuenta regresiva
forwardModeCheckbox.addEventListener('change', () => {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
  }
  
  if (forwardModeCheckbox.checked) {
    totalMs = 0; // Iniciar en cero para cronómetro
    isForwardMode = true;
  } else {
    totalMs = defaultMinutes * 60 * 1000; // Valor inicial para cuenta regresiva
    isForwardMode = false;
  }
  
  updateDisplay();
  updateModeIndicator();
});

// Inicializar el indicador de modo
updateModeIndicator();
