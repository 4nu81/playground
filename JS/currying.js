// https://youtu.be/iZLP4qOwY8I

let dragon = (name, size, element) =>
    name + ' is a ' +
    size + ' dragon that breathes ' +
    element + '!'

console.log(dragon('fluffy', 'tiny', 'farts'))

let currydragon =
    name =>
        size =>
            element =>
                name + ' is a ' +
                size + ' dragon that breathes ' +
                element + '!'

console.log(currydragon('fluffy')('tiny')('farts'))

let fluffyDragon = currydragon('fluffy')
let tinyDragon = fluffyDragon('tiny')
console.log(tinyDragon('farts'))

import _ from 'lodash'
let lodashDragon = (name, size, element) =>
    name + ' is a ' +
    size + ' dog that drops ' +
    element + '!'

let lDragon = _.curry(lodashDragon)

let shiggleDragon = lDragon('shiggle')
let mediDragon = shiggleDragon('medi')
console.log(mediDragon('barks'))
