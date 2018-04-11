let dog = {
    sound: 'woof',
    talk: function() {
        console.log(this.sound)
    }
}
let sound2 = 'whaaat?'

let talkFunction = dog.talk
let boundFunction = talkFunction.bind(dog)

dog.talk()
talkFunction()
boundFunction()


talk = function () {
    console.log(this.sound2)
}
s = talk()

// Binding Functions
talk = function () {
    return this.speech
}
let boromir = {
    speak: talk,
    speech: 'One does not simply walk into mordor!'
}
let talkBinTo = talk.bind(boromir)
let blabber = boromir.speak
boromir.speak2 = talk.bind(boromir)
let blabber2 = boromir.speak2

talk()
talkBinTo() // is actively bind to boromir object
boromir.speak() // boromir is implicitly calling talk ant though is eaqual to this
blabber()
blabber2()
