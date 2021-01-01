const pwdOutputEl = document.getElementById('pwd-output');
const copyBtn = document.getElementById('copy-btn');
const pwdLenEl = document.getElementById('pwd-len');
const upperEl = document.getElementById('upper');
const lowerEl = document.getElementById('lower');
const numberEl = document.getElementById('number');
const symbolEl = document.getElementById('symbol');
const generateBtn = document.getElementById('generate');

const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+=';

generateBtn.addEventListener('click', () => {
    if (pwdLenEl.value < 4 || pwdLenEl.value > 40) {
        alert('ERROR: Password length should be from 4 to 40');
        return;
    }

    let passwordEl = pwdOutputEl.querySelector('h1');
    let password = generatePassword(pwdLenEl.value, upperEl.checked, lowerEl.checked, 
        numberEl.checked, symbolEl.checked);

    if (password.length <= 0) {
        alert("ERROR: Empty password generated, try tweaking the options!");
        return;
    }

    passwordEl.innerText = password;
});

copyBtn.addEventListener('click', () => {
    const currPassword = pwdOutputEl.querySelector('h1').innerText;
    const textArea = document.createElement('textarea');
    textArea.value = currPassword;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    alert('Copied to clipboard: ' + currPassword);
});

function generatePassword(length, containsUpperLtrs, containsLowerLtrs, 
    containsNumbers, containsSymbols) {
    let password = "";

    for (i=0; i<length; i++) {
        containsUpperLtrs && password.length < length ? password += getUpperCase() : "";
        containsLowerLtrs && password.length < length ? password += getLowerCase() : "";
        containsNumbers && password.length < length ? password +=  getNumber() : "";
        containsSymbols && password.length < length ? password += getSymbol() : "";
    }

    return password;
}

function getLowerCase() {
    return extractRandom(lowerLetters);
}

function getUpperCase() {
    return extractRandom(upperLetters);
}

function getNumber() {
    return extractRandom(numbers);
}

function getSymbol() {
    return extractRandom(symbols);
}

function extractRandom(inputArr) {
    return inputArr[Math.floor(Math.random() * inputArr.length)];
}