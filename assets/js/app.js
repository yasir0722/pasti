const app = document.querySelector("#app");
const progressKey = "pasti-revised-v1";
let content = { topics: [] };
let revised = readProgress();

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey) || "{}");
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(progressKey, JSON.stringify(revised));
}

function getTopic(topicId) {
  return content.topics.find((topic) => topic.id === topicId);
}

function getLesson(topic, lessonId) {
  return topic?.items.find((item) => item.id === lessonId);
}

function isRevised(lessonId) {
  return revised[lessonId] === true;
}

function topicProgress(topic) {
  return topic.items.filter((item) => isRevised(item.id)).length;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function renderHome() {
  const totalDone = content.topics.reduce((total, topic) => total + topicProgress(topic), 0);
  const totalItems = content.topics.reduce((total, topic) => total + topic.items.length, 0);
  app.innerHTML = `
    <section class="home-hero">
      <div>
        <p class="eyebrow">Selamat datang ke Pasti</p>
        <h1>Belajar sedikit,<br />ingat lebih lama.</h1>
        <p class="intro">Ruang kecil untuk anak mengulang Hadis, Quran, dan bahasa Arab bersama ibu atau ayah.</p>
      </div>
      <aside class="hero-note">
        <span aria-hidden="true">رَبِّ زِدْنِي عِلْمًا</span>
        <p>Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.</p>
      </aside>
    </section>
    <section aria-labelledby="topics-title">
      <div class="section-heading">
        <h2 id="topics-title">Mari belajar</h2>
        <span class="progress-summary">${totalDone} daripada ${totalItems} sudah diulang</span>
      </div>
      <div class="topic-grid">
        ${content.topics.map(renderTopicCard).join("")}
      </div>
    </section>`;
}

function renderTopicCard(topic) {
  const done = topicProgress(topic);
  return `<a class="topic-card ${escapeHtml(topic.tone)}" href="#${escapeHtml(topic.id)}">
    <div>
      <span class="topic-icon" aria-hidden="true">${escapeHtml(topic.icon)}</span>
      <h3>${escapeHtml(topic.title)}</h3>
      <p>${escapeHtml(topic.description)}</p>
    </div>
    <div class="topic-meta"><span>${done} / ${topic.items.length} diulang</span><span aria-hidden="true">→</span></div>
  </a>`;
}

function renderTopic(topic) {
  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="topic-header">
      <div><p class="eyebrow">${escapeHtml(topic.eyebrow)}</p><h1>${escapeHtml(topic.title)}</h1><p class="intro">${escapeHtml(topic.description)}</p></div>
      <span class="topic-count">${topicProgress(topic)} / ${topic.items.length} sudah diulang</span>
    </section>
    <section class="lesson-grid" aria-label="Senarai ${escapeHtml(topic.title)}">
      ${topic.items.map((item) => renderLessonCard(topic, item)).join("")}
    </section>`;
}

function renderLessonCard(topic, item) {
  const done = isRevised(item.id);
  return `<a class="lesson-card" href="#${escapeHtml(topic.id)}/${escapeHtml(item.id)}">
    <div class="lesson-number"><span>${String(item.number).padStart(2, "0")}</span>${done ? '<span class="done-mark" title="Sudah diulang">✓</span>' : ""}</div>
    <div>${item.arabic ? `<div class="arabic-mini" lang="ar">${escapeHtml(item.arabic)}</div>` : ""}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.translation || item.transliteration || "Tekan untuk belajar")}</p></div>
  </a>`;
}

function renderLesson(topic, item) {
  const itemIndex = topic.items.findIndex((entry) => entry.id === item.id);
  const previous = topic.items[itemIndex - 1];
  const next = topic.items[itemIndex + 1];
  const done = isRevised(item.id);
  const imageMarkup = item.image
    ? `<div class="detail-visual has-image"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" width="768" height="960" /></div>`
    : item.accent
      ? `<div class="detail-visual" style="background: ${escapeHtml(item.accent)}"><div class="color-swatch" style="background: ${escapeHtml(item.accent)}"></div></div>`
      : `<div class="detail-visual"><div class="visual-placeholder"><div class="large-arabic" lang="ar">${escapeHtml(item.arabic || "")}</div><p>Ruang untuk kad pembelajaran akan diisi dalam fasa kandungan.</p></div></div>`;
  app.innerHTML = `
    <a class="back-link" href="#${escapeHtml(topic.id)}">← Semua ${escapeHtml(topic.title)}</a>
    <article class="detail-layout">
      ${imageMarkup}
      <div class="detail-copy">
        <p class="eyebrow">${escapeHtml(topic.title)} · ${String(item.number).padStart(2, "0")}</p>
        <h1>${escapeHtml(item.title)}</h1>
        <p class="arabic-text" lang="ar">${escapeHtml(item.arabic || "")}</p>
        ${item.transliteration ? `<p class="transliteration">${escapeHtml(item.transliteration)}</p>` : ""}
        <p class="translation">${escapeHtml(item.translation || "Baca dengan perlahan dan ulang bersama ibu atau ayah.")}</p>
        <div class="detail-actions">
          ${topic.id === "colors" ? '<button class="button" id="speak-button" type="button">◖ Dengar sebutan</button>' : ""}
          <button class="button secondary" id="revised-button" type="button" aria-pressed="${done}">${done ? "✓ Sudah diulang" : "Tanda sudah diulang"}</button>
        </div>
        <nav class="detail-nav" aria-label="Navigasi pelajaran">
          ${previous ? `<a href="#${escapeHtml(topic.id)}/${escapeHtml(previous.id)}">← Sebelum</a>` : "<span></span>"}
          ${next ? `<a href="#${escapeHtml(topic.id)}/${escapeHtml(next.id)}">Seterusnya →</a>` : "<span></span>"}
        </nav>
      </div>
    </article>`;
  const lessonImage = document.querySelector(".detail-visual img");
  lessonImage?.addEventListener("error", () => {
    const visual = lessonImage.closest(".detail-visual");
    visual.classList.remove("has-image");
    visual.innerHTML = `<div class="visual-placeholder"><div class="large-arabic" lang="ar">${escapeHtml(item.arabic || "")}</div><p>Kad gambar akan diisi apabila bahan Hadis tersedia.</p></div>`;
  }, { once: true });
  document.querySelector("#revised-button").addEventListener("click", () => toggleRevised(item.id, topic));
  document.querySelector("#speak-button")?.addEventListener("click", () => speakArabic(item.arabic, item.title));
}

