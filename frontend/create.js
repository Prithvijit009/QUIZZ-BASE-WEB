let questionCount = 0;

// Add question block dynamically
function addQuestion() {
  questionCount++;
  const container = document.getElementById("questionsContainer");

  const div = document.createElement("div");
  div.className = "question-block";
  div.innerHTML = `
    <h4>Question ${questionCount}</h4>
    <input type="text" name="question${questionCount}" placeholder="Write your question" required><br>

    <input type="text" name="opt1_${questionCount}" placeholder="Option 1" required>
    <input type="radio" name="correct_${questionCount}" value="0" required> ✅<br>

    <input type="text" name="opt2_${questionCount}" placeholder="Option 2" required>
    <input type="radio" name="correct_${questionCount}" value="1"> ✅<br>

    <input type="text" name="opt3_${questionCount}" placeholder="Option 3" required>
    <input type="radio" name="correct_${questionCount}" value="2"> ✅<br>

    <input type="text" name="opt4_${questionCount}" placeholder="Option 4" required>
    <input type="radio" name="correct_${questionCount}" value="3"> ✅<br>

    <hr>
  `;
  container.appendChild(div);
}

// Handle quiz form submission
document.getElementById("quizForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const quiz = [{
    question: "💖 তুমি তোমার Best Friend কে কতটা ভালোবাসো?",
    options: ["অনেক বেশি 🥰", "একটু একটু 😅", "ভালোই 🤗", "নেই তেমন 😐"],
    correct: 0
  },
  {
    question: "🌍 তোমার Best Friend এর সাথে কোথায় ঘুরতে যেতে চাও?",
    options: ["Darjeeling 🌄", "Goa 🏖️", "Cox's Bazar 🌊", "Bandarban ⛰️"],
    correct: 2
  },
  {
    question: "🍝 Best Friend এর সাথে কী খেতে ভালো লাগে?",
    options: ["Biriyani 🍗", "Pizza 🍕", "Fuchka 🌰", "Ice Cream 🍦"],
    correct: 0
  },
  {
    question: "🎬 কোন টাইপ মুভি একসাথে দেখতে পছন্দ করো?",
    options: ["Romantic 💕", "Comedy 😂", "Horror 👻", "Action 🔫"],
    correct: 1
  },
  {
    question: "📸 তোমার Best Friend এর কোন জিনিসটা সবচেয়ে প্রিয়?",
    options: ["হাসি 😊", "চোখ 👀", "ভয়েস 🎙️", "ব্যবহার 🤝"],
    correct: 3
  },
  {
    question: "🎁 যদি কিছু গিফট করতে পারো, কী দেবে?",
    options: ["Watch ⌚", "Perfume 🌸", "T-Shirt 👕", "Book 📚"],
    correct: 1
  },
  {
    question: "📞 Best Friend এর সাথে দিনে কয়বার কথা বলো?",
    options: ["১ বার ☝️", "২-৩ বার 📲", "অনেকবার 🔁", "প্রায় বলি না 🤐"],
    correct: 2
  },
  {
    question: "🕊️ তুমি কি ওর সাথে মন খুলে সব কথা বলতে পারো?",
    options: ["হ্যাঁ, সবই বলি 🥹", "কিছুটা 🤔", "খুব কম 😶", "না 😐"],
    correct: 0
  },
  {
    question: "🎮 কোনটা বেশি পছন্দ করো ওর সাথে?",
    options: ["আলাপ করা 🗣️", "গেম খেলা 🎮", "Movies দেখা 🎥", "চুপচাপ থাকা 🙊"],
    correct: 1
  },
  {
    question: "💍 তুমি কি তোমার Best Friend কে Biye করতে চাও?",
    options: ["হ্যাঁ 😍", "না 🙅‍♂️", "সময় বলে দেবে ⏳", "ভেবে দেখিনি 🤔"],
    correct: 0
  }
];

  for (let i = 1; i <= questionCount; i++) {
    const q = formData.get(`question${i}`);
    const options = [
      formData.get(`opt1_${i}`),
      formData.get(`opt2_${i}`),
      formData.get(`opt3_${i}`),
      formData.get(`opt4_${i}`)
    ];
    const correct = parseInt(formData.get(`correct_${i}`));
    quiz.push({ question: q, options, correct });
  }

  // Send to backend
  const res = await fetch("/create-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quiz })
  });

  const data = await res.json();

  // Show generated quiz link
  const quizId = data.quiz_id;
  const link = `${window.location.origin}/play.html?quiz_id=${quizId}`;
  const linkBox = document.getElementById("quizLink");

  linkBox.innerHTML = `
    <p><strong>🎉 Quiz Created!</strong></p>
    <a href="${link}" id="linkOutput" target="_blank">${link}</a><br>
    <button onclick="copyToClipboard('${link}')">📋 Copy Link</button>
  `;
  linkBox.style.display = "block";
});

// Copy link to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert("Link copied! ✅"))
    .catch(() => alert("Failed to copy link."));
}
