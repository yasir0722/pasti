const app = document.querySelector("#app");
const progressKey = "pasti-revised-v1";
let content = { topics: [] };
let revised = readProgress();
let gameSession = null;
let wordMatchSession = null;
let wordMatchAudio = null;
let wordMatchAudioButton = null;
let activeRoute = "";
let activeHomeTab = "learn";

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

function shuffle(values) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function chooseRandom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function selectGameOptions(correct, choices, amount = 4) {
  const distractors = choices.filter((choice) => choice.id !== correct.id);
  return shuffle([correct, ...shuffle(distractors).slice(0, amount - 1)]);
}

function textGameOptions(values, answer, attributes = {}) {
  const choices = values.map((value) => ({ id: String(value), label: String(value), ...attributes }));
  return selectGameOptions(choices.find((choice) => choice.id === String(answer)), choices);
}

function createSetOneQuestions() {
  const initialSounds = [
    { word: "bola", icon: "⚽", answer: "b" },
    { word: "roti", icon: "🍞", answer: "r" },
    { word: "pisang", icon: "🍌", answer: "p" },
    { word: "dadu", icon: "🎲", answer: "d" },
    { word: "kucing", icon: "🐱", answer: "k" },
    { word: "lampu", icon: "💡", answer: "l" }
  ];
  const vowelSounds = [
    { word: "ayam", icon: "🐔", answer: "a" },
    { word: "ikan", icon: "🐟", answer: "i" },
    { word: "ular", icon: "🐍", answer: "u" },
    { word: "epal", icon: "🍎", answer: "e" },
    { word: "orang", icon: "🧑", answer: "o" }
  ];
  const missingLetters = [
    { sequence: ["A", "B", "?", "D"], answer: "C" },
    { sequence: ["E", "?", "G", "H"], answer: "F" },
    { sequence: ["J", "K", "?", "M"], answer: "L" },
    { sequence: ["O", "?", "Q", "R"], answer: "P" },
    { sequence: ["T", "U", "?", "W"], answer: "V" },
    { sequence: ["X", "?", "Z"], answer: "Y" }
  ];
  const englishWords = [
    { word: "cap", icon: "🧢" },
    { word: "ball", icon: "⚽" },
    { word: "doll", icon: "🪆" },
    { word: "bus", icon: "🚌" },
    { word: "bag", icon: "🎒" },
    { word: "dog", icon: "🐶" },
    { word: "duck", icon: "🦆" },
    { word: "bug", icon: "🐞" },
    { word: "pen", icon: "🖊️" },
    { word: "pill", icon: "💊" }
  ];
  const countingItems = [
    { count: 1, icon: "🍓" },
    { count: 2, icon: "⭐" },
    { count: 3, icon: "🍎" },
    { count: 4, icon: "🐟" },
    { count: 5, icon: "🌻" },
    { count: 6, icon: "🐞" },
    { count: 7, icon: "🍪" },
    { count: 8, icon: "🎈" },
    { count: 9, icon: "🟡" },
    { count: 10, icon: "🔵" }
  ];
  const additions = [
    { left: 5, right: 1 },
    { left: 2, right: 2 },
    { left: 3, right: 4 },
    { left: 0, right: 1 },
    { left: 4, right: 1 },
    { left: 3, right: 6 }
  ];
  const shapes = [
    { id: "circle", label: "Bulatan" },
    { id: "square", label: "Segi empat sama" },
    { id: "triangle", label: "Segi tiga" },
    { id: "rectangle", label: "Segi empat tepat" }
  ];
  const jawiVowels = [
    { letter: "ا", sound: "a" },
    { letter: "و", sound: "u" },
    { letter: "ي", sound: "i" }
  ];
  const jawiShoeLetters = ["ا", "د", "ذ", "ر", "ز", "و"];
  const bodyItems = getTopic("body")?.items.filter((item) => item.image) || [];
  const familyItems = getTopic("family")?.items.filter((item) => item.image) || [];

  const initial = chooseRandom(initialSounds);
  const vowel = chooseRandom(vowelSounds);
  const missingLetter = chooseRandom(missingLetters);
  const englishWord = chooseRandom(englishWords);
  const countItem = chooseRandom(countingItems);
  const addition = chooseRandom(additions);
  const shape = chooseRandom(shapes);
  const bodyItem = chooseRandom(bodyItems);
  const jawiVowel = chooseRandom(jawiVowels);
  const jawiShoeLetter = chooseRandom(jawiShoeLetters);
  const familyItem = chooseRandom(familyItems);
  const arabicBodyItem = chooseRandom(bodyItems);

  const bodyChoices = bodyItems.map((item) => ({ id: item.id, label: item.title }));
  const familyChoices = familyItems.map((item) => ({
    id: item.id,
    label: item.arabic,
    secondary: item.transliteration,
    lang: "ar",
    pronunciationItem: item
  }));
  const arabicBodyChoices = bodyItems.map((item) => ({
    id: item.id,
    label: item.arabic,
    secondary: item.transliteration,
    lang: "ar",
    pronunciationItem: item
  }));
  const shapeChoices = shapes.map((item) => ({ ...item, visual: { type: "shape", value: item.id } }));
  const jawiShoeChoices = [jawiShoeLetter, "ب", "ج", "س"].map((letter) => ({
    id: letter,
    label: letter,
    lang: "ms-Arab"
  }));

  return shuffle([
    {
      id: "bm-awalan",
      category: "Bahasa Melayu",
      activity: "Huruf awal",
      prompt: "Pilih huruf awal bagi gambar ini.",
      visual: { type: "emoji", value: initial.icon, label: initial.word },
      options: textGameOptions(["r", "b", "p", "d", "k", "l"], initial.answer, { uppercase: true }),
      answer: initial.answer
    },
    {
      id: "bm-vokal",
      category: "Bahasa Melayu",
      activity: "Huruf vokal",
      prompt: "Pilih huruf vokal awal bagi gambar ini.",
      visual: { type: "emoji", value: vowel.icon, label: vowel.word },
      options: textGameOptions(["a", "e", "i", "o", "u"], vowel.answer, { uppercase: true }),
      answer: vowel.answer
    },
    {
      id: "english-missing-letter",
      category: "English",
      activity: "Missing letter",
      prompt: "Complete the missing letter.",
      visual: { type: "sequence", values: missingLetter.sequence },
      options: textGameOptions(["C", "F", "L", "P", "V", "Y"], missingLetter.answer, { uppercase: true }),
      answer: missingLetter.answer
    },
    {
      id: "english-word",
      category: "English",
      activity: "Word match",
      prompt: "Choose the correct word for this picture.",
      visual: { type: "emoji", value: englishWord.icon, label: englishWord.word },
      options: textGameOptions(englishWords.map((item) => item.word), englishWord.word),
      answer: englishWord.word
    },
    {
      id: "math-count",
      category: "Matematik",
      activity: "Kira objek",
      prompt: "Kira objek dan pilih jawapan yang betul.",
      visual: { type: "count", value: countItem.icon, count: countItem.count },
      options: textGameOptions(Array.from({ length: 11 }, (_, index) => index), countItem.count),
      answer: String(countItem.count)
    },
    {
      id: "math-addition",
      category: "Matematik",
      activity: "Tambah",
      prompt: "Selesaikan tambah ini.",
      visual: { type: "equation", left: addition.left, right: addition.right },
      options: textGameOptions(Array.from({ length: 11 }, (_, index) => index), addition.left + addition.right),
      answer: String(addition.left + addition.right)
    },
    {
      id: "science-shapes",
      category: "Sains",
      activity: "Bentuk sama",
      prompt: "Pilih bentuk yang sama.",
      visual: { type: "shape", value: shape.id, label: shape.label },
      options: selectGameOptions(shapeChoices.find((item) => item.id === shape.id), shapeChoices),
      answer: shape.id
    },
    {
      id: "science-body",
      category: "Sains",
      activity: "Anggota badan",
      prompt: "Apakah nama anggota badan ini?",
      visual: { type: "image", src: bodyItem.image, alt: bodyItem.title },
      options: selectGameOptions(bodyChoices.find((item) => item.id === bodyItem.id), bodyChoices),
      answer: bodyItem.id
    },
    {
      id: "jawi-vowel",
      category: "Jawi",
      activity: "Huruf vokal",
      prompt: `Pilih huruf Jawi bagi bunyi ${jawiVowel.sound}.`,
      visual: { type: "script", value: jawiVowel.letter, lang: "ms-Arab" },
      options: selectGameOptions(
        { id: jawiVowel.letter, label: jawiVowel.letter, lang: "ms-Arab" },
        jawiVowels.map((item) => ({ id: item.letter, label: item.letter, lang: "ms-Arab" }))
      ),
      answer: jawiVowel.letter
    },
    {
      id: "jawi-shoe-letter",
      category: "Jawi",
      activity: "Huruf berkasut",
      prompt: "Pilih huruf Jawi yang berkasut.",
      visual: { type: "script", value: jawiShoeLetter, lang: "ms-Arab" },
      options: selectGameOptions(
        jawiShoeChoices.find((item) => item.id === jawiShoeLetter),
        jawiShoeChoices
      ),
      answer: jawiShoeLetter
    },
    {
      id: "arabic-family",
      category: "Bahasa Arab",
      activity: "Anggota keluarga",
      prompt: "Pilih perkataan Arab bagi gambar ini.",
      visual: { type: "image", src: familyItem.image, alt: familyItem.title },
      options: selectGameOptions(familyChoices.find((item) => item.id === familyItem.id), familyChoices),
      answer: familyItem.id
    },
    {
      id: "arabic-body",
      category: "Bahasa Arab",
      activity: "Anggota badan",
      prompt: "Pilih perkataan Arab bagi anggota badan ini.",
      visual: { type: "image", src: arabicBodyItem.image, alt: arabicBodyItem.title },
      options: selectGameOptions(arabicBodyChoices.find((item) => item.id === arabicBodyItem.id), arabicBodyChoices),
      answer: arabicBodyItem.id
    }
  ]);
}

