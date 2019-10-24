//https://medium.com/@ajmeyghani/creating-javascript-animations-with-anime-js-f2b14716cdc6

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function test() {
    await sleep(2000);
    console.log('reloaded');
}

window.onload = function () {
    test();
    anime({
        targets: 'div',
        translateX: '200px',
        translateY: '100px',
        duration: 800,
        easing: 'easeInOutElastic',
        scale: 2,
        loop: true,
        direction: 'alternate',
    });
}