function toggleRevised(itemId, topic) {
  revised[itemId] = !isRevised(itemId);
  saveProgress();
  const hash = window.location.hash.slice(1).split("/");
  renderLesson(topic, getLesson(topic, hash[1]));
}

function speakArabic(text, label) {
  if (!("speechSynthesis" in window)) {
    window.alert("Suara Arab tidak disokong oleh pelayar ini.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === "ar-sa") || voices.find((voice) => voice.lang.toLowerCase().startsWith("ar")) || null;
  utterance.lang = utterance.voice?.lang || "ar-SA";
  utterance.rate = 0.72;
  utterance.pitch = 1;
  utterance.onstart = () => { document.querySelector("#speak-button").textContent = `◖ Mendengar ${label}`; };
  utterance.onend = () => { document.querySelector("#speak-button").textContent = "◖ Dengar sebutan"; };
  window.speechSynthesis.speak(utterance);
}

function renderRoute() {
  const [topicId, lessonId] = window.location.hash.slice(1).split("/");
  if (!topicId || topicId === "home") {
    renderHome();
  } else {
    const topic = getTopic(topicId);
    const lesson = getLesson(topic, lessonId);
    if (!topic) renderHome();
    else if (!lessonId || !lesson) renderTopic(topic);
    else renderLesson(topic, lesson);
  }
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function start() {
  try {
    const response = await fetch("assets/data/content.json");
    if (!response.ok) throw new Error("Content could not be loaded");
    content = await response.json();
    window.addEventListener("hashchange", renderRoute);
    renderRoute();
  } catch (error) {
    app.innerHTML = `<div class="empty-state"><h2>Belum dapat dibuka</h2><p>Pastikan aplikasi dibuka melalui GitHub Pages atau pelayan web tempatan.</p></div>`;
    console.error(error);
  }
}

start();