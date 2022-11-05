import express from 'express'
const router = express.Router()


import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//回報錯誤
const detectCreatingError = (res, errorObj, fileId) => {
    for (let value of Object.values(errorObj)) {
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
        })
}

//建立Access file for studentId
router.post('/createdemo', async (req, res) => {
    try {
        // console.log(req.user)
        //將 '/router' 字樣刪除 
        const dirname = __dirname.substring(0, __dirname.length - 7)
        //檢測進度是否正常
        const fileWritingStatus = [
            { name: "建立資料夾", status: "成功" }
        ]
        //write file
        //user ID file
        if(fs.existsSync(`${dirname}/public/Access/${req.user.studentId}`)){
            res.json(
                {
                    message:'success',
                    status:200,
                }
            )
        }else{
            fs.mkdirSync(`${dirname}/public/Access/${req.user.studentId}`, (err) => {
                if (err) {
                    console.log(err)
                    fileWritingStatus[0].status = "失敗"
                }
            })
            //user media file
            fs.mkdirSync(`${dirname}/public/Access/${req.user.studentId}/media`, (err) => {
                if (err) {
                    fileWritingStatus[0].status = "失敗"
                }
            })
    
            //res wirte in this function
            detectCreatingError(res, fileWritingStatus, '')
        }

    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '建立 Access 失敗，請聯絡管理員 (err)',
                status: 500
            }
        )
    }
})

//建立Access file for html and js
router.post('/launchdemo', async (req, res) => {
    try {
        // console.log(req.user)
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
        //user ID file
        fs.mkdirSync(`${dirname}/public/Access/${req.user.studentId}/${fileId}`, (err) => {
            if (err) {
                fileWritingStatus[0].status = "失敗"
            }
        })

        //html file write
        const htmlFileName = `${dirname}/public/Access/${req.user.studentId}/${fileId}/${fileId}.html`
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
        const jsFileName = `${dirname}/public/Access/${req.user.studentId}/${fileId}/${fileId}.js`
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

        //res wirte in this function
        detectCreatingError(res, fileWritingStatus, fileId)
    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '建立 access 失敗，請聯絡管理員 (err)',
                status: 500
            }
        )
    }
})

export default router 