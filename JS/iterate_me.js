const randomNumber = require('random-number')

function randomItem(array) {
    const randomIndex = randomNumber({
        min:0,
        max: array.length - 1,
        integer: true
    })
    return array[randomIndex]
}

const makeChar = () => {
    return String.fromCharCode(randomNumber({
        min: 0,
        max: 255,
        integer:true
    }))
}

const alphabeth = {
    [Symbol.iterator]: () => {
        return {
            next: () => {
                const enoughChars = Math.random() > 0.75
                if (!enoughChars)
                    return {
                        value: makeChar(),
                        done: false
                    }
                return {done:true}
            }
        }
    }
}

function findNextChar(word, target) {
    let subtarget = target.split('').splice(0, word.length + 1).join('')
    do {
        let spec
        do {
            spec = []
            for (let c of alphabeth) {
                spec.push(c)
            }
        } while (spec.length < 1)
        char = randomItem(spec)
    } while (subtarget != word + char)
    return char
}

const hello_world = {
    [Symbol.iterator]: () => {
        word = ''
        target = 'Hello World! This is Earth speaking! This took way to short.' 
        return {
            next: () => {
                ready = word === target
                if (!ready) {                    
                    char = findNextChar(word, target)
                    word = word + char
                    return {
                        value: char,
                        done: false
                    }
                }
                return {done:true}
            }
        }
    }
}

console.time('hello')
let result = ''
for (let c of hello_world) {
    result = result + c
}
console.log(result)
console.timeEnd('hello')