function numberOptions(values) {
  return shuffle(values.map((value) => ({ id: String(value), label: String(value) })));
}

function createMathCountingQuestions() {
  const exercises = [
    { id: "apples", object: "epal", count: 4, options: [6, 4, 2] },
    { id: "balls", object: "bola sepak", count: 7, options: [7, 5, 8] },
    { id: "fish", object: "ikan", count: 2, options: [5, 3, 2] },
    { id: "flowers", object: "bunga", count: 6, options: [4, 6, 9] },
    { id: "books", object: "buku", count: 3, options: [3, 1, 5] },
    { id: "pencils", object: "pensel", count: 8, options: [6, 10, 8] },
    { id: "stars", object: "bintang", count: 5, options: [7, 5, 3] },
    { id: "cats", object: "kucing", count: 1, options: [1, 4, 2] }
  ];
  return shuffle(exercises.map((exercise) => ({
    id: `count-${exercise.id}`,
    category: "Matematik · Kira objek",
    activity: "Kira objek",
    prompt: `Ada berapa ${exercise.object}?`,
    visual: {
      type: "image",
      src: `assets/images/math/count-${exercise.id}.png`,
      alt: `${exercise.count} ${exercise.object}`
    },
    options: numberOptions(exercise.options),
    answer: String(exercise.count),
    showOptionAudio: false
  })));
}

function createMathAdditionQuestions() {
  const exercises = [
    { id: "apples", left: 10, right: 4, answer: 14 },
    { id: "ducks", left: 6, right: 7, answer: 13 },
    { id: "sharpeners", left: 9, right: 4, answer: 13 },
    { id: "candy", left: 7, right: 8, answer: 15 },
    { id: "bees", left: 5, right: 10, answer: 15 },
    { id: "rulers", left: 13, right: 7, answer: 20 }
  ];
  return shuffle(exercises.map((exercise) => ({
    id: `addition-${exercise.id}`,
    category: "Matematik · Tambah",
    activity: "Tambah",
    prompt: `Selesaikan: ${exercise.left} + ${exercise.right} = ?`,
    visual: {
      type: "image",
      src: `assets/images/math/addition-${exercise.id}.png`,
      alt: `Kumpulan objek untuk ${exercise.left} tambah ${exercise.right}`
    },
    options: numberOptions([exercise.answer, exercise.answer - 2, exercise.answer + 1]),
    answer: String(exercise.answer),
    showOptionAudio: false
  })));
}

function renderGameVisual(visual) {
  if (visual.type === "image") {
    return `<img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt)}" />`;
  }
  if (visual.type === "count") {
    return `<span class="game-count" role="img" aria-label="${visual.count} objek">${Array.from({ length: visual.count }, () => `<span>${escapeHtml(visual.value)}</span>`).join("")}</span>`;
  }
  if (visual.type === "sequence") {
    return `<span class="game-sequence" aria-label="Susunan huruf">${visual.values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</span>`;
  }
  if (visual.type === "equation") {
    return `<span class="game-equation">${visual.left} + ${visual.right} = ?</span>`;
  }
  if (visual.type === "shape") {
    return `<span class="game-shape shape-${escapeHtml(visual.value)}" role="img" aria-label="${escapeHtml(visual.label)}"></span>`;
  }
  if (visual.type === "script") {
    return `<span class="game-script" lang="${escapeHtml(visual.lang)}">${escapeHtml(visual.value)}</span>`;
  }
  return `<span class="game-emoji" role="img" aria-label="${escapeHtml(visual.label)}">${escapeHtml(visual.value)}</span>`;
}

