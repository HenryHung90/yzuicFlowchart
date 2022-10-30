//express
import express from 'express'
//.env環境檔案
import dotenv from 'dotenv'
//routes
import launchroutes from './router/launchroutes.js'
import adminroutes from './router/adminroutes.js'
//用於解析json row txt URL-encoded格式
import bodyParser from 'body-parser'
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

//用於解析json row txt URL-encoded格式
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(urlencodedParser);


//靜態物件取得從public
app.use(express.json())
app.use(express.static('public'))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')))

//設定view ejs
app.set("view engine", "ejs")

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
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'",
                "https://code.jquery.com",
                "https://cdn.jsdelivr.net",
                'https://cdnjs.cloudflare.com'
            ],
        },
    })
);

//passport


app.use('/launch', launchroutes)
app.use('/admin', adminroutes)

app.get('/', async (req, res) => {
    res.render('./index')
})
//登入
// app.post('/login',async(req,res)=>{
//     console.log(req.body)
// })
app.post('/login', passport.authenticate('login', { session: false }), signIn)

app.get('/home/:studentId', passport.authenticate('token', { session: false }), async (req, res) => {
    res.render('./home', { studentId: req.params.studentId})
})


//404
app.use((req, res, next) => {
    res.status(404).render('./404page')
})
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).render('./500error')
})


app.listen(port, () => { console.log("Server is runing at " + host + " : " + port) })