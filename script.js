function addEvent() {
    const dateInput = document.getElementById("dateInput");
    const eventInput = document.getElementById("eventInput");
    const eventList = document.getElementById("eventList");
  
    const date = dateInput.value;
    const eventText = eventInput.value.trim();
  
    if (date && eventText) {
      const listItem = document.createElement("li");
      listItem.textContent = `${date} - ${eventText}`;
      eventList.appendChild(listItem);
  
      // Pulisci i campi
      dateInput.value = "";
      eventInput.value = "";
    } else {
      alert("Inserisci una data e una descrizione dell'evento.");
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    const cookieBar = document.getElementById('cookie-bar');
    if (!localStorage.getItem('cookieConsent')) {
      cookieBar.style.display = 'flex';
    document.getElementById('accept-cookies').onclick = function() {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBar.style.display = 'none';
    };
    document.getElementById('reject-cookies').onclick = function() {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBar.style.display = 'none';
    };
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Pomodoro Modal
  const pomodoroModal = document.getElementById('pomodoro-modal');
  const openPomodoroBtn = document.getElementById('open-pomodoro');
  const closePomodoroBtn = document.getElementById('close-pomodoro');
  const startTimerBtn = document.getElementById('start-timer');
  const resetTimerBtn = document.getElementById('reset-timer');
  const timerDisplay = document.getElementById('timer-display');

  let timer;
  let timeLeft = 25 * 60;
  let running = false;

  function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `${min}:${sec}`;
  }

  function startPomodoro() {
    if (running) return;
    running = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        running = false;
        alert("Tempo scaduto! Fai una pausa.");
      }
    }, 1000);
  }

  function resetPomodoro() {
    clearInterval(timer);
    timeLeft = 25 * 60;
    running = false;
    updateDisplay();
  }

  if (openPomodoroBtn && pomodoroModal) {
    openPomodoroBtn.onclick = function() {
      pomodoroModal.style.display = 'flex';
      resetPomodoro();
    };
  }
  if (closePomodoroBtn && pomodoroModal) {
    closePomodoroBtn.onclick = function() {
      pomodoroModal.style.display = 'none';
      resetPomodoro();
    };
  }
  if (startTimerBtn) startTimerBtn.onclick = startPomodoro;
  if (resetTimerBtn) resetTimerBtn.onclick = resetPomodoro;

  updateDisplay();
});


  
  
  
  
  
