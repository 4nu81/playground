require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.set('view-engine', 'ejs');

app.use(express.json())
app.use(express.static('statics'))

const posts = [
    {
        username: 'Andi',
        title: 'Post 1',
        text: 'Veniam aliquip irure nulla laboris fugiat tempor veniam laborum nisi est magna irure culpa fugiat. Quis esse aute est pariatur incididunt dolor id occaecat eiusmod veniam officia magna reprehenderit cillum. Dolore pariatur labore magna aliqua. Dolor consequat est laboris ea. Nostrud eu eu deserunt sint reprehenderit sunt reprehenderit eiusmod excepteur deserunt sit. Minim sunt laboris elit aute. Consequat amet nisi enim do elit.'
    },
    {
        username: 'Randy',
        title: 'Post 2',
        text: 'Exercitation nulla labore aliqua occaecat consectetur minim Lorem. Velit labore anim eu amet minim exercitation sunt proident consectetur officia dolor. Occaecat aute fugiat culpa nostrud eiusmod. Consequat veniam non aliquip nostrud adipisicing. Dolor veniam cillum Lorem fugiat consequat velit culpa quis ea. Dolore velit mollit ipsum tempor esse dolor voluptate.'
    },
    {
        username: 'Andi',
        title: 'Post 3',
        text: 'Veniam aliquip irure nulla laboris fugiat tempor veniam laborum nisi est magna irure culpa fugiat. Quis esse aute est pariatur incididunt dolor id occaecat eiusmod veniam officia magna reprehenderit cillum. Dolore pariatur labore magna aliqua. Dolor consequat est laboris ea. Nostrud eu eu deserunt sint reprehenderit sunt reprehenderit eiusmod excepteur deserunt sit. Minim sunt laboris elit aute. Consequat amet nisi enim do elit.'
    },
    {
        username: 'Andi',
        title: 'Post 4',
        text: 'Veniam aliquip irure nulla laboris fugiat tempor veniam laborum nisi est magna irure culpa fugiat. Quis esse aute est pariatur incididunt dolor id occaecat eiusmod veniam officia magna reprehenderit cillum. Dolore pariatur labore magna aliqua. Dolor consequat est laboris ea. Nostrud eu eu deserunt sint reprehenderit sunt reprehenderit eiusmod excepteur deserunt sit. Minim sunt laboris elit aute. Consequat amet nisi enim do elit.'
    },
]

// ########## JWT Auth nicht nötig ##########

app.get('/', (req, res) => {
    res.render('index.ejs');
})

// ########### JWT Auth nötig #############

app.get('/posts', authenticateToken, (req, res) => {
    // res.json(posts.filter(post=> post.username == req.user.name))
    res.render('posts.ejs', {
        name: req.user.name,
        posts: posts//.filter(post=> post.username == req.user.name)
    })
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)