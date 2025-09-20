if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const users = [] //typically in production, data bases are used rather than an array to store the user; users resets after every refresh
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set('view-engine','ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req,res) =>{
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', (req,res) =>{
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

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

app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err); // Handle errors during logout
        }
        res.redirect('/login'); // Redirect to login page
    });
});

function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
function checkNotAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
app.listen(3000)