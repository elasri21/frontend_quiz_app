async function getData() {
    const res = await fetch('./data.json');
    const data = await res.json();
    return data;
}

const subjects = await getData();
// let idx = 0;
let questionIndex = 0;
let numberOfCorrectAnswer = 0;
let numberOfWrongAnswer = 0;

function escapeHTML(html) {
    return html.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

const chosenSubject = document.querySelector(".chosen-subject");
function getSubject(btn) {
    let subjectIndex = parseInt(btn.dataset.index);
    let subjectTitle = subjects['quizzes'][subjectIndex]['title'].toLowerCase();
    let subjectIcon =  subjects['quizzes'][subjectIndex]['icon']
    titleContainer.innerHTML = `
    <div class="picked-subject">
            <img class="${subjectTitle}-icon" src="${subjectIcon}" alt="${subjectTitle}">
            <span class="html">${subjectTitle}</span>
    </div>
    `;
    return subjectIndex;
}

function displayQuestion(idx) {
    if (questionIndex < 10) {
        subjectsContainer.classList.add("chosen-subject")
        subjectsContainer.innerHTML = `
        <div class="question-order">
            Question <span>${questionIndex + 1}</span> of 10
        </div>
        <h2>${escapeHTML(subjects['quizzes'][idx]['questions'][questionIndex]['question'])}</h2>
        <div class="range">
            <div class="progress" style="width: ${((questionIndex + 1) % 10)*10 == 0 ? 100: ((questionIndex + 1) % 10)*10}%"></div>
        </div>
        <div class="options">
            <button class="option">
                <span>A</span>
                <h3>${escapeHTML(subjects['quizzes'][idx]['questions'][questionIndex]['options'][0])}</h3>
            </button>
            <button class="option">
                <span>B</span>
                <h3>${escapeHTML(subjects['quizzes'][idx]['questions'][questionIndex]['options'][1])}</h3>
            </button>
            <button class="option">
                <span>C</span>
                <h3>${escapeHTML(subjects['quizzes'][idx]['questions'][questionIndex]['options'][2])}</h3>
            </button>
            <button class="option">
                <span>D</span>
                <h3>${escapeHTML(subjects['quizzes'][idx]['questions'][questionIndex]['options'][3])}</h3>
            </button>
        </div>
        <button class="submit-answer">Submit</button>
        `;
        const submitAnswer = document.querySelector(".submit-answer");
        submitAnswer.addEventListener("click", function() {
            answerOptions.forEach(an => {
                if (an.classList.contains('selected')) {
                    questionIndex++;
                    displayQuestion(idx);
                } else {
                    // document.querySelector(".error").innerHTML = `
                    // <div><i class="fa-solid fa-times"></i></div>
                    // <p>Please select an answer</p>
                    // `;
                    // setTimeout(function() {
                    //     document.querySelector(".error").innerHTML = "";
                    // }, 1500)
                    return;
                }
            });
        });
        const answerOptions = document.querySelectorAll(".option");
        const answer = subjects['quizzes'][idx]['questions'][questionIndex]['answer'];
        answerOptions.forEach(anOp => {
            anOp.addEventListener("click", function() {
                this.classList.add("selected");
                checkQuestion(this, answer)
            });
        });
    } else {
        // setTimeout(function() {window.location.reload()}, 1500);
        console.log(`Correct Answers: ${numberOfCorrectAnswer}`);
        console.log(`Wrong Answers: ${numberOfWrongAnswer}`);
        subjectsContainer.innerHTML = `
        <div class="result-container">
            <h2>quiz completed <strong>you scored...</strong></h2>
            <div class="picked-subject">
                <img class="${subjects['quizzes'][idx]['title'].toLowerCase()}-icon" src="${subjects['quizzes'][idx]['icon']}" alt="${subjects['quizzes'][idx]['title']}">
                <span class="html">${subjects['quizzes'][idx]['title']}</span>
            </div>
            <div class="result">
                <h3>${numberOfCorrectAnswer}</h3>
                <span> out of 10</span>
            </div>
        </div>
        <button class="play-again">play again</button>
        `;
        document.querySelector(".play-again").addEventListener("click", function() {
            setTimeout(function() {window.location.reload()}, 200)
        })
    }

}

function checkQuestion(qu, an) {
    let quText = qu.querySelector('h3').textContent.toLowerCase();
    let anText = an.toLowerCase();
    if (quText == anText) {
        qu.style.borderColor = '#26d782';
        numberOfCorrectAnswer++;
    } else {
        qu.style.borderColor = '#ee5454';
        Array.from(qu.parentNode.children).forEach(ch => {
            if (ch.querySelector('h3').textContent.toLowerCase() == anText) {
                ch.style.borderColor = '#26d782';
                return;
            }
        })
        numberOfWrongAnswer++;
    }
}

const subjectsContainer = document.querySelector(".subjects");
const titles = document.querySelectorAll(".subjects button");
const titleContainer = document.querySelector(".title");
titles.forEach(title => {
    title.addEventListener("click", function() {
        const idx = getSubject(this);
        displayQuestion(idx);
    });
});

// Switch theme
const body = document.body;
const sun = document.querySelector(".light-btn");
const moon = document.querySelector(".dark-btn");
sun.addEventListener("click", function () {
    this.style.backgroundColor = "#fff";
    moon.style.backgroundColor = "transparent";
    body.className = 'light';
});
moon.addEventListener("click", function () {
    this.style.backgroundColor = "#fff";
    sun.style.backgroundColor = "transparent";
    body.className = 'dark';
});
console.log(body)


