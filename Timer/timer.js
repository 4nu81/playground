const start = new Date();
const targettime = 1000 * 60 * 10;
const audio = new Audio('tada.mp3');
var running = true;

function timer() {
    if (running) {
        var now = new Date();
        var timediff = now - start;
        if (targettime - timediff > 0 ) {
            document.querySelector('#timer').innerHTML = Math.floor((targettime - timediff) / 1000);
        } else {
            document.querySelector('#timer').innerHTML = "Tadaaaa";
            audio.play();
            running = false;
        }
    }
}

window.onload = function () {
    setInterval(timer, 1000);
};