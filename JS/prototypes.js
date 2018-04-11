function talk() {console.log(this.sound)}
let animal = {talk: talk}
let dog = {sound: 'woof!'}
Object.setPrototypeOf(dog, animal)
animal.talk = function() {
    console.log('i am a little teapot')
}
dog.talk()
// ****************************

function Person(saying) {
    this.saying = saying
}

Person.prototype.talk = function() {
    console.log('I say:', this.saying)
}

function new(constructor, args) {
    var obj = {}
    Object.setPrototypeOf(obj, constructor.prototype)
    constructor.apply(obj, args)
    return obj
}

var crockford = new Person('SEMICOLANS!!!1one1')
crockford.talk()

var c2 = new(Person, 'SEMICOLANS!!!2one2')
