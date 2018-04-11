//https://www.youtube.com/watch?v=6sQDTgOqh-I

const dragonEvents = [
    {type: 'attack', value: 12, target: 'player1'},
    {type: 'yawn', value: 50},
    {type: 'attack', value: 22, target: 'player2'},
    {type: 'eat', target:'horse'},
    {type: 'attack', value: 16, target: 'player3'},
    {type: 'attack', value: 12, target: 'player1'},
    {type: 'attack', value: 12, target: 'player3'},
    {type: 'yawn', value: 50},
    {type: 'attack', value: 22, target: 'player2'},
    {type: 'eat', target:'horse'},
    {type: 'attack', value: 16, target: 'player2'},
    {type: 'attack', value: 12, target: 'player1'},
]

const totalDamagePlayer1 = dragonEvents
    .filter(function(event) {
        return event.type === 'attack'
    })
    .filter(function(event) {
        return event.target === 'player1'
    })
    .map(function(event) {
        return event.value
    })
    .reduce(function(prev, value) {
        return (prev || 0) + value
    })

const reduceTotal = (prev, x) => (prev || 0) + x
const filterIsAttack = e => e.type === 'attack'

const totalDamagePlayerArrow = dragonEvents
    .filter(filterIsAttack)
    .filter(event => event.target === 'player1')
    .map(event => event.value)
    .reduce(reduceTotal)

totalDamagePlayer1
totalDamagePlayerArrow
