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
  const quiz = [];

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
