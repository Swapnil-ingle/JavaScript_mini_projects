const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds');
const resetTimerBtn = document.getElementById('resetTimerBtn');

const defTargetDate = '25 Dec 2020';
const defCaption = 'Days till chirstmas';

var targetDate = localStorage.getItem('targetDate') == null ? defTargetDate : localStorage.getItem('targetDate');

start();

function start() {
    var caption = localStorage.getItem('caption') == null ? defCaption : localStorage.getItem('caption');

    if (daysEl != null) {
        _populateCaption(caption != null ? caption : defCaption);
        _startCountdown();
        setInterval(_startCountdown, 100);
    }
}

function _populateCaption(caption) {
    const bodyH1Tag = document.querySelector('body h1');
    bodyH1Tag.innerText = caption;
}

function _startCountdown() {
    const targetDateNew = new Date(targetDate);
    const currDate = new Date();

    const totalMicroSeconds = targetDateNew - currDate;
    const totalSeconds = Math.floor(totalMicroSeconds / 1000);
    
    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    daysEl.innerHTML = days;
    hoursEl.innerHTML = _formatTime(hours);
    minsEl.innerHTML = _formatTime(minutes);
    secondsEl.innerHTML = _formatTime(seconds);
}

function _formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

resetTimerBtn.addEventListener(('click'), () => {
    console.log("Reset event clicked");
    window.location.href = "resetFormPage.html";
});

function resetTargetDate() {
    const targetResetDate = document.getElementById('targetResetDate');
    const newCaption = document.getElementById('resetCaptionInput');

    const inputDate = targetResetDate.value;

    if (inputDate == null || inputDate.length <= 0) {
        alert("Please select non-empty date!");
        return;
    }

    targetDate = new Date(inputDate);

    if (targetDate <= new Date()) {
        alert("Please select a future date!");
        return;
    }

    localStorage.setItem('targetDate', targetDate);
    localStorage.setItem('caption', newCaption.value);
    window.location.href = "index.html";
}