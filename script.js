
// --- Aggiunta eventi da inputs non FullCalendar ---
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

document.addEventListener("DOMContentLoaded", function() {
  const cookieBar = document.getElementById('cookie-bar');
  if (cookieBar && !localStorage.getItem('cookieConsent')) {
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
  // --- Pomodoro ---
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

  // --- Obiettivi ---
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

 // --- Calendario FullCalendar avanzato ---
const calendarEl = document.getElementById('calendar');
const categoryColors = {
  "Lavoro": "#e74c3c",  // rosso
  "Studio": "#3498db",  // blu
  "Altro": "#2ecc71"    // verde
};

const categoryIcons = {
  "Lavoro": "💼",
  "Studio": "📚",
  "Altro": "⭐"
};
function mapEvents(events) {
  return events.map(ev => ({
    id: ev.id,
    title: ev.title,
    start: ev.start,
    end: ev.end || null,
    allDay: ev.allDay,
    backgroundColor: categoryColors[ev.category] || '#3788d8',
    borderColor: categoryColors[ev.category] || '#3788d8',
    extendedProps: {
      category: ev.category || "Altro"
    }
  }));
}


  // Carica eventi salvati o array vuoto
  const savedEvents = JSON.parse(localStorage.getItem('fcEvents') || '[]');

  
  

  let filteredEvents = mapEvents(savedEvents);

  // Inizializza calendario
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'it',
    selectable: true,
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    events: filteredEvents,
    eventContent: function(arg) {
      // Badge icona categoria + titolo evento
      const cat = arg.event.extendedProps.category || "Altro";
      const icon = categoryIcons[cat] || "";
      return { html: `<span>${icon} ${arg.event.title}</span>` };
    },
    dateClick: function(info) {
      const title = prompt("Inserisci il titolo dell'evento:");
      if (!title) return;

      let category = prompt("Categoria evento? (Lavoro, Studio, Altro)", "Altro");
      if (!category || !categoryColors[category]) category = "Altro";

      let isAllDay = confirm("Evento per tutto il giorno? (OK = sì, Annulla = no)");

      let startStr = info.dateStr;
      let endStr = null;

      if (!isAllDay) {
        const startTime = prompt("Inserisci orario inizio (HH:mm), esempio 14:30:", "09:00");
        const endTime = prompt("Inserisci orario fine (HH:mm), esempio 16:00:", "10:00");

        if (startTime && endTime) {
          startStr = info.dateStr + "T" + startTime;
          endStr = info.dateStr + "T" + endTime;
        } else {
          isAllDay = true;
        }
      }

      const id = String(Date.now());

      const newEvent = {
        id: id,
        title: title,
        start: startStr,
        end: endStr,
        allDay: isAllDay,
        category: category
      };

      calendar.addEvent({
        id: id,
        title: title,
        start: startStr,
        end: endStr,
        allDay: isAllDay,
        backgroundColor: categoryColors[category],
        borderColor: categoryColors[category],
        extendedProps: { category: category }
      });

      saveEvents();
      applyFilters(); // Aggiorna lista filtrata anche dopo aggiunta
    },
    eventClick: function(info) {
      if (confirm("Vuoi eliminare questo evento?")) {
        info.event.remove();
        saveEvents();
        applyFilters();
      }
    },
    eventChange: function() {
      saveEvents();
    },
    eventDidMount: function(info) {
      // Tooltip con tippy.js
      tippy(info.el, {
        content: `
          <strong>${info.event.title}</strong><br>
          Categoria: ${info.event.extendedProps.category || 'N/A'}<br>
          Inizio: ${info.event.start.toLocaleString()}<br>
          ${info.event.end ? `Fine: ${info.event.end.toLocaleString()}` : ''}
        `,
        allowHTML: true,
        animation: 'scale',
        theme: 'light',
      });
    }
  });

  function saveEvents() {
    const events = calendar.getEvents().map(e => ({
      id: e.id,
      title: e.title,
      start: e.start.toISOString(),
      end: e.end ? e.end.toISOString() : null,
      allDay: e.allDay,
      category: e.extendedProps.category || "Altro"
    }));
    localStorage.setItem('fcEvents', JSON.stringify(events));
  }

  // --- FILTRI PER CATEGORIA ---
  const filtersContainer = document.createElement('div');
  filtersContainer.id = 'filters';
  filtersContainer.style.margin = '10px 0';

  // Crea checkbox per ciascuna categoria
  Object.keys(categoryColors).forEach(cat => {
    const label = document.createElement('label');
    label.style.marginRight = '15px';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = cat;
    checkbox.checked = true;
    checkbox.style.marginRight = '5px';
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(cat));
    filtersContainer.appendChild(label);
  });

  calendarEl.parentNode.insertBefore(filtersContainer, calendarEl);

  // Funzione che filtra eventi in base ai checkbox
  function applyFilters() {
    const checkboxes = filtersContainer.querySelectorAll('input[type=checkbox]');
    const activeCategories = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);

    const allEvents = mapEvents(savedEvents);
    const filtered = allEvents.filter(ev => activeCategories.includes(ev.extendedProps.category));
    calendar.removeAllEvents();
    calendar.addEventSource(filtered);
  }

  // Aggiungi listener a checkbox
  filtersContainer.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Ricarica gli eventi salvati da localStorage per avere dati aggiornati
      const eventsFromStorage = JSON.parse(localStorage.getItem('fcEvents') || '[]');
      savedEvents.length = 0; // svuota array
      eventsFromStorage.forEach(e => savedEvents.push(e)); // aggiorna array originale
      applyFilters();
    });
  });

  calendar.render();
  applyFilters();
});
