const generateBtn = document.getElementById('submit');

const passwordLen = document.getElementById('pwd-length');
const containsUppercase = document.getElementById('contains-uppercase');
const containsSpcChar = document.getElementById('contains-special-char');
const containsNumeral = document.getElementById('contains-numeral');

generateBtn.addEventListener('click', (e) => {
    console.log(passwordLen.value);
    console.log(containsUppercase.value);
    console.log(containsSpcChar.value);
    console.log(containsNumeral.value);
});