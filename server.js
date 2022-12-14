//express
import express from 'express'
//.env環境檔案
import dotenv from 'dotenv'
//morgan
import morgan from 'morgan'
//routes
import launchroutes from './router/launchroutes.js'
import adminroutes from './router/adminroutes.js'
import studentroutes from './router/studentroutes.js'
//用於解析json row txt URL-encoded格式
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//取得靜態物件from public 之用
import path from 'path'
import { fileURLToPath } from 'url'
//mongodb
import mongoose from 'mongoose'
import './database/mongodb.js'
//helmet
import helmet from 'helmet'
//passport
import { passport, signIn } from './database/passportjwt.js'


const app = express()
const host = '127.0.0.1'
const port = '3000'

//.env config
dotenv.config()

//morgan
morgan.format('user', '[user] request :remote-addr :date[web] :method :url :status :response-time ms')

app.use(morgan('user', {
    skip: (req, res) => {
        return req.url.split('/')[1] != 'home'
    }
}))

//用於解析json row txt URL-encoded格式
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(cookieParser())


//mongodb
const mongoDbStatus = mongoose.connection
mongoDbStatus.on('error', err => console.error('connection error', err))
mongoDbStatus.once('open', (db) => console.log('Connection to mongodb'))

//helmet 擋住開發程式避免入侵
//開啟DNS預讀取
app.use(helmet({ dnsPrefetchControl: { allow: true } }))
//阻止瀏覽器對 Content-Type 不明的內容進行探查，以防止惡意程式碼的注入
app.use(helmet.noSniff());
//CSP
app.use(
    helmet(
        {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: [
                        "'self'",
                        'http://localhost:3000',
                    ],
                    scriptSrc: [
                        "'self'",
                        "https://code.jquery.com",
                        "https://cdn.jsdelivr.net",
                        'https://cdnjs.cloudflare.com',
                        'http://localhost:3000',
                    ],
                    frameAncestors: [
                        "'self'",
                        "http://localhost:3000",
                    ],
                    frameSrc: [
                        "'self'",
                        "http://localhost:3000",
                    ],
                    childSrc: [
                        "'self'",
                        "http://localhost:3000",
                    ],
                    imgSrc: [
                        'https://media.giphy.com',
                        'http://localhost:3000',
                        'data:',
                        'blob:'
                    ]
                },
            },

        })
);


//設定view ejs
app.set("view engine", "ejs")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.get('/access/:file/:filename', async (req, res) => {
//     res.sendFile(`${__dirname}/public/access/${req.params.file}/${req.params.filename}`)
//     console.log(req.params.file, req.params.filename)
// })
//靜態物件取得從public
app.use(express.json())
app.use(express.static('public'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
    if (req.cookies['token'] == undefined) {
        res.render('./index')
    } else {
        res.redirect(`./home/${req.cookies.studentId}`)
    }
})
app.post('/logout', async (req, res) => {
    res.clearCookie('token')
    res.clearCookie('studentId')
    res.send('/')
})
//登入
// app.post('/login',async(req,res)=>{
//     console.log(req.body)
// })
app.post('/login', passport.authenticate('login', { session: false }), signIn)

app.use((req, res, next) => {
    if (req.cookies['token'] == undefined) {
        res.redirect('/')
        return
    }
    next()
})
app.get('/home/:studentId', passport.authenticate('token', { session: false }), async (req, res) => {
    if (req.user.studentId != req.params.studentId) {
        res.redirect('/')
    } else {
        res.render('./home', { studentId: req.params.studentId })
    }
})
//routes
app.use('/launch', passport.authenticate('token', { session: false }), launchroutes)
app.use('/admin', passport.authenticate('token', { session: false }), adminroutes)
app.use('/student', passport.authenticate('token', { session: false }), studentroutes)

//404
app.use((req, res, next) => {
    res.status(404).render('./404page')
})
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).render('./500error')
})


app.listen(port, () => { console.log("Server is runing at " + host + " : " + port) })