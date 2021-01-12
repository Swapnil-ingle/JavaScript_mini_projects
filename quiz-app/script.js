let quizData = [];

let questionEl = document.getElementById("question");
let optionAEl = document.getElementById("opt-a");
let optionBEl = document.getElementById("opt-b");
let optionCEl = document.getElementById("opt-c");
let optionDEl = document.getElementById("opt-d");

let optionALiEl = document.getElementById("opt-a-li");
let optionBLiEl = document.getElementById("opt-b-li");
let optionCLiEl = document.getElementById("opt-c-li");
let optionDLiEl = document.getElementById("opt-d-li");

const submitBtnEl = document.getElementById("submit");

let currQuesNum = 0;
let totalCorrect = 0;

let submitBtnActingAsNext = false;

function loadQuiz() {
    const quizQuestionContainerEl = document.getElementById('quiz-question-container');
    const submitEl = document.getElementById('submit');

    quizQuestionContainerEl.classList.remove('hide');
    submitEl.classList.remove('hide');

    _renderCurrQuizData();
};

function submit() {
    var selectedAns = _getSelectedOption();

    if (selectedAns == undefined) {
        alert("Select atleast one answer");
        return;
    }

    if (submitBtnActingAsNext) {
        _resetResultIcons();
        _loadNextQuestion();
        _changeNextButtonToSubmit();
        return;
    }

    if (quizData[currQuesNum][selectedAns] == quizData[currQuesNum].correct) {
        totalCorrect++;
    }

    _populateOptionResults();
    _changeSubmitButtonToNext();
}

function _loadNextQuestion() {
    if (currQuesNum >= quizData.length - 1) {
        _showFinalResults();
        _reset();
    } else {
        currQuesNum++;
        loadQuiz();
    }
}

function _changeNextButtonToSubmit() {
    submitBtnEl.innerText = "Submit";
    submitBtnEl.style.color = "#027cc8";
    submitBtnEl.style.backgroundColor = "rgba(255, 255, 240, 0.25)";
    submitBtnActingAsNext = false;
}

function _changeSubmitButtonToNext() {
    if (currQuesNum >= quizData.length - 1) { 
        _changeSubmitButtonToFinished()
        return;
    }

    submitBtnEl.innerText = "Next";
    submitBtnEl.style.backgroundColor = "#16a08593";
    submitBtnEl.style.color = "black";
    submitBtnActingAsNext = true;
}

function _changeSubmitButtonToFinished() {
    submitBtnEl.innerText = "Finish";
    submitBtnEl.style.backgroundColor = "rgba(0, 0, 0, 0.80)";
    submitBtnEl.style.color = "ivory";
    submitBtnActingAsNext = true;
}

function _populateOptionResults() {
    let correctOption = quizData[currQuesNum].correct;

    _populateResultForOption("option-a-result", quizData[currQuesNum]["option-a"], correctOption);
    _populateResultForOption("option-c-result", quizData[currQuesNum]["option-c"], correctOption);
    _populateResultForOption("option-b-result", quizData[currQuesNum]["option-b"], correctOption);
    _populateResultForOption("option-d-result", quizData[currQuesNum]["option-d"], correctOption);
}

function _populateResultForOption(optionResult, currOption, correctOption) {
    let optionResultEl = document.getElementById(optionResult);

    // Set check or uncheck mark depending on whether the option is correct
    if (currOption == correctOption) {
        optionResultEl.innerText = "check_box";
        optionResultEl.style.color = "#27ae60";
        return;
    }

    optionResultEl.innerText = "cancel";
    optionResultEl.style.color = "#c0392b"; 
}

function _resetResultIcons() {
    document.getElementsByName("result-icons").forEach(icon => {
        icon.innerText = "";
    });
}

