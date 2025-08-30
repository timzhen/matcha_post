const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const users = [] //typically in production, data bases are used rather than an array to store the user
//users resets after every refresh

app.set('view-engine','ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req,res) =>{
    res.render('index.ejs', {name: 'Tim'})
})

app.get('/login', (req,res) =>{
    res.render('login.ejs')
})

app.post('/login', (req,res) => {

})

app.get('/register', (req,res) =>{
    res.render('register.ejs', {name: 'Tim'})
})

app.post('/register',async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) //https://www.youtube.com/watch?v=Ud5xKCYQTjM
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})
app.listen(3000)