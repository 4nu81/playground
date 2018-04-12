class Mammal {
    constructor(sound) {
        this.sound = sound
    }
    talk() {
        return this.sound
    }
}

class Dog extends Mammal {
    constructor () {
        super('woofeliwoofffff')
    }
}

let fluffykins = new Dog()
fluffykins

x = fluffykins.sound
x

fluffykins.sound = 'meow'

x = fluffykins.talk()
x

x = Dog.prototype.talk.bind({
    sound: 'jiggle'
})()
x