function renderGameOption(option, question, isWrong) {
  const isCorrect = gameSession.status === "correct" && option.id === question.answer;
  const stateClass = isCorrect ? " is-correct" : isWrong ? " is-wrong" : "";
  const disabled = gameSession.status === "correct" || isWrong ? " disabled" : "";
  const shape = option.visual?.type === "shape"
    ? `<span class="game-answer-shape shape-${escapeHtml(option.visual.value)}" aria-hidden="true"></span>`
    : "";
  const label = option.uppercase ? option.label.toUpperCase() : option.label;
  const listenButton = question.showOptionAudio === false
    ? ""
    : `<button class="game-answer-listen" type="button" data-game-answer-listen="${escapeHtml(option.id)}" aria-label="Dengar jawapan ${escapeHtml(option.secondary || label)}">Dengar</button>`;
  return `<div class="game-answer-choice${listenButton ? "" : " is-single"}">
    <button class="game-answer${stateClass}" type="button" data-game-answer="${escapeHtml(option.id)}"${disabled}>
      ${shape}<span class="game-answer-label"${option.lang ? ` lang="${escapeHtml(option.lang)}"` : ""}>${escapeHtml(label)}</span>${option.secondary ? `<span class="game-answer-secondary">${escapeHtml(option.secondary)}</span>` : ""}
    </button>
    ${listenButton}
  </div>`;
}

function renderSetOneGame() {
  if (!gameSession) {
    gameSession = {
      id: "set-1",
      title: "Misi Pintar",
      eyebrow: "Set 1 · Main sambil belajar",
      completionLabel: "Set 1 selesai",
      questions: createSetOneQuestions(),
      index: 0,
      firstTryCorrect: 0,
      status: "answering",
      wrongAnswers: new Set(),
      finished: false
    };
  }

  if (gameSession.finished) {
    renderSetOneGameResult();
    return;
  }

  const question = gameSession.questions[gameSession.index];
  const completed = gameSession.index;
  const progress = Math.round((completed / gameSession.questions.length) * 100);
  const feedback = gameSession.status === "correct"
    ? "Bagus! Jawapan betul."
    : gameSession.wrongAnswers.size
      ? "Belum tepat. Cuba jawapan lain."
      : "Pilih jawapan yang paling tepat.";
  const feedbackClass = gameSession.status === "correct" ? " is-correct" : gameSession.wrongAnswers.size ? " is-wrong" : "";

  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="game-page" aria-labelledby="game-title">
      <header class="game-header">
      <div><p class="eyebrow">${escapeHtml(gameSession.eyebrow)}</p><h1 id="game-title">${escapeHtml(gameSession.title)}</h1></div>
        <button class="button secondary game-restart" id="game-restart" type="button">↻ Main semula</button>
      </header>
      <div class="game-progress" aria-label="Kemajuan permainan">
        <div><span>${escapeHtml(question.category)}</span><strong>${gameSession.index + 1} / ${gameSession.questions.length}</strong></div>
        <div class="game-progress-track" aria-hidden="true"><span style="width: ${progress}%"></span></div>
      </div>
      <article class="game-board${gameSession.id.startsWith("math-") ? " is-number-game" : ""}">
        <div class="game-board-heading"><span>${escapeHtml(question.activity)}</span><button class="game-listen" id="game-question-listen" type="button">Dengar soalan</button></div>
        <div class="game-visual game-visual-${escapeHtml(question.visual.type)}">${renderGameVisual(question.visual)}</div>
        <h2>${escapeHtml(question.prompt)}</h2>
        <div class="game-answer-grid" aria-label="Pilihan jawapan">
          ${question.options.map((option) => renderGameOption(option, question, gameSession.wrongAnswers.has(option.id))).join("")}
        </div>
        <p class="game-feedback${feedbackClass}" aria-live="polite">${feedback}</p>
        ${gameSession.status === "correct" ? '<button class="button game-next" id="game-next" type="button">Soalan seterusnya →</button>' : ""}
      </article>
    </section>`;

  document.querySelector("#game-restart")?.addEventListener("click", restartCurrentQuiz);
  document.querySelector("#game-question-listen")?.addEventListener("click", (event) => playGameQuestionAudio(question, event.currentTarget));
  document.querySelectorAll("[data-game-answer]").forEach((button) => {
    button.addEventListener("click", () => answerSetOneQuestion(button.dataset.gameAnswer));
  });
  document.querySelectorAll("[data-game-answer-listen]").forEach((button) => {
    button.addEventListener("click", () => {
      const option = question.options.find((entry) => entry.id === button.dataset.gameAnswerListen);
      playGameAnswerAudio(question, option, button);
    });
  });
  document.querySelector("#game-next")?.addEventListener("click", nextSetOneQuestion);
}

function renderSetOneGameResult() {
  const total = gameSession.questions.length;
  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="game-page" aria-labelledby="game-result-title">
      <article class="game-board game-result">
        <p class="eyebrow">${escapeHtml(gameSession.completionLabel)}</p>
        <div class="game-result-stars" aria-hidden="true">★ ★ ★</div>
        <h1 id="game-result-title">${escapeHtml(gameSession.resultTitle || "Hebat bermain!")}</h1>
        <p>${gameSession.firstTryCorrect} daripada ${total} jawapan tepat pada cubaan pertama.</p>
        <p class="game-result-note">${escapeHtml(gameSession.replayNote || "Main lagi untuk susunan dan soalan yang baru.")}</p>
        <button class="button" id="game-play-again" type="button">↻ Main lagi</button>
      </article>
    </section>`;
  document.querySelector("#game-play-again")?.addEventListener("click", restartCurrentQuiz);
}

function answerSetOneQuestion(answerId) {
  if (!gameSession || gameSession.status === "correct") return;
  const question = gameSession.questions[gameSession.index];
  if (answerId === question.answer) {
    if (!gameSession.wrongAnswers.size) gameSession.firstTryCorrect += 1;
    gameSession.status = "correct";
    playGameFeedback(true);
  } else {
    gameSession.wrongAnswers.add(answerId);
    playGameFeedback(false);
  }
  renderSetOneGame();
}

function nextSetOneQuestion() {
  if (!gameSession || gameSession.status !== "correct") return;
  gameSession.index += 1;
  gameSession.wrongAnswers = new Set();
  gameSession.status = "answering";
  if (gameSession.index >= gameSession.questions.length) gameSession.finished = true;
  renderSetOneGame();
}

function startSetOneGame() {
  gameSession = null;
  renderSetOneGame();
}

function startMathGame(gameId) {
  const games = {
    "math-counting-game": {
      title: "Kira dan Pilih",
      eyebrow: "Matematik · Kira objek",
      completionLabel: "Permainan selesai",
      replayNote: "Main lagi dan cuba kira objek dengan teliti.",
      questions: createMathCountingQuestions()
    },
    "math-addition-game": {
      title: "Jom Tambah",
      eyebrow: "Matematik · Operasi tambah",
      completionLabel: "Permainan selesai",
      replayNote: "Main lagi untuk berlatih operasi tambah.",
      questions: createMathAdditionQuestions()
    }
  };
  const game = games[gameId];
  if (!game) return;
  gameSession = {
    id: gameId,
    ...game,
    index: 0,
    firstTryCorrect: 0,
    status: "answering",
    wrongAnswers: new Set(),
    finished: false
  };
  renderSetOneGame();
}

