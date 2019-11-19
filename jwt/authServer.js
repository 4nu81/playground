var dotenv = require('dotenv').config()

if (dotenv.error) {throw dotenv.error}

const express = require('express')
const app = express()

const bcrypt= require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')

app.use(express.json())

app.use(cors())

let refreshTokens = []

const USERS = [
    {
        name: "Andi",
        passwd: 'andi'
    },
    {
        name: "Randy",
        passwd: 'randy'
    }
]

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({
            name: user.name
        })
        res.json({
            accessToken: accessToken
        })
    })
})

app.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username
    const rawpasswd = req.body.passwd

    var loginuser = USERS.filter(item => item.name == username).pop()
    loginpasswd = loginuser && loginuser.passwd || ''
    if(loginpasswd  != rawpasswd) {
        return res.sendStatus(403)
    }

    const user = {
        name: username
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.cookie('accessToken',accessToken, { maxAge: 900 });
    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5min' })
}

app.listen(4000)