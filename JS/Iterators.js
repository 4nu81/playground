const randomNumber =
    require('random-number')

function randomItem(array) {
    const randomIndex = randomNumber({
        min:0,
        max: array.length - 1,
        integer: true
    })
    return array[randomIndex]
}

const makeDragon = () => {
    const dragonSizes = ['big','medium','tiny']
    const dragonAbilities = ['fire', 'ice', 'ligtning', 'fart', 'poop']
    return randomItem(dragonSizes) + ' ' + randomItem(dragonAbilities) + ' dragon'
}

const dragonArmy = {
    [Symbol.iterator]: () => {
        return {
            next: () => {
                const enoughDragonsSpawned = Math.random() > 0.8
                if (!enoughDragonsSpawned)
                    return {
                        value: makeDragon(),
                        done: false
                    }
                return {done:true}
            }
        }
    }
}

const iterator = dragonArmy[Symbol.iterator]()
i = iterator.next()
i
i = iterator.next()
i
i = iterator.next()
i
i = iterator.next()
i


for (const dragon of dragonArmy) {
    dragon
}