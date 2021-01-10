const quizData = [
    {
        "question": "What is the value of pi?",
        "option-a": "3.14",
        "option-b": "5.36",
        "option-c": "8.69",
        "option-d": "12.57",
        "correct": "option-a"
    },
    {
        "question": "Who is the president of the United States?",
        "option-a": "Mr. Dolaand Trump",
        "option-b": "Mr. Joe Rogan",
        "option-c": "Mr. Elon Musk",
        "option-d": "Mr. Joe Biden",
        "correct": "option-d"
    }
];

let questionEl = document.getElementById("question");
let optionAEl = document.getElementById("opt-a");
let optionBEl = document.getElementById("opt-b");
let optionCEl = document.getElementById("opt-c");
let optionDEl = document.getElementById("opt-d");
const submitBtnEl = document.getElementById("submit");

let currQuesNum = 0;
let totalCorrect = 0;

let submitBtnActingAsNext = false;

function loadQuiz() {
    _renderCurrQuizData();
};

function submit() {
    var selectedAns = _getSelected();

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

    if (selectedAns == quizData[currQuesNum].correct) {
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

    _populateResultForOption("option-a-result", "option-a", correctOption);
    _populateResultForOption("option-b-result", "option-b", correctOption);
    _populateResultForOption("option-c-result", "option-c", correctOption);
    _populateResultForOption("option-d-result", "option-d", correctOption);
}

function _populateResultForOption(option, currOption, correctOption) {
    let optionEl = document.getElementById(option);

    // Set check or uncheck mark depending on whether the option is correct
    if (currOption == correctOption) {
        optionEl.innerText = "check_box";
        optionEl.style.color = "#27ae60";
        return;
    }

    optionEl.innerText = "cancel";
    optionEl.style.color = "#c0392b"; 
}

function _resetResultIcons() {
    document.getElementsByName("result-icons").forEach(icon => {
        icon.innerText = "";
    });
}

function _renderCurrQuizData() {
    questionEl.innerText = quizData[currQuesNum].question;
    optionAEl.innerText = quizData[currQuesNum]["option-a"];
    optionBEl.innerText = quizData[currQuesNum]["option-b"];
    optionCEl.innerText = quizData[currQuesNum]["option-c"];
    optionDEl.innerText = quizData[currQuesNum]["option-d"];
}

function _getSelected() {
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
    currQuesNum = 0;
    totalCorrect = 0;
    _changeNextButtonToSubmit();
    loadQuiz();
}

loadQuiz();