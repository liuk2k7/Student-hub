// --- Aggiunta eventi ---
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

    dateInput.value = "";
    eventInput.value = "";
  } else {
    alert("Inserisci una data e una descrizione dell'evento.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // --- Cookie Bar ---
  const cookieBar = document.getElementById('cookie-bar');
  if (!localStorage.getItem('cookieConsent')) {
    cookieBar.style.display = 'flex';
    document.getElementById('accept-cookies').onclick = function () {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBar.style.display = 'none';
    };
    document.getElementById('reject-cookies').onclick = function () {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBar.style.display = 'none';
    };
  }

  // --- Pomodoro Timer ---
  const pomodoroModal = document.getElementById('pomodoro-modal');
  const openPomodoroBtn = document.getElementById('open-pomodoro');
  const closePomodoroBtn = document.getElementById('close-pomodoro');
  const startTimerBtn = document.getElementById('start-timer');
  const resetTimerBtn = document.getElementById('reset-timer');
  const timerDisplay = document.getElementById('timer-display');
  const progressBar = document.getElementById('pomodoro-progress-bar');
  const showPomodoroBtn = document.getElementById('show-pomodoro-modal');

  let timer;
  const pomodoroDuration = 25 * 60;
  let timeLeft = pomodoroDuration;
  let running = false;

  function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `${min}:${sec}`;
    if (progressBar) {
      const percent = 100 * (1 - timeLeft / pomodoroDuration);
      progressBar.style.width = percent + "%";
    }
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
    timeLeft = pomodoroDuration;
    running = false;
    updateDisplay();
  }

  if (openPomodoroBtn) openPomodoroBtn.onclick = () => { pomodoroModal.style.display = 'flex'; resetPomodoro(); };
  if (closePomodoroBtn) closePomodoroBtn.onclick = () => { pomodoroModal.style.display = 'none'; resetPomodoro(); };
  if (startTimerBtn) startTimerBtn.onclick = startPomodoro;
  if (resetTimerBtn) resetTimerBtn.onclick = resetPomodoro;
  if (showPomodoroBtn) showPomodoroBtn.onclick = () => { pomodoroModal.style.display = 'flex'; resetPomodoro(); };

  updateDisplay();

  // --- Obiettivi e Progressi ---
  const goalForm = document.getElementById('goal-form');
  const goalInput = document.getElementById('goal-input');
  const goalList = document.getElementById('goal-list');
  const goalProgressBar = document.getElementById('goal-progress-bar');
  const goalProgressText = document.getElementById('goal-progress-text');

  if (goalForm && goalInput && goalList && goalProgressBar && goalProgressText) {
    let goals = JSON.parse(localStorage.getItem('goals') || '[]');
    renderGoals();

    goalForm.onsubmit = function (e) {
      e.preventDefault();
      const text = goalInput.value.trim();
      if (text) {
        goals.push({ text, done: false });
        goalInput.value = '';
        saveAndRender();
      }
    };

    function renderGoals() {
      goalList.innerHTML = '';
      let doneCount = 0;
      goals.forEach((goal, idx) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';
        li.style.marginBottom = '6px';

        const left = document.createElement('span');
        left.textContent = goal.text;
        left.style.flex = '1';
        if (goal.done) left.style.textDecoration = 'line-through';

        const btns = document.createElement('div');
        btns.style.display = 'flex';
        btns.style.gap = '8px';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = goal.done ? '✓' : 'Completa';
        completeBtn.style.background = goal.done ? '#27B3A2' : '#eee';
        completeBtn.style.color = goal.done ? '#fff' : '#222';
        completeBtn.style.border = 'none';
        completeBtn.style.borderRadius = '5px';
        completeBtn.style.padding = '4px 10px';
        completeBtn.style.cursor = 'pointer';
        completeBtn.onclick = () => {
          goals[idx].done = !goals[idx].done;
          saveAndRender();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Elimina';
        deleteBtn.style.background = '#f2653e';
        deleteBtn.style.color = '#fff';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '5px';
        deleteBtn.style.padding = '4px 10px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.onclick = () => {
          goals.splice(idx, 1);
          saveAndRender();
        };

        btns.appendChild(completeBtn);
        btns.appendChild(deleteBtn);
        li.appendChild(left);
        li.appendChild(btns);
        goalList.appendChild(li);

        if (goal.done) doneCount++;
      });

      const percent = goals.length ? Math.round((doneCount / goals.length) * 100) : 0;
      goalProgressBar.style.width = percent + '%';
      goalProgressText.textContent = percent + '% completato';
    }

    function saveAndRender() {
      localStorage.setItem('goals', JSON.stringify(goals));
      renderGoals();
    }
  }
});

  


  
  
  
  
  
