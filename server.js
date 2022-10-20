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
    res.render('./home')
})


//helmet 擋住開發程式避免入侵
import helmet from 'helmet'
//開啟DNS預讀取
app.use(helmet({ dnsPrefetchControl: { allow: true } }))
//阻止瀏覽器對 Content-Type 不明的內容進行探查，以防止惡意程式碼的注入
app.use(helmet.noSniff());
//CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'",
                "https://code.jquery.com",
                "https://cdn.jsdelivr.net",
                __dirname,
                'https://cdnjs.cloudflare.com'
            ],
        },
    })
);


import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
app.post('/launchdemo', async (req, res) => {
    
    const fileId = uuidv4()
    const fileWritingStatus = [
        {name:"建立資料夾",status:false},
        {name:"建立html檔案",status:false},
        {name:"建立js檔案",status:false}
    ]
        

    //write file
    fs.mkdirSync(`${__dirname}/public/Access/${fileId}`,(err)=>{
        if(err){
            fileWritingStatus[0].status = true
        }
    })

    //html file write
    const htmlFileName = `${__dirname}/public/Access/${fileId}/${fileId}.html`
    const htmlFileContent =
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    </head>
    <body>
        <div id="container"></div>
    </body>
    <script src="${fileId}.js"></script>
    </html>
    `
    fs.writeFileSync(htmlFileName,htmlFileContent,(err)=>{
        if(err){
            fileWritingStatus[1].status = true
        }
    })

    //js file write
    const jsFileName = `${__dirname}/public/Access/${fileId}/${fileId}.js`
    const jsFileContent =
        `console.log("Phaser is running now")
        let config = {
            type: Phaser.AUTO,
            width: 1200,
            height: 600,
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            parent:'container',
        };
        let game = new Phaser.Game(config);

        function preload(){
            this.load.image("background", "https://play-lh.googleusercontent.com/V_P-I-UENK93ahkQgOWel8X8yFxjhOOfMAZjxXrqp311Gm_RBtlDXHLQhwFZN8n4aIQ");
        }

        function create() {
            this.add.image(0, 0, "background").setOrigin(0, 0);
        }

        function update() {
        }
        `
    //js file write
    fs.writeFileSync(jsFileName,jsFileContent,(err)=>{
        if(err){
            fileWritingStatus[2].status = true
        }
    })

    for(let value of Object.values(fileWritingStatus)){
        if(value.status == true){
            res.send(
                `${fileWritingStatus[0].name}:${fileWritingStatus[0].status}\n` +
                `${fileWritingStatus[1].name}:${fileWritingStatus[1].status}\n` +
                `${fileWritingStatus[2].name}:${fileWritingStatus[2].status}`
            )
            break
        }
    }
    res.send(fileId)
    
})




app.listen(port, () => { console.log("Server is runing at " + host + " : " + port) })