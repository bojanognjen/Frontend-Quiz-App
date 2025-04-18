const main = document.querySelector('.main');
let options = document.querySelectorAll(".option");
const preview = document.querySelector('.preview');
const switchInput = document.querySelector('.form-check-input');
const body = document.querySelector('body');
const mainSubtitle = document.querySelector('.main__subtitle');
let light = document.querySelectorAll('.light');
let dark = document.querySelectorAll('.dark');

let quizGlobal = null;
let globalQuestions = null;
let currentCategory = null;
let currentQuestionIndex = 0;
let score = 0;

function changeBackground() {
  let resultContainer = document.querySelector('.result__container');
  let resultParagraph = document.querySelector('.result_container p');
  console.log(resultParagraph);
  let currentIndexParagraph = document.querySelector('.question-container p');
  let progressBar = document.querySelector('.main__progress');
  let answers = document.querySelectorAll('.answers li');
  let combinedOptions = [...options, ...answers];

  if (!switchInput.checked) {

    body.style.backgroundColor = 'hsl(220deg 38% 97%)';
    body.style.color = 'hsl(216deg 25% 25%)';
    combinedOptions.forEach(option => {
      option.style.backgroundColor = 'hsl(0deg 100% 100%)';
      option.style.color = 'hsl(216deg 25% 25%)';
    });
    mainSubtitle.style.color = 'hsl(219deg 13% 44%)';

    let bgImage = getComputedStyle(body).backgroundImage;
    let newImagePath = bgImage.replace('dark', 'light');
    body.style.backgroundImage = `${newImagePath}`;
    light.forEach(l => {
      l.style.display = 'none';
    });
    dark.forEach(d => {
      d.style.display = 'block';
    });

    if (progressBar || currentIndexParagraph) {
      currentIndexParagraph.style.color = 'hsl(219deg 13% 44%)';
      progressBar.style.backgroundColor = 'hsl(0deg 100% 100%)';
    }

    resultContainer ? resultContainer.style.backgroundColor = 'hsl(0deg 100% 100%)' : null;
    resultParagraph ? resultParagraph.style.color = 'hsl(219deg 13% 44%)' : null;

  } else {

    body.style.backgroundColor = 'hsl(216deg 25% 25%)';
    body.style.color = 'hsl(0deg 100% 100%)';
    combinedOptions.forEach(option => {
      option.style.backgroundColor = 'hsl(215deg 27% 32%)';
      option.style.color = 'hsl(0deg 100% 100%)';
    })
    mainSubtitle.style.color = 'hsl(216deg 47% 78%)';

    let bgImage = getComputedStyle(body).backgroundImage;
    let newImagePath = bgImage.replace('light', 'dark');
    body.style.backgroundImage = `${newImagePath}`;
    dark.forEach(d => {
      d.style.display = 'none';
    });
    light.forEach(l => {
      l.style.display = 'block';
    });
    
    if (progressBar || currentIndexParagraph) {
      currentIndexParagraph.style.color = 'hsl(216deg 47% 78%)';
      progressBar.style.backgroundColor = 'hsl(215deg 27% 32%)';
    }
    resultContainer ? resultContainer.style.backgroundColor = 'hsl(215deg 27% 32%)' : null;
    resultParagraph ? resultParagraph.style.color = 'hsl(216deg 47% 78%)' : null;

  }
}


