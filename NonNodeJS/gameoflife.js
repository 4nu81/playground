const gc = 20
const tc = 40
let plane1=[]
let run = false

window.onload = function() {
    canv = document.getElementById("gc")
    ctx = canv.getContext("2d")
    document.addEventListener("keydown", keyPush)
    document.addEventListener("mousedown", mouseDown)
    plane1 = clearPlane(false)
    print()
    setInterval(start, 50)
}

function clearPlane(empty) {
    let plane = []
    for (let i = 0; i<tc; i++) {
        let a = []
        plane.push(a)
        for (let j=0; j < tc; j++) {
            if (!!empty) {
                v = false
            } else {
                v = Math.random() > 0.8
            }
            // push falsy for later version
            a.push(v)
        }
    }
    return plane
}

function print() {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="lime"
    for (let x in plane1) {
        for (let y in plane1[x]){
            if (!!plane1[x][y]) {
                ctx.fillRect(x*gc,y*gc,gc-2,gc-2)
            }
        }
    }
}

function countNeighbors(xx,yy) {
    let count = 0
    for (let x = Math.max(xx-1 , 0); x <= Math.min(xx+1, tc - 1); x++) {
        for (let y = Math.max(yy-1 , 0); y <= Math.min(yy+1, tc - 1); y++) {
            if (!!plane1[x][y] && (x != xx || y != yy) ) {
                count += 1
            }
        }
    }
    return count
}

function step() {
    let plane2 = clearPlane(true)
    for (let x in plane1) {
        for (let y in plane1[x]){
            let neighbors = countNeighbors(Number(x),Number(y))
            if (!plane1[x][y]) {
                if (neighbors === 3) {
                    plane2[x][y] = true
                }
            } else {
                if (neighbors < 2 || neighbors > 3) {
                    plane2[x][y] = false
                } else {
                    plane2[x][y] = true
                }
            }
        }
    }
    plane1 = plane2
}

function start(){
    if (run) {
        game()
    }
}

function toggle_run() {
    run = !run
}

function game() {
    step()
    print()
}

function clear_plane(fill) {
    plane1 = clearPlane(fill)
    print()
}

function mouseDown(evt) {
    var rect =  canv.getBoundingClientRect();
    let x = Math.floor((evt.clientX - rect.left) / gc)
    let y = Math.floor((evt.clientY - rect.top) / gc)
    plane1[x][y] = !plane1[x][y]
    print()
}

function keyPush(evt) {
    switch(evt.keyCode) {
        case 39: //left
            game()
            break
        case 32:
            toggle_run()
            break
    }
}
