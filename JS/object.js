const cat = {
    init: function (sound) {
        this.sound = sound
        return this
    },
    makeSound: function() {
        console.log(this.sound)
        return this // allows to chain functions
    }
}

const mark = Object.create(cat).init('Meooow').makeSound().makeSound().makeSound()

console.log('Is mark a cat?', cat.isPrototypeOf(mark))


mark
cat
