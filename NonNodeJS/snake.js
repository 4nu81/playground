window.onload = function() {
    canv = document.getElementById("gc")
    ctx = canv.getContext("2d")
    document.addEventListener("keydown", keyPush)
    setInterval(game,80)
}
xv = yv = 0;
px = py = 10;
gs = 20;
tc = 20;
ax = ay = 15;
tail = 5;
trail = [{x:px, y:py}];
pause = true;
msg = "Start by pressing any direction."

function drawBorder(){
    ctx.fillStyle="orange"
    ctx.fillRect(0,0,canv.width, 2*gs - 2)
    ctx.fillStyle="black"
    ctx.font = "30px Arial"
    ctx.fillText("Length: " + tail, 20, 30)
}

function drawGame() {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    drawBorder()

    ctx.fillStyle="lime";
    for(var i=0;i<trail.length;i++) {
        ctx.fillRect(trail[i].x*gs,(trail[i].y + 2 )*gs,gs-2,gs-2);
    }

    ctx.fillStyle="red";
    ctx.fillRect(ax*gs,(ay+2)*gs,gs-2,gs-2);

    ctx.fillStyle="gold";
    ctx.font = "20px Arial"
    ctx.fillText(msg, 20, 430)
}

function game() {

    if (!pause) {
        px+=xv;
        py+=yv;
        if(px<0) {
            px= tc-1;
        }
        if(px>tc-1) {
            px= 0;
        }
        if(py<0) {
            py= tc-1;
        }
        if(py>tc-1) {
            py= 0;
        }
        
        for(var i=0;i<trail.length;i++) {
            if(trail[i].x==px && trail[i].y==py) {
                if (xv || yv) {
                    msg = "You Failed. Length was " + tail
                    tail = 5;
                    pause = true;
                    xv=yv = 0;
                    px=py = 10;
                    trail = [{x:px, y:py}];
                }
            }
        }
        trail.push({x:px,y:py});

        while(trail.length>tail) {
            trail.shift();
        }

        if(ax==px && ay==py) {
            tail+=5;
            ax=Math.floor(Math.random()*tc);
            ay=Math.floor(Math.random()*tc);
        }
    }

    drawGame()
}

function setDirection(x,y) {
    xv = x; yv = y;
    pause = false;
    msg = "";
}

function keyPush(evt) {
    switch(evt.keyCode) {
        case 37 : { //|| 64
            setDirection(-1, 0);
            break;
        }
        case 38 : { //|| 83
            setDirection(0, -1);
            break;
        }
        case 39 : { //|| 68
            setDirection(1, 0);
            break;
        }
        case 40 : { //|| 87
            setDirection(0, 1);
            break;
        }        
        case 80: {
            pause = !pause;
            msg = "Pause";
            break;
        }
    }
}