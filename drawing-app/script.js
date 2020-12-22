const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let size = 20;

canvas.addEventListener('mousedown', () => {

});

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
}

drawCircle(50, 50);