const barker = (state) => ({
    bark: () => {
        console.log('Woof, I am', state.name)
    }
})

const driver = (state) => ({
    drive: () => {
        state.position += state.speed
        console.log('I drove to', state.position)
    }
})

const killer = (state) => ({
    kill: () => {
        console.log(state.name, 'killed a cat')
    }
})

const murderRobotDog = (name) => {
    let state = {
        name,
        speed: 100,
        position: 0
    }
    return Object.assign(
        {},
        barker(state),
        driver(state),
        killer(state)
    )
}

const sniffle = murderRobotDog('sniffles')
sniffle.bark()
sniffle.drive()
sniffle.kill()
