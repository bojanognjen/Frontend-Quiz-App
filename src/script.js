let options = document.querySelectorAll(".main__options > div");
const preview = document.querySelector('.preview');

let globalQuestions = null;
let currentCategory = null;
let currentQuestionIndex = 0;
let score = 0;

function resetQuizState(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    score = 0;
  }

function handleCategoryClick(option) {
    const category = option.querySelector("span").textContent;
    resetQuizState(category);
    startQuiz();
  }

options.forEach(option => {
  option.addEventListener("click", () => handleCategoryClick(option));
});

async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // If the response status is not in the range 200-299,
        // throw an error to be caught in the catch block
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON from the response
      return data; // Return the parsed data
    } catch (error) {
      console.error('Error fetching data:', error);
      // You can choose to rethrow the error or return a default value
      throw error;
    }
  }

  
  function listQuestions(questions) {
    showQuestion(questions[currentQuestionIndex]);
  }

async function startQuiz() {
    try {
        let quizData = await fetchData('data.json');
        let quizzes = quizData.quizzes;
        currentCategory == 'Javascript' ? currentCategory = 'JavaScript' : null;
        let quizIndex = quizzes.findIndex(item => item.title == currentCategory);
        if (!quizData || quizData.length === 0) {
          console.error('No quiz data available.');
          return;
        }
        globalQuestions = quizzes[quizIndex].questions;
        showQuestion(globalQuestions[currentQuestionIndex])
    } catch (error) {
        console.error('Failed to start quiz:', error);
    }
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  function showQuestion(question) {
    console.log(question.options.map((opt, idx) => 
        `<li data-index="${idx}">${opt}</li>`
      ).join(""));
    preview.innerHTML = `
      <div class="question-container">
        <p>Question ${currentQuestionIndex + 1} of ${globalQuestions.length}</p>
        <h2>${question.question}</h2>
        <ul class="answers">
          ${question.options.map((opt, idx) => 
            `<li data-index="${idx}">${escapeHTML(opt)}</li>`
          ).join("")}
        </ul>
        <button id="submitAnswer">Submit answer</button>
      </div>
    `;
  
    document.querySelectorAll(".answers li").forEach(li => {
      li.addEventListener("click", () => {
        document.querySelectorAll(".answers li").forEach(el => el.classList.remove("selected"));
        li.classList.add("selected");
      });
    });
  
    document.getElementById("submitAnswer").addEventListener("click", () => {
      const selected = document.querySelector(".answers li.selected");
      if (!selected) return alert("Please select an answer!");
    //   const selectedIndex = parseInt(selected.dataset.index);
      if (selected.textContent == question.answer) {
        score++;
      }
      console.log(score);
  
      currentQuestionIndex++;
      if (currentQuestionIndex < globalQuestions.length) {
        listQuestions(globalQuestions);
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    const main = document.querySelector(".main");
    main.innerHTML = `
      <div class="result">
        <h2>Quiz Completed</h2>
        <p>You scored ${score} out of 10</p>
        <button id="restart">Restart</button>
      </div>
    `;
    preview.style.display = 'none';
  
    document.getElementById("restart").addEventListener("click", () => {
      location.reload(); // Or show the category screen again
    });
  }
  
  