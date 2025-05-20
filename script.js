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
