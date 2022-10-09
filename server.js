//express
import express from 'express'
const app = express()
const host = '127.0.0.1'
const port = '3000'

//.env環境檔案
import dotenv from 'dotenv'
dotenv.config()
//用於解析json row txt URL-encoded格式
import bodyParser from 'body-parser'
const urlencodedParser = bodyParser.urlencoded({ extended: false })


//helmet 擋住開發程式避免入侵
import helmet from 'helmet'
//開啟DNS預讀取
app.use(helmet({ dnsPrefetchControl: { allow: true } }))
//CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["self",
                "https://code.jquery.com",
                "https://cdn.jsdelivr.net",
                "http://localhost:3000",
                'https://cdnjs.cloudflare.com']
        },
    })
);


app.use(express.json())
//靜態物件取得從public
app.use(express.static('public'))
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs")

app.use(bodyParser.json());
app.use(urlencodedParser);

app.get('/', async (req, res) => {
    res.render('home')
})



app.listen(port, () => { console.log("Server is runing at " + host + " : " + port) })