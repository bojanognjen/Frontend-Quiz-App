let headerCategory = document.querySelector('.header__category');
let categoryImg = document.querySelector('.category__img');
let categoryTitle = document.querySelector('.category__title');
let iconFrame = document.querySelector('.icon__frame');

const main = document.querySelector('.main');
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

function showHeader(quiz) {
    headerCategory.style.display = 'flex';
    categoryTitle.textContent = quiz.title;
    categoryImg.setAttribute('src',`${quiz.icon}`);
    categoryImg.classList.add("icon");

    switch (quiz.title.toLowerCase()) {
      case "html":
        iconFrame.style.backgroundColor = 'hsl(27deg 100% 96%)';
        break;
      case "css":
        iconFrame.style.backgroundColor = 'hsl(151deg 88% 94%)';
        break;
      case "javascript":
        iconFrame.style.backgroundColor = 'hsl(225deg 100% 96%)';
        break;
      case "accessibility":
        iconFrame.style.backgroundColor = 'hsl(278deg 100% 95%)';
        break;
    }
    
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
        main.style.display = 'none';
        showHeader(quizzes[quizIndex]);
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
    preview.innerHTML = `
      <div class="question-container">
        <p>Question ${currentQuestionIndex + 1} of ${globalQuestions.length}</p>
        <h2 class="question__title">${question.question}</h2>
        <div class="main__progress"></div>
        <ul class="answers">
          ${question.options.map((opt, idx) => 
            `<li data-index="${idx}">${escapeHTML(opt)}</li>`
          ).join("")}
        </ul>
        <button id="submitAnswer">Submit answer</button>
      </div>
    `;

    // let progressBar = document.querySelector('.main__progress');
    preview.classList.add('main');

    let iterationParagraph = document.querySelector('.question-container p');
    iterationParagraph.classList.add("main__subtitle");

    // let questionTitle = document.querySelector('.question-container h2');
    // questionTitle.style.margin = ""
  
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
  
      currentQuestionIndex++;

      // setInterval(()=> {
      //   const computedStyle = getComputedStyle(progressBar);
      //   const width = parseFloat(computedStyle.getPropertyValue
      //     ('--width')) || 0
      //     progressBar.style.setProperty('--width', width + .1)
      // }, 5);

      if (currentQuestionIndex < globalQuestions.length) {
        listQuestions(globalQuestions);
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    const main = document.querySelector(".main");
    main.style.display = 'block';
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
  
  