switchInput.addEventListener('click', changeBackground);

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
  
  let headerCategory = document.querySelectorAll('.header__category');
  let categoryImg = document.querySelectorAll('.category__img');
  let categoryTitle = document.querySelectorAll('.category__title');
  let iconFrame = document.querySelectorAll('.icon__frame');

  headerCategory.forEach(el => {
    el.style.display = 'flex';
  });
  categoryTitle.forEach(el => {
    el.textContent = quiz.title;
  });
  categoryImg.forEach(el => {
    el.setAttribute('src', `${quiz.icon}`);
    el.classList.add("icon");
  });
    
  iconFrame.forEach(el => {
    switch (quiz.title.toLowerCase()) {
      case "html":
        el.style.backgroundColor = 'hsl(27deg 100% 96%)';
        break;
      case "css":
        el.style.backgroundColor = 'hsl(151deg 88% 94%)';
        break;
      case "javascript":
        el.style.backgroundColor = 'hsl(225deg 100% 96%)';
        break;
      case "accessibility":
        el.style.backgroundColor = 'hsl(278deg 100% 95%)';
        break;
    }
  });
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
        showQuestion(globalQuestions[currentQuestionIndex]);
        quizGlobal = quizzes[quizIndex];
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
        <h2 class="question__title">${escapeHTML(question.question)}</h2>
        <div class="main__progress"></div>
        <ul class="answers">
          ${question.options.map((opt, idx) => 
            `<li class="category__title" data-index="${idx}" data-label="${escapeHTML(opt)}">
                <div class="icon__frame option-frame"></div>
                ${escapeHTML(opt)}
            </li>`
          ).join("")}
          <button class="option category__title submitAnswer">Submit answer</button>
        </ul>
        <div class="alert-message">
          <img src="assets/images/icon-error.svg">
          <span class="alert-select category__title">Please select an answer</span>
        </div>
      </div>
    `;

    preview.classList.add('main');
    let li = document.querySelectorAll('.answers li');
    let divLi = document.querySelectorAll('.option-frame');

    for (let l of li) {
      l.classList.add('option');
    }

    let alphabet = ["A","B","C","D"];

    for (let i = 0; i < divLi.length; i++) {
      divLi[i].textContent = alphabet[i];
    }

    let iterationParagraph = document.querySelector('.question-container p');
    iterationParagraph.classList.add("main__subtitle");

    let progressBar = document.querySelector('.main__progress');
    let target = currentQuestionIndex * 10;
    progressBar.style.setProperty('--width', target-10);
   const intervalId = setInterval(()=> {
     const computedStyle = getComputedStyle(progressBar);
     const width = parseFloat(computedStyle.getPropertyValue('--width')) || 0;

     progressBar.style.setProperty('--width', width + .1);
     if (width >= target) {
       clearInterval(intervalId);
       return;               // exit early so you don’t bump past 100
     }
}, 2);
  
    document.querySelectorAll(".answers li").forEach(li => {
      li.addEventListener("click", () => {
        document.querySelectorAll(".answers li").forEach(el => el.classList.remove("selected"));
        li.classList.add("selected");
      });
    });
  
    const alertMessage = document.querySelector('.alert-message');

    document.querySelector(".submitAnswer").addEventListener("click", () => {
      const selected = document.querySelector(".answers li.selected");
      if (!selected) {
        alertMessage.style.display = 'flex';
      };
    //   const selectedIndex = parseInt(selected.dataset.index);

    if (selected.dataset.label == question.answer) {
        score++;
        selected.classList.add('correct-border');
        let iconFrame = selected.querySelector('.icon__frame');
        iconFrame.classList.add('correct-frame');
        selected.innerHTML += `<img class="grade" src="assets/images/icon-correct.svg" alt="Correct">`;
      } else {
        selected.classList.add('incorrect-border');
        let iconFrame = selected.querySelector('.icon__frame');
        iconFrame.classList.add('incorrect-frame');
        selected.innerHTML += `<img class="grade" src="assets/images/icon-incorrect.svg" alt="Incorrect">`;
        let answers = document.querySelectorAll('.answers li');
        for(let answer of answers) {
          answer.dataset.label == question.answer ? answer.innerHTML += `<img class="grade" src="assets/images/icon-correct.svg" alt="Correct">` : null;
        }
      }
  
      currentQuestionIndex++;
      setTimeout(()=>{
        if (currentQuestionIndex < globalQuestions.length) {
          listQuestions(globalQuestions);
        } else {
          showResults(quizGlobal);
        }
      },2100);
    });

    changeBackground();
  }

  function showResults(quiz) {
    const main = document.querySelector(".main");
    main.style.display = 'block';
    main.innerHTML = `
      <div class="result">
        <h2>Quiz Completed</h2>
        <h3>You scored...</h3>
        <div class="result__container">
          <div class="header__category" id="headerCategory2">
            <div class="icon__frame" id="iconFrame2">
              <img class="category__img" src="" alt="Image" id="categoryImg2" />
            </div>
            <span class="category__title" id="categoryTitle2"></span>
          </div>
          <h4>${score}</h4>
          <p>out of 10</p>
        </div>
        <button class="submitAnswer" id="restart">Play again</button>
      </div>
    `;
    preview.style.display = 'none';
    showHeader(quiz);

    document.getElementById("restart").addEventListener("click", () => {
      location.reload(); // Or show the category screen again
    });
    changeBackground();
  }
  
  