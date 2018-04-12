class Animal:
    def __init__(self, sound):
        self.sound = sound
    def talk(self):
        print self.sound
        return self

doggy = Animal('woof')
doggy.talk()

crow = Animal('kraah').talk().talk()
crow.talk()

Animal.talk(doggy).talk() # weird

class empty: pass
cat = empty()
cat.sound = 'meow'
cat.talk = Animal.talk
cat.talk(doggy)
