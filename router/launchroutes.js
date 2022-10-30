import express from 'express'
const router = express.Router()


import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'
import { clearInterval } from 'timers'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post('/craetedemo', async(req,res)=>{
    try{

    }
    catch(err){
        console.log(err)
        res.json(
            {
                message:err,
                status:500
            }
        )
    }
})

router.post('/launchdemo', async (req, res) => {
    try {
        //將 /router 字樣刪除 
        const dirname = __dirname.substring(0, __dirname.length - 7)
        //建立程式隨機碼
        const fileId = uuidv4()
        //檢測進度是否正常
        const fileWritingStatus = [
            { name: "建立資料夾", status: "成功" },
            { name: "建立html檔案", status: "成功" },
            { name: "建立js檔案", status: "成功" }
        ]

        //write file
        fs.mkdirSync(`${dirname}/public/Access/${fileId}`, (err) => {
            if (err) {
                fileWritingStatus[0].status = "失敗"
            }
        })
        fs.mkdirSync(`${dirname}/public/Access/${fileId}/media`, (err) => {
            if (err) {
                fileWritingStatus[0].status = "失敗"
            }
        })

        //html file write
        const htmlFileName = `${dirname}/public/Access/${fileId}/${fileId}.html`
        const htmlFileContent =
            `<!DOCTYPE html>
    <html lang="en" class=''>
    <head>
        <meta charset="UTF-8">
        <title>Demo</title>
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    </head>
    <body>
        <div id="container"></div>
    </body>
    <script src="${fileId}.js"></script>
    </html>
    `
        fs.writeFileSync(htmlFileName, htmlFileContent, (err) => {
            if (err) {
                fileWritingStatus[1].status = "失敗"
            }
        })
        //js file write
        const jsFileName = `${dirname}/public/Access/${fileId}/${fileId}.js`
        const jsFileContent =
            `console.log("------------------------")
        console.log("Phaser is running now !!!")
        console.log("------------------------")
        ${req.body.setting}


        //config
        ${req.body.config}

        //preload function
        ${req.body.preload}

        //create function
        ${req.body.create}

        //update function
        ${req.body.update}

        //custom function
        ${req.body.custom}
        `
        //js file write
        fs.writeFileSync(jsFileName, jsFileContent, (err) => {
            if (err) {
                fileWritingStatus[2].status = "失敗"
            }
        })

        for (let value of Object.values(fileWritingStatus)) {
            if (value.status == "失敗") {
                res.json(
                    {
                        message: `${fileWritingStatus[0].name}:${fileWritingStatus[0].status}\n` +
                            `${fileWritingStatus[1].name}:${fileWritingStatus[1].status}\n` +
                            `${fileWritingStatus[2].name}:${fileWritingStatus[2].status}`,
                        status: 500
                    }
                )
                break
            }
        }

        res.json(
            {
                message: fileId,
                status: 200
            }
        )
    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: err,
                status: 500
            }
        )
    }
    finally {

    }


})

export default router 