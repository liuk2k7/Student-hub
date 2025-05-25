
// === STORAGE ===
let appunti = JSON.parse(localStorage.getItem("appunti")) || [];

function salvaAppunti() {
  localStorage.setItem("appunti", JSON.stringify(appunti));
}

function caricaAppunti() {
  appunti = JSON.parse(localStorage.getItem("appunti")) || [];
  refreshAppuntiList();
}

// === RENDER APPUNTI ===
const appuntiList = document.getElementById("appuntiList");

function creaCardAppunto(appunto, index) {
  const card = document.createElement("div");
  card.className = "appunto-card";

  const title = document.createElement("h3");
  title.textContent = appunto.titolo;

  const desc = document.createElement("p");
  desc.textContent = appunto.descrizione;

  const fileLink = document.createElement("a");
  fileLink.href = appunto.fileURL;
  fileLink.textContent = "Scarica appunto";
  fileLink.target = "_blank";

  card.appendChild(title);
  card.appendChild(desc);

  // === ANTEPRIMA PDF ===
  if (appunto.fileURL.endsWith(".pdf")) {
    const preview = document.createElement("embed");
    preview.src = appunto.fileURL;
    preview.type = "application/pdf";
    preview.width = "100%";
    preview.height = "200px";
    card.appendChild(preview);
  }

  card.appendChild(fileLink);

  // === LIKE ===
  const likeBtn = document.createElement("button");
  likeBtn.innerHTML = `❤️ ${appunto.likes || 0}`;
  likeBtn.classList.add("like-button");

  likeBtn.addEventListener("click", () => {
    appunti[index].likes = (appunti[index].likes || 0) + 1;
    salvaAppunti();
    refreshAppuntiList();
  });

  card.appendChild(likeBtn);

  // === COMMENTI ===
  const commentList = document.createElement("ul");
  (appunti[index].commenti || []).forEach(commento => {
    const li = document.createElement("li");
    li.textContent = commento;
    commentList.appendChild(li);
  });

  const commentForm = document.createElement("form");
  commentForm.innerHTML = `
    <input type="text" placeholder="Scrivi un commento..." class="comment-input" />
    <button type="submit">Invia</button>
  `;

  commentForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = commentForm.querySelector("input");
    if (!input.value.trim()) return;

    if (!appunti[index].commenti) appunti[index].commenti = [];
    appunti[index].commenti.push(input.value.trim());
    salvaAppunti();
    refreshAppuntiList();
  });

  card.appendChild(commentList);
  card.appendChild(commentForm);

  appuntiList.appendChild(card);
}

// === RICERCA ===
function refreshAppuntiList() {
  const searchQuery = document.getElementById("searchBar").value.toLowerCase();

  const filteredAppunti = appunti
    .map((a, i) => ({ ...a, originalIndex: i }))
    .filter(appunto =>
      appunto.titolo.toLowerCase().includes(searchQuery) ||
      appunto.descrizione.toLowerCase().includes(searchQuery)
    );

  appuntiList.innerHTML = "";
  filteredAppunti.forEach(appunto => creaCardAppunto(appunto, appunto.originalIndex));
}

// === AVVIO ===
document.addEventListener("DOMContentLoaded", () => {
  caricaAppunti();
  document.getElementById("searchBar").addEventListener("input", refreshAppuntiList);
});