function _renderCurrQuizData() {
    optionCLiEl.classList.remove("hide");
    optionDLiEl.classList.remove("hide");

    questionEl.innerText = quizData[currQuesNum].question;
    optionAEl.innerText = quizData[currQuesNum]["option-a"];
    optionBEl.innerText = quizData[currQuesNum]["option-b"];

    let optCText = quizData[currQuesNum]["option-c"];
    if (optCText == null || optCText == undefined) {
        optionCLiEl.classList.add("hide");
    }
    optionCEl.innerText = optCText;

    let optDText = quizData[currQuesNum]["option-d"];
    optionDEl.innerText = optDText
    if (optDText == null || optDText == undefined) {
        optionDLiEl.classList.add("hide");
    }
}

function _getSelectedOption() {
    let answerId = undefined;

    document.getElementsByName("option").forEach(answer => {
        if (answer.checked) {
            answerId = answer.id;
        }
    });

    return answerId != undefined ? answerId : undefined;
}

function _showFinalResults() {
    alert("Quiz Finished!\n\n You got " + totalCorrect + " correct, from " + quizData.length + " questions!");
}

function _reset() {
    window.location.reload();
}

async function genQuiz() {
    const numberOfQAs = document.getElementById("num-of-qas").value;

    if (numberOfQAs <= 0) {
        alert("Number of questions cannot be less than zero!");
        return;
    }

    const typeOfQAs = document.getElementById("type-of-qas").value; 
    const difficultyOfQAs = document.getElementById("difficulty-of-qas").value;
    const categoryOfQAs = document.getElementById("category-of-qas").value;

    let quizApiURL = `https://opentdb.com/api.php?amount=${numberOfQAs}`;
    typeOfQAs != "any" ? quizApiURL += `&type=${typeOfQAs}` : "";
    categoryOfQAs != "any" ? quizApiURL += `&category=${categoryOfQAs}` : "";
    difficultyOfQAs != "any" ? quizApiURL += `&difficulty=${difficultyOfQAs}` : "";

    const fetchedQuizData = await loadQuizData(quizApiURL);

    // If fetched data is empty show error
    if (fetchedQuizData == null || fetchedQuizData == undefined || fetchedQuizData.length <= 0) {
        alert("ERROR: No quiz questions found, try different options!");
        return;
    }

    // Clear Generate Quiz Menu
    _clearGenQuizSection();

    fetchedQuizData.forEach(question => {
        quizData.push(createQuizItem(question));
    });

    // Load into quizData arr
    loadQuiz();
}

function createQuizItem(questionData) {
    let options = [];

    questionData.incorrect_answers.forEach(answer => {
        options.push(answer);
    });

    options.push(questionData.correct_answer);
    options = shuffle(options);

    const question = {
        question: parseString(questionData.question),
        "option-a": parseString(options[0]),
        "option-b": parseString(options[1]),
        "option-c": parseString(options[2]),
        "option-d": parseString(options[3]),
        correct: parseString(questionData.correct_answer)
    };

    return question;
}

function parseString(question) {
    if (question == null || question == undefined) {
        return;
    }

    question = question.replaceAll("&quot;", '"');
    question = question.replaceAll("&ldquo;", '"');
    question = question.replaceAll("&rdquo;", '"');
    question = question.replaceAll("&#039;", "'");
    question = question.replaceAll("&lsquo;", "'");
    question = question.replaceAll("&rsquo;", "'");
    question = question.replaceAll("&amp;", "&");
    return question;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

async function loadQuizData(quizApiURL) {
    const respData = await fetch(quizApiURL);
    const respJson = await respData.json();
    return respJson.results;
}

function _clearGenQuizSection() {
    const quizSelMenuEl = document.getElementById('quiz-selection-menu');
    const genQuizBtnEl = document.getElementById('submit-gen-quiz');
    const formControlEl = document.getElementById('form-control');

    quizSelMenuEl.classList.add("hide");
    genQuizBtnEl.classList.add("hide");
    formControlEl.classList.add("hide");
}