function restartCurrentQuiz() {
  if (gameSession?.id === "math-counting-game" || gameSession?.id === "math-addition-game") {
    startMathGame(gameSession.id);
  } else {
    startSetOneGame();
  }
}

function getWordMatchExercise(exerciseId) {
  return content.exercises?.find((exercise) => exercise.id === exerciseId);
}

function startWordMatchGame(exerciseId = "arabic-word-picture") {
  const exercise = getWordMatchExercise(exerciseId);
  if (!exercise) {
    app.innerHTML = '<a class="back-link" href="#home">← Kembali ke utama</a><p class="empty-state">Aktiviti padanan belum tersedia.</p>';
    return;
  }
  stopWordMatchAudio();
  wordMatchSession = {
    exercise,
    categories: exercise.categories.map((category) => ({
      ...category,
      words: shuffle(category.items),
      pictures: shuffle(category.items)
    })),
    categoryIndex: 0,
    matches: {},
    selectedWord: null,
    feedback: "Pilih satu perkataan untuk bermula.",
    feedbackTone: ""
  };
  renderWordMatchGame();
}

function renderWordMatchGame() {
  if (!wordMatchSession) return;
  const { exercise, categories } = wordMatchSession;
  const total = categories.reduce((count, category) => count + category.items.length, 0);
  const category = categories[wordMatchSession.categoryIndex];
  if (!category) {
    renderWordMatchResult();
    return;
  }
  const completedBefore = categories
    .slice(0, wordMatchSession.categoryIndex)
    .reduce((count, entry) => count + entry.items.length, 0);
  const matched = Object.keys(wordMatchSession.matches).length;
  if (matched === category.items.length) {
    renderWordMatchCategoryComplete();
    return;
  }
  const progress = Math.round(((completedBefore + matched) / total) * 100);

  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="match-game-page" aria-labelledby="word-match-game-title">
      <header class="game-header">
        <div><p class="eyebrow">${escapeHtml(exercise.subject || "Bahasa Arab · Aktiviti padanan")}</p><h1 id="word-match-game-title">${escapeHtml(exercise.title)}</h1></div>
        <button class="button secondary game-restart" id="word-match-restart" type="button">↻ Mula semula</button>
      </header>
      <p class="match-instructions">${escapeHtml(exercise.instructions || "Klik perkataan untuk dengar sebutannya, kemudian seret ke gambar yang betul. Pada telefon, sentuh perkataan kemudian sentuh gambarnya.")}</p>
      <div class="game-progress" aria-label="Kemajuan aktiviti">
        <div><span>${escapeHtml(category.title)} · ${matched} / ${category.items.length}</span><strong>${completedBefore + matched} / ${total}</strong></div>
        <div class="game-progress-track" aria-hidden="true"><span style="width: ${progress}%"></span></div>
      </div>
      <p class="match-feedback${wordMatchSession.feedbackTone ? ` is-${wordMatchSession.feedbackTone}` : ""}" id="word-match-feedback" role="status" aria-live="polite">${escapeHtml(wordMatchSession.feedback)}</p>
      <div class="match-category-grid match-category-grid-single${exercise.largePictures ? " match-category-grid-illustrated" : ""}">
        ${renderWordMatchCategory(category)}
      </div>
    </section>`;

  document.querySelector("#word-match-restart")?.addEventListener("click", () => startWordMatchGame(exercise.id));
  document.querySelectorAll("[data-match-word]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = getWordMatchItem(button.dataset.categoryId, button.dataset.matchWord);
      selectWordMatch(button.dataset.categoryId, button.dataset.matchWord);
      if (item?.audio) playWordMatchAudio(item, button);
    });
    button.addEventListener("dragstart", (event) => {
      if (wordMatchSession.matches[button.dataset.matchWord]) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/plain", `${button.dataset.categoryId}:${button.dataset.matchWord}`);
      event.dataTransfer.effectAllowed = "move";
      wordMatchSession.selectedWord = {
        categoryId: button.dataset.categoryId,
        itemId: button.dataset.matchWord
      };
    });
  });
  document.querySelectorAll("[data-match-target]").forEach((button) => {
    button.addEventListener("click", () => tryWordMatch(button.dataset.categoryId, button.dataset.matchTarget));
    button.addEventListener("dragover", (event) => {
      if (!wordMatchSession.matches[button.dataset.matchTarget]) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }
    });
    button.addEventListener("drop", (event) => {
      event.preventDefault();
      const [categoryId, itemId] = event.dataTransfer.getData("text/plain").split(":");
      if (categoryId && itemId) tryWordMatch(button.dataset.categoryId, button.dataset.matchTarget, { categoryId, itemId });
    });
  });
  window.requestAnimationFrame(drawWordMatchConnections);
}

function getWordMatchItem(categoryId, itemId) {
  return wordMatchSession.exercise.categories
    .find((category) => category.id === categoryId)
    ?.items.find((item) => item.id === itemId);
}

function playWordMatchAudio(item, button) {
  if (!item?.audio) {
    wordMatchSession.feedback = "Audio sebutan belum tersedia.";
    wordMatchSession.feedbackTone = "wrong";
    updateWordMatchFeedback();
    console.error(`No pronunciation audio is configured for ${item?.id || "the selected word"}.`);
    return;
  }

  stopWordMatchAudio();
  const audio = new Audio(item.audio);
  wordMatchAudio = audio;
  wordMatchAudioButton = button;
  button.classList.add("is-speaking");
  const finish = () => {
    button.classList.remove("is-speaking");
    if (wordMatchAudio === audio) {
      wordMatchAudio = null;
      wordMatchAudioButton = null;
    }
  };
  let errorReported = false;
  const reportError = (error) => {
    if (errorReported || wordMatchAudio !== audio) return;
    errorReported = true;
    finish();
    wordMatchSession.feedback = "Audio sebutan tidak dapat dimainkan. Cuba lagi.";
    wordMatchSession.feedbackTone = "wrong";
    updateWordMatchFeedback();
    console.error(`Could not play pronunciation audio for ${item.id}.`, error);
  };
  audio.addEventListener("ended", finish, { once: true });
  audio.addEventListener("error", () => reportError(new Error(`Failed to load ${item.audio}`)), { once: true });
  audio.play().catch(reportError);
}

function stopWordMatchAudio() {
  if (wordMatchAudio) {
    wordMatchAudio.pause();
    wordMatchAudio.currentTime = 0;
    wordMatchAudio = null;
  }
  wordMatchAudioButton?.classList.remove("is-speaking");
  wordMatchAudioButton = null;
}

function renderWordMatchCategory(category) {
  const { exercise } = wordMatchSession;
  const language = exercise.language || "ar";
  const direction = language === "ar" ? "rtl" : "ltr";
  const wordLabel = exercise.wordLabel || "Perkataan";
  const pictureLabel = exercise.pictureLabel || "Gambar";
  return `<section class="match-category match-category-${escapeHtml(category.tone)}" data-match-category="${escapeHtml(category.id)}" aria-labelledby="match-category-${escapeHtml(category.id)}">
    <h2 id="match-category-${escapeHtml(category.id)}">${escapeHtml(category.title)}</h2>
    <div class="match-column-labels" aria-hidden="true"><span>${escapeHtml(wordLabel)}</span><span>${escapeHtml(pictureLabel)}</span></div>
    <div class="match-board-stage">
      <svg class="match-connections" aria-hidden="true"></svg>
      <div class="match-columns">
        <div class="match-word-list" role="group" aria-label="${escapeHtml(wordLabel)} ${escapeHtml(category.title)}">
          ${category.words.map((item) => {
            const matched = Boolean(wordMatchSession.matches[item.id]);
            const selected = wordMatchSession.selectedWord?.itemId === item.id;
            const word = item.word || item.arabic;
            return `<button class="match-word${selected ? " is-selected" : ""}${matched ? " is-matched" : ""}${item.wordImage ? " has-image" : ""}" type="button" data-category-id="${escapeHtml(category.id)}" data-match-word="${escapeHtml(item.id)}" aria-pressed="${selected}" aria-label="Pilih ${escapeHtml(wordLabel.toLowerCase())}: ${escapeHtml(word)}" lang="${escapeHtml(language)}" dir="${direction}" draggable="${!matched}">
              <span class="match-word-label">${item.wordImage ? `<img class="match-word-image" src="${escapeHtml(item.wordImage)}" alt="" width="96" height="58" /><span class="match-word-caption">${escapeHtml(word)}</span>` : escapeHtml(word)}</span><span class="match-word-dot" aria-hidden="true"></span>
            </button>`;
          }).join("")}
        </div>
        <div class="match-picture-list" role="group" aria-label="${escapeHtml(pictureLabel)} ${escapeHtml(category.title)}">
          ${category.pictures.map((item) => {
            const matched = Boolean(wordMatchSession.matches[item.id]);
            return `<button class="match-picture${matched ? " is-matched" : ""}" type="button" data-category-id="${escapeHtml(category.id)}" data-match-target="${escapeHtml(item.id)}" aria-label="${escapeHtml(pictureLabel)}: ${escapeHtml(item.meaning)}"${matched ? " disabled" : ""}>
              <span class="match-picture-dot" aria-hidden="true"></span><img src="${escapeHtml(item.image)}" alt="" width="112" height="66" />
            </button>`;
          }).join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function selectWordMatch(categoryId, itemId) {
  if (wordMatchSession.matches[itemId]) return;
  if (wordMatchSession.selectedWord?.itemId === itemId) {
    wordMatchSession.selectedWord = null;
    wordMatchSession.feedback = "Pilihan dibatalkan. Pilih satu perkataan untuk bermula.";
    wordMatchSession.feedbackTone = "";
  } else {
    const item = wordMatchSession.exercise.categories
      .find((category) => category.id === categoryId)
      ?.items.find((entry) => entry.id === itemId);
    wordMatchSession.selectedWord = { categoryId, itemId };
    wordMatchSession.feedback = `Dipilih: ${item.word || item.arabic}. Sekarang pilih gambar yang sepadan.`;
    wordMatchSession.feedbackTone = "";
  }
  updateWordMatchFeedback();
  document.querySelectorAll("[data-match-word]").forEach((button) => {
    const selected = button.dataset.matchWord === wordMatchSession.selectedWord?.itemId;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function tryWordMatch(categoryId, targetId, draggedWord = null) {
  const selectedWord = draggedWord || wordMatchSession.selectedWord;
  if (!selectedWord) {
    wordMatchSession.feedback = `Pilih dahulu satu ${wordMatchSession.exercise.wordLabel?.toLowerCase() || "perkataan"}.`;
    wordMatchSession.feedbackTone = "wrong";
    updateWordMatchFeedback();
    return;
  }
  if (selectedWord.categoryId !== categoryId) {
    wordMatchSession.feedback = "Padankan pilihan dengan gambar dalam bahagian yang sama.";
    wordMatchSession.feedbackTone = "wrong";
    updateWordMatchFeedback();
    return;
  }
  if (selectedWord.itemId !== targetId) {
    wordMatchSession.feedback = "Belum tepat. Cuba padanan lain.";
    wordMatchSession.feedbackTone = "wrong";
    playGameFeedback(false);
    updateWordMatchFeedback();
    return;
  }

  wordMatchSession.matches[targetId] = true;
  wordMatchSession.selectedWord = null;
  const item = wordMatchSession.exercise.categories
    .find((category) => category.id === categoryId)
    .items.find((entry) => entry.id === targetId);
  wordMatchSession.feedback = `Bagus! Padanan betul: ${item.word || item.arabic} — ${item.meaning}.`;
  wordMatchSession.feedbackTone = "correct";
  playGameFeedback(true);
  renderWordMatchGame();
}

function updateWordMatchFeedback() {
  const feedback = document.querySelector("#word-match-feedback");
  if (!feedback) return;
  feedback.textContent = wordMatchSession.feedback;
  feedback.className = `match-feedback${wordMatchSession.feedbackTone ? ` is-${wordMatchSession.feedbackTone}` : ""}`;
}

function drawWordMatchConnections() {
  if (!wordMatchSession) return;
  const namespace = "http://www.w3.org/2000/svg";
  wordMatchSession.categories.forEach((category) => {
    const panel = document.querySelector(`[data-match-category="${category.id}"]`);
    const svg = panel?.querySelector(".match-connections");
    if (!panel || !svg) return;
    const stageRect = svg.parentElement.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.replaceChildren();
    category.items.forEach((item) => {
      if (!wordMatchSession.matches[item.id]) return;
      const source = panel.querySelector(`[data-match-word="${item.id}"] .match-word-dot`);
      const target = panel.querySelector(`[data-match-target="${item.id}"] .match-picture-dot`);
      if (!source || !target) return;
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const line = document.createElementNS(namespace, "line");
      line.setAttribute("x1", String(sourceRect.left + sourceRect.width / 2 - stageRect.left));
      line.setAttribute("y1", String(sourceRect.top + sourceRect.height / 2 - stageRect.top));
      line.setAttribute("x2", String(targetRect.left + targetRect.width / 2 - stageRect.left));
      line.setAttribute("y2", String(targetRect.top + targetRect.height / 2 - stageRect.top));
      line.classList.add("match-connection");
      svg.append(line);
    });
  });
}

function renderWordMatchCategoryComplete() {
  const { exercise, categories, categoryIndex } = wordMatchSession;
  const category = categories[categoryIndex];
  const isLastCategory = categoryIndex === categories.length - 1;
  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="match-game-page" aria-labelledby="word-match-section-title">
      <article class="game-board game-result match-category-result">
        <p class="eyebrow">Bahagian ${categoryIndex + 1} selesai</p>
        <div class="game-result-stars" aria-hidden="true">★ ★ ★</div>
        <h1 id="word-match-section-title">${escapeHtml(category.title)} selesai!</h1>
        <p>Semua ${category.items.length} perkataan sudah dipadankan dengan betul.</p>
        <p class="game-result-note">${isLastCategory ? "Hebat! Semua bahagian sudah selesai." : "Bagus! Bersedia untuk bahagian seterusnya."}</p>
        <button class="button" id="word-match-next-category" type="button">${isLastCategory ? "Selesai semua bahagian" : "Bahagian seterusnya →"}</button>
      </article>
    </section>`;
  document.querySelector("#word-match-next-category")?.addEventListener("click", () => {
    wordMatchSession.categoryIndex += 1;
    wordMatchSession.matches = {};
    wordMatchSession.selectedWord = null;
    if (wordMatchSession.categoryIndex >= categories.length) {
      renderWordMatchResult();
      return;
    }
    wordMatchSession.feedback = "Pilih satu perkataan untuk bermula.";
    wordMatchSession.feedbackTone = "";
    renderWordMatchGame();
  });
}

function renderWordMatchResult() {
  const exercise = wordMatchSession.exercise;
  const total = exercise.categories.reduce((count, category) => count + category.items.length, 0);
  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="match-game-page" aria-labelledby="word-match-result-title">
      <article class="game-board game-result">
        <p class="eyebrow">Aktiviti selesai</p>
        <div class="game-result-stars" aria-hidden="true">★ ★ ★</div>
        <h1 id="word-match-result-title">Syabas, semua sepadan!</h1>
        <p>Semua ${total} perkataan dalam ${exercise.categories.length} bahagian berjaya dipadankan.</p>
        <p class="game-result-note">Main lagi untuk cuba susunan yang baharu.</p>
        <button class="button" id="word-match-play-again" type="button">↻ Main lagi</button>
      </article>
    </section>`;
  document.querySelector("#word-match-play-again")?.addEventListener("click", () => startWordMatchGame(exercise.id));
}

function playGameQuestionAudio(question, button) {
  const language = question.category === "English" ? "en-US" : "ms-MY";
  speakGameText(question.prompt, language, button, "Dengar soalan");
}

function playGameAnswerAudio(question, option, button) {
  if (!option) return;
  if (option.pronunciationItem?.audio) {
    const item = option.pronunciationItem;
    playGameAudioFile(item.audio, button);
    return;
  }
  if (option.pronunciationItem?.pronunciation) {
    const item = option.pronunciationItem;
    speakArabic(item.arabic, item.title, item.pronunciation, button, "Dengar");
    return;
  }
  const language = question.category === "English" ? "en-US" : "ms-MY";
  speakGameText(option.label, language, button, "Dengar");
}

function playGameAudioFile(source, button) {
  const audio = new Audio(source);
  if (button) button.textContent = "Mendengar";
  audio.addEventListener("ended", () => {
    if (button) button.textContent = "Dengar";
  }, { once: true });
  audio.addEventListener("error", () => {
    showAudioError(button);
  }, { once: true });
  audio.play().catch(() => {
    showAudioError(button);
  });
}

function speakGameText(text, language, button, idleLabel) {
  if (!("speechSynthesis" in window)) {
    showAudioError(button);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = language.startsWith("ms") ? getMalayVoice() : getVoice(language);
  if (voice) utterance.voice = voice;
  utterance.lang = language;
  utterance.rate = 0.78;
  utterance.pitch = 1;
  utterance.onstart = () => { if (button) button.textContent = "Mendengar"; };
  utterance.onend = () => { if (button) button.textContent = idleLabel; };
  utterance.onerror = () => showAudioError(button, idleLabel);
  window.speechSynthesis.speak(utterance);
}

function showAudioError(button, idleLabel = "Dengar") {
  if (!button) return;
  button.textContent = "Suara tidak tersedia";
  button.title = "Semak kelantangan telefon dan cuba lagi.";
  window.setTimeout(() => {
    button.textContent = idleLabel;
    button.title = "";
  }, 2200);
}

function playGameFeedback(isCorrect) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const audioContext = new AudioContextClass();
  const start = audioContext.currentTime;
  const notes = isCorrect ? [[880, 0], [1320, 0.12]] : [[220, 0]];
  notes.forEach(([frequency, offset]) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = isCorrect ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, start + offset);
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(isCorrect ? 0.13 : 0.08, start + offset + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.22);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + 0.24);
  });
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
      <button class="hero-note audio-card" id="home-quote-audio" type="button" aria-label="Dengar doa dan terjemahan">
        <span aria-hidden="true">رَبِّ زِدْنِي عِلْمًا</span>
        <p>Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.</p>
      </button>
    </section>
    <div class="home-tabs" role="tablist" aria-label="Pilih bahagian utama">
      <button class="home-tab" id="home-tab-learn" type="button" role="tab" aria-controls="home-panel-learn" data-home-tab="learn">Belajar</button>
      <button class="home-tab" id="home-tab-games" type="button" role="tab" aria-controls="home-panel-games" data-home-tab="games">Games</button>
    </div>
    <section class="home-tab-panel" id="home-panel-learn" role="tabpanel" aria-labelledby="home-tab-learn">
      <div class="section-heading">
        <h2 id="topics-title">Mari belajar</h2>
        <span class="progress-summary">${totalDone} daripada ${totalItems} sudah diulang</span>
      </div>
      <div class="topic-grid">
        ${content.topics.map(renderTopicCard).join("")}
      </div>
    </section>
    <section class="home-tab-panel" id="home-panel-games" role="tabpanel" aria-labelledby="home-tab-games" aria-label="Games">
      <div class="section-heading"><h2>Games</h2></div>
      <div class="game-launch-list" aria-label="Senarai games">
        <a class="game-launch peach" href="#set-1-game">
          <span class="game-launch-icon" aria-hidden="true">✦</span>
          <h2>Misi Set 1</h2>
          <p>12 cabaran ringkas Bahasa Melayu, English, Matematik, Sains, Jawi dan Bahasa Arab.</p>
          <span class="game-launch-arrow" aria-hidden="true">→</span>
        </a>
        <a class="game-launch sky" href="#math-counting-game">
          <span class="game-launch-icon" aria-hidden="true">1·2</span>
          <h2>Kira dan Pilih</h2>
          <p>Kira gambar dan pilih jawapan yang betul daripada tiga pilihan.</p>
          <span class="game-launch-arrow" aria-hidden="true">→</span>
        </a>
        <a class="game-launch sage" href="#math-addition-game">
          <span class="game-launch-icon" aria-hidden="true">＋</span>
          <h2>Jom Tambah</h2>
          <p>Tambah kumpulan objek dan pilih jawapan yang betul daripada tiga pilihan.</p>
          <span class="game-launch-arrow" aria-hidden="true">→</span>
        </a>
        ${content.exercises.map((exercise, index) => `<a class="game-launch ${index % 3 === 0 ? "sky" : index % 3 === 1 ? "sage" : "peach"}" href="#word-match/${escapeHtml(exercise.id)}">
          <span class="game-launch-icon" aria-hidden="true">${index === 0 ? "↔" : "✦"}</span>
          <h2>${escapeHtml(exercise.title)}</h2>
          <p>${escapeHtml(exercise.description)}</p>
          <span class="game-launch-arrow" aria-hidden="true">→</span>
        </a>`).join("")}
      </div>
    </section>`;
  const homeTabs = [...document.querySelectorAll("[data-home-tab]")];
  const activateHomeTab = (tab, focus = false) => {
    activeHomeTab = tab;
    homeTabs.forEach((button) => {
      const selected = button.dataset.homeTab === tab;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.querySelector("#home-panel-learn").hidden = tab !== "learn";
    document.querySelector("#home-panel-games").hidden = tab !== "games";
    if (focus) document.querySelector(`[data-home-tab="${tab}"]`)?.focus();
  };
  homeTabs.forEach((button, index) => {
    button.addEventListener("click", () => activateHomeTab(button.dataset.homeTab));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? homeTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : homeTabs.length - 1)) % homeTabs.length;
      activateHomeTab(homeTabs[nextIndex].dataset.homeTab, true);
    });
  });
  activateHomeTab(activeHomeTab);
  document.querySelector("#home-quote-audio")?.addEventListener("click", playHomeQuote);
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
  if (topic.id === "colors") {
    renderColorsTopic(topic, topic.items[0]);
    return;
  }
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

function renderColorsTopic(topic, selectedItem) {
  app.innerHTML = `
    <a class="back-link" href="#home">← Kembali ke utama</a>
    <section class="topic-header">
      <div><p class="eyebrow">${escapeHtml(topic.eyebrow)}</p><h1>${escapeHtml(topic.title)}</h1><p class="intro">${escapeHtml(topic.description)}</p></div>
      <span class="topic-count">${topicProgress(topic)} / ${topic.items.length} sudah diulang</span>
    </section>
    <div class="color-picker" aria-label="Pilih warna">
      ${topic.items.map((item) => `<button class="color-picker-button${item.id === selectedItem.id ? " is-selected" : ""}" type="button" aria-label="Pilih ${escapeHtml(item.title)}" aria-pressed="${item.id === selectedItem.id}" style="--picker-color: ${escapeHtml(item.accent)}"></button>`).join("")}
    </div>
    <section class="color-detail-panel" id="color-detail" aria-live="polite"></section>
    <section class="lesson-grid color-grid" aria-label="Senarai ${escapeHtml(topic.title)}">
      ${topic.items.map((item) => renderLessonCard(topic, item)).join("")}
    </section>`;
  renderColorPanel(topic, selectedItem);
  document.querySelectorAll(".color-picker-button").forEach((button, index) => {
    button.addEventListener("click", () => renderColorsTopic(topic, topic.items[index]));
  });
  document.querySelectorAll(".color-grid .lesson-card").forEach((card, index) => {
    card.href = "#colors";
    card.addEventListener("click", (event) => {
      event.preventDefault();
      renderColorPanel(topic, topic.items[index]);
      document.querySelector("#color-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderColorPanel(topic, item) {
  const done = isRevised(item.id);
  const panel = document.querySelector("#color-detail");
  if (!panel) return;
  panel.innerHTML = `
    <div class="color-panel-swatch" style="--color-accent: ${escapeHtml(item.accent)}"><div class="color-swatch"></div></div>
    <div class="color-panel-copy">
      <p class="eyebrow">Warna · ${String(item.number).padStart(2, "0")}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="arabic-text" lang="ar">${escapeHtml(item.arabic)}</p>
      <p class="transliteration">${escapeHtml(item.transliteration)}</p>
      <div class="detail-actions">
        <button class="button" id="speak-button" type="button">◖ Dengar sebutan</button>
        <button class="button secondary" id="revised-button" type="button" aria-pressed="${done}">${done ? "✓ Sudah diulang" : "Tanda sudah diulang"}</button>
      </div>
    </div>`;
  document.querySelector("#revised-button").addEventListener("click", () => {
    revised[item.id] = !isRevised(item.id);
    saveProgress();
    renderColorPanel(topic, item);
    renderColorsTopic(topic, item);
  });
  document.querySelector("#speak-button").addEventListener("click", () => playArabic(item));
}

function renderLessonCard(topic, item) {
  const done = isRevised(item.id);
  const href = topic.id === "colors" ? "#colors" : `#${escapeHtml(topic.id)}/${escapeHtml(item.id)}`;
  return `<a class="lesson-card" href="${href}">
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
    ? `<div class="detail-visual has-image${topic.id === "family" || topic.id === "body" ? " family-visual" : ""}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" width="768" height="960" /></div>`
    : item.accent
      ? `<div class="detail-visual" style="background: ${escapeHtml(item.accent)}"><div class="color-swatch" style="background: ${escapeHtml(item.accent)}"></div></div>`
      : `<div class="detail-visual"><div class="visual-placeholder"><div class="large-arabic" lang="ar">${escapeHtml(item.arabic || "")}</div><p>Ruang untuk kad pembelajaran akan diisi dalam fasa kandungan.</p></div></div>`;
  const arabicMarkup = item.audio
    ? `<button class="arabic-audio" id="arabic-audio-button" type="button" lang="ar" aria-label="Dengar bacaan ${escapeHtml(item.title)}">${escapeHtml(item.arabic || "")}</button>`
    : `<p class="arabic-text" lang="ar">${escapeHtml(item.arabic || "")}</p>`;
  app.innerHTML = `
    <a class="back-link" href="#${escapeHtml(topic.id)}">← Semua ${escapeHtml(topic.title)}</a>
    <article class="detail-layout">
      ${imageMarkup}
      <div class="detail-copy">
        <p class="eyebrow">${escapeHtml(topic.title)} · ${String(item.number).padStart(2, "0")}</p>
        <h1>${escapeHtml(item.title)}</h1>
        ${arabicMarkup}
        ${item.transliteration ? `<p class="transliteration">${escapeHtml(item.transliteration)}</p>` : ""}
        <p class="translation">${escapeHtml(item.translation || "Baca dengan perlahan dan ulang bersama ibu atau ayah.")}</p>
        <div class="detail-actions">
          ${topic.id === "colors" ? '<button class="button" id="speak-button" type="button">◖ Dengar sebutan</button>' : topic.id === "hadis" ? '<button class="button" id="speak-button" type="button">◖ Dengar Hadis</button>' : item.pronunciation ? '<button class="button" id="speak-button" type="button">◖ Dengar sebutan</button>' : item.audio ? '<button class="button" id="speak-button" type="button">◖ Dengar audio</button>' : ""}
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
    visual.innerHTML = `<div class="visual-placeholder"><div class="large-arabic" lang="ar">${escapeHtml(item.arabic || "")}</div></div>`;
  }, { once: true });
  document.querySelector("#revised-button").addEventListener("click", () => toggleRevised(item.id, topic));
  document.querySelector("#speak-button")?.addEventListener("click", () => playArabic(item));
  document.querySelector("#arabic-audio-button")?.addEventListener("click", () => playArabic(item));
}

