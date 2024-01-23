//express
import express from 'express'
import cors from 'cors'
//.env環境檔案
import dotenv from 'dotenv'
//morgan
import morgan from 'morgan'
//routes
import launchroutes from './router/launchroutes.js'
import adminroutes from './router/adminroutes.js'
import adminlaunchroutes from './router/adminlaunchroutes.js'
import studentroutes from './router/studentroutes.js'
import coworkroutes from './router/coworkroutes.js'
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
import { passport, signIn, signInAdmin } from './database/passportjwt.js'
//socket.io
import socketServer from './socketServer.js'
import { Server } from 'socket.io'
import http from 'http'

//mongodb
import standardcontent from './models/standardcontent.js'

//dlxvhg4vwiWYjjjU

const app = express()
const admin = express()

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
//
app.use(bodyParser.json())
app.use(urlencodedParser)
app.use(cookieParser())


//mongodb
const mongoDbStatus = mongoose.connection
mongoDbStatus.on('error', err => console.error('connection error', err))
mongoDbStatus.once('open', (db) => console.log('Connection to mongodb'))

// //helmet 擋住開發程式避免入侵
// //開啟DNS預讀取
// app.use(helmet({ dnsPrefetchControl: { allow: true } }))
// //阻止瀏覽器對 Content-Type 不明的內容進行探查，以防止惡意程式碼的注入
// app.use(helmet.noSniff());
// //阻止基本的 XSS 攻擊
// app.use(helmet.xssFilter());
// //CSP
// app.use(
//     helmet(
//         {
//             contentSecurityPolicy: {
//                 directives: {
//                     defaultSrc: [
//                         "'self'",
//                         'http://localhost:3000',
//                     ],
//                     scriptSrc: [
//                         "'self'",
//                         "https://code.jquery.com",
//                         "https://cdn.jsdelivr.net",
//                         'https://cdnjs.cloudflare.com',
//                         'https://cdn.socket.io/',
//                         'http://localhost:3000',
//                     ],
//                     frameAncestors: [
//                         "'self'",
//                         "http://localhost:3000",
//                     ],
//                     frameSrc: [
//                         "'self'",
//                         "http://localhost:3000",
//                     ],
//                     childSrc: [
//                         "'self'",
//                         "http://localhost:3000",
//                     ],
//                     imgSrc: [
//                         "'self'",
//                         'https://media.giphy.com',
//                         'http://localhost:3000',
//                         'data:',
//                         'blob:'
//                     ]
//                 },
//             },

//         })
// );


//設定view ejs
app.set("view engine", "ejs")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// app.get('/access/:studentId/:file/:filename', async (req, res) => {
//     res.sendFile(`${__dirname}/public/access/${req.params.studentId}/${req.params.file}/${req.params.filename}`)
//     console.log(req.params.file, req.params.filename)
// })
app.use(express.json())
//靜態物件取得從public
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))


//cors
app.use(cors(
    {
        origin: [process.env.CORS_ALLOW_CAST_TEST, process.env.CORS_ALLOW_CAST_MAIN],
        methods: ['GET']
    }
))

//主畫面
app.get('/', async (req, res) => {
    if (req.cookies['token'] == undefined) {
        res.render('./index')
    } else {
        res.redirect(`./home/${req.cookies.studentId}`)
    }
})
//登出
app.post('/logout', async (req, res) => {
    res.clearCookie('token').clearCookie('studentId')
    res.send('/')
})
//登入
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
        res.render('./home', { studentId: req.params.studentId, coworkStatus: req.user.studentAccess ? 'Y' : 'N' })
    }
})


//routes
app.use('/launch', passport.authenticate('token', { session: false }), launchroutes)
app.use('/student', passport.authenticate('token', { session: false }), studentroutes)
app.use('/cowork', passport.authenticate('token', { session: false }), coworkroutes)


const httpServer = http.createServer(app)
const io = new Server(httpServer)
//socket server management
socketServer(io)


//404
app.use((req, res, next) => {
    res.status(404).render('./404page')
})
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).render('./500error')
})

//admin routes

admin.use(bodyParser.json())
admin.use(urlencodedParser)
admin.use(cookieParser())

admin.set("view engine", "ejs")

admin.use(express.json())
admin.use(express.static('public'))
admin.use(express.static(path.join(__dirname, 'public')))

admin.get('/', async (req, res) => {
    if (req.cookies['tokenADMIN'] == undefined) {
        res.render('./admin/index')
    } else {
        res.redirect(`./home/${req.cookies.adminId}`)
    }
})
admin.post('/login', passport.authenticate('admin-login', { session: false }), signInAdmin)
admin.post('/logout', async (req, res) => {
    res.clearCookie('tokenADMIN').clearCookie('adminId')
    res.redirect('/')
})
admin.get('/home/:adminId', async (req, res) => {
    if (req.cookies.adminId != req.params.adminId) {
        res.redirect('/')
    } else {
        res.render('./admin/home', { adminId: req.cookies.adminId })
    }
})

admin.use('/admin', passport.authenticate('admin-token', { session: false }), adminroutes)
admin.use('/launch', passport.authenticate('admin-token', { session: false }), adminlaunchroutes)
admin.use('/student', passport.authenticate('admin-token', { session: false }), studentroutes)

//Admin 讀取學生GoList頁面
admin.get("/:studentId/:courseId", async (req, res) => {
    try {
        console.log(req.params)
        const courseData = await standardcontent.findOne({
            _id: req.params.courseId
        })

        res.cookie('studentId', req.params.studentId, { maxAge: 60 * 60 * 1000 }).render('./admin/golist_studentdemo', {
            studentId: req.params.studentId,
            courseTitle: courseData.goListTitle,
            courseId: req.params.courseId
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "無法讀取學生 GoList，請聯繫管理員(err)",
            status: 500,
        })
    }
})

//404
admin.use((req, res, next) => {
    res.status(404).render('./404page')
})
//500
admin.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).render('./500error')
})


httpServer.listen(process.env.PORT_1, () => { console.log("Server is runing at " + process.env.HOST + ":" + process.env.PORT_1) })
// httpServer.listen(process.env.PORT_2, () => { console.log("Server is runing at " + process.env.HOST + ":" + process.env.PORT_2) })
admin.listen(process.env.ADMIN_PORT, () => { console.log("admin is running at " + process.env.HOST + ":" + process.env.ADMIN_PORT) })


// status sign meaning
// status 200 => success
// status 500 => server error
// status 501 => empty
// status 404 => error