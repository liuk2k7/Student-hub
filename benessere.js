// Diario emotivo
const form = document.getElementById("diarioForm");
const input = document.getElementById("diarioInput");
const entriesDiv = document.getElementById("diarioEntries");
const clearButton = document.getElementById("clearDiario");
const exportButton = document.getElementById("exportDiario");

function createEntry(text, mood, date) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${mood} ${date}</strong><p>${text}</p>`;
  entriesDiv.prepend(div);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const mood = form.elements["mood"].value;
  const date = new Date().toLocaleString("it-IT");
  if (text !== "") {
    createEntry(text, mood, date);
    input.value = "";
    saveEntries();
  }
});

clearButton.addEventListener("click", () => {
  if (confirm("Vuoi davvero cancellare tutte le voci del diario?")) {
    localStorage.removeItem("diarioStudentHub");
    entriesDiv.innerHTML = "";
  }
});

exportButton.addEventListener("click", () => {
  const data = entriesDiv.innerText;
  const blob = new Blob([data], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "diario_emotivo.txt";
  a.click();
});

function saveEntries() {
  localStorage.setItem("diarioStudentHub", entriesDiv.innerHTML);
}

function loadEntries() {
  const data = localStorage.getItem("diarioStudentHub");
  if (data) {
    entriesDiv.innerHTML = data;
  }
}

loadEntries();