function toggleRevised(itemId, topic) {
  revised[itemId] = !isRevised(itemId);
  saveProgress();
  const hash = window.location.hash.slice(1).split("/");
  renderLesson(topic, getLesson(topic, hash[1]));
}

function speakArabic(text, label, fallbackText = text, button = document.querySelector("#speak-button"), idleLabel = "◖ Dengar sebutan") {
  if (!("speechSynthesis" in window)) {
    window.alert("Suara Arab tidak disokong oleh pelayar ini.");
    return;
  }
  window.speechSynthesis.cancel();
  const arabicVoice = getArabicVoice();
  const utterance = new SpeechSynthesisUtterance(arabicVoice ? text : fallbackText);
  if (arabicVoice) {
    utterance.voice = arabicVoice;
    utterance.lang = "ar-SA";
  } else {
    const malayVoice = getMalayVoice();
    if (malayVoice) utterance.voice = malayVoice;
    utterance.lang = "ms-MY";
  }
  utterance.rate = 0.72;
  utterance.pitch = 1;
  utterance.onstart = () => { if (button) button.textContent = `◖ Mendengar ${label}`; };
  utterance.onend = () => { if (button) button.textContent = idleLabel; };
  utterance.onerror = () => showAudioError(button, idleLabel);
  window.speechSynthesis.speak(utterance);
}

function playHomeQuote() {
  const button = document.querySelector("#home-quote-audio");
  if (!button) return;
  const files = ["assets/audio/home/dua-ilmu-ar.mp3", "assets/audio/home/dua-ilmu-ms.mp3"];
  let index = 0;
  const playNext = () => {
    if (index >= files.length) {
      button.classList.remove("is-playing");
      return;
    }
    const audio = new Audio(files[index]);
    audio.playbackRate = 0.75;
    index += 1;
    button.classList.add("is-playing");
    audio.addEventListener("ended", playNext, { once: true });
    audio.addEventListener("error", () => { button.classList.remove("is-playing"); }, { once: true });
    audio.play().catch(() => { button.classList.remove("is-playing"); });
  };
  playNext();
}

function playArabic(item) {
  const button = document.querySelector("#speak-button");
  const idleLabel = item.id.startsWith("hadis-") ? "◖ Dengar Hadis" : item.pronunciation ? "◖ Dengar sebutan" : item.id.startsWith("family-") || item.id.startsWith("body-") ? "◖ Dengar audio" : "◖ Dengar sebutan";
  if (item.pronunciation) {
    speakArabic(item.arabic, item.title, item.pronunciation, button, idleLabel);
    return;
  }
  const audioFiles = [item.introAudio, item.audio].filter(Boolean);
  if (!audioFiles.length) {
    speakArabic(item.arabic, item.title);
    return;
  }
  let audioIndex = 0;
  const playNextAudio = () => {
    if (audioIndex >= audioFiles.length) {
      button.textContent = idleLabel;
      return;
    }
    const audio = new Audio(audioFiles[audioIndex]);
    audio.playbackRate = 0.75;
    button.textContent = `◖ Mendengar ${item.title}`;
    audioIndex += 1;
    audio.addEventListener("ended", playNextAudio, { once: true });
    audio.addEventListener("error", () => {
      if (audioIndex < audioFiles.length) playNextAudio();
      else button.textContent = idleLabel;
    }, { once: true });
    audio.play().catch(() => {
      if (audioIndex < audioFiles.length) playNextAudio();
      else button.textContent = idleLabel;
    });
  };
  playNextAudio();
}

function getArabicVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.toLowerCase() === "ar-sa")
    || voices.find((voice) => voice.lang.toLowerCase().startsWith("ar"));
}

function getMalayVoice() {
  return getVoice("ms-MY")
    || getVoice("ms")
    || getVoice("id-ID")
    || getVoice("id");
}

function getVoice(language) {
  const voices = window.speechSynthesis.getVoices();
  const normalizedLanguage = language.toLowerCase();
  return voices.find((voice) => voice.lang.toLowerCase() === normalizedLanguage)
    || voices.find((voice) => voice.lang.toLowerCase().startsWith(`${normalizedLanguage}-`))
    || voices.find((voice) => voice.lang.toLowerCase().startsWith(normalizedLanguage));
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}

function renderRoute() {
  const [topicId, lessonId] = window.location.hash.slice(1).split("/");
  const route = topicId || "home";
  const requestedWordMatchExerciseId = topicId === "word-match" ? lessonId || "arabic-word-picture" : null;
  const isMathGame = topicId === "math-counting-game" || topicId === "math-addition-game";
  const enteringGame = (route === "set-1-game" || isMathGame) && activeRoute !== route;
  const enteringWordMatch = route === "word-match" && activeRoute !== route;
  activeRoute = route;
  if (route !== "word-match") stopWordMatchAudio();
  if (enteringGame) gameSession = null;
  if (enteringWordMatch) wordMatchSession = null;
  if (topicId === "set-1-game") {
    renderSetOneGame();
  } else if (isMathGame) {
    if (!gameSession || gameSession.id !== topicId) startMathGame(topicId);
    else renderSetOneGame();
  } else if (topicId === "word-match") {
    if (!wordMatchSession || wordMatchSession.exercise.id !== requestedWordMatchExerciseId) {
      startWordMatchGame(requestedWordMatchExerciseId);
    } else {
      renderWordMatchGame();
    }
  } else if (!topicId || topicId === "home") {
    renderHome();
  } else {
    const topic = getTopic(topicId);
    const lesson = getLesson(topic, lessonId);
    if (!topic) renderHome();
    else if (topic.id === "colors") {
      if (lessonId) history.replaceState(null, "", `${window.location.pathname}${window.location.search}#colors`);
      renderTopic(topic);
    } else if (!lessonId || !lesson) renderTopic(topic);
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
    window.addEventListener("resize", drawWordMatchConnections);
    renderRoute();
  } catch (error) {
    app.innerHTML = `<div class="empty-state"><h2>Belum dapat dibuka</h2><p>Pastikan aplikasi dibuka melalui GitHub Pages atau pelayan web tempatan.</p></div>`;
    console.error(error);
  }
}

start();