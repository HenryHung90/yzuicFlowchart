import express from "express"
const router = express.Router()

import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
//將 '/router' 字樣刪除
const __dirname = path.dirname(__filename)
const directName = __dirname.substring(0, __dirname.length - 7)

//------------------------------------------------------

//Access File
const detectCreatingError = (res, errorObj, fileId) => {
    for (let value of Object.values(errorObj)) {
        if (value.status == "失敗") {
            res.json({
                message:
                    `${fileWritingStatus[0].name}:${fileWritingStatus[0].status}\n` +
                    `${fileWritingStatus[1].name}:${fileWritingStatus[1].status}\n` +
                    `${fileWritingStatus[2].name}:${fileWritingStatus[2].status}`,
                status: 500,
            })
            break
        }
    }
    res.json({
        message: fileId,
        status: 200,
    })
}

//建立Access file for studentId
router.post("/createdemo", async (req, res) => {
    try {
        // console.log(req.user)
        //檢測進度是否正常
        const fileWritingStatus = [{ name: "建立資料夾", status: "成功" }]
        //write file
        //user ID file
        if (
            fs.existsSync(`${directName}/public/Access/${req.body.studentId}`)
        ) {
            res.json({
                message: "success",
                status: 200,
            })
        } else {
            fs.mkdirSync(
                `${directName}/public/Access/${req.body.studentId}`,
                err => {
                    if (err) {
                        console.log(err)
                        fileWritingStatus[0].status = "失敗"
                    }
                }
            )
            //user media file
            fs.mkdirSync(
                `${directName}/public/Access/${req.body.studentId}/media`,
                err => {
                    if (err) {
                        fileWritingStatus[0].status = "失敗"
                    }
                }
            )

            //res wirte in this function
            detectCreatingError(res, fileWritingStatus, "")
        }
    } catch (err) {
        console.log(err)
        res.json({
            message: "建立 Access 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})
//建立Access file for html and js
router.post("/launchdemo", async (req, res) => {
    try {
        // console.log(req.user)
        //建立程式隨機碼
        const fileId = uuidv4()
        //檢測進度是否正常
        const fileWritingStatus = [
            { name: "建立資料夾", status: "成功" },
            { name: "建立html檔案", status: "成功" },
            { name: "建立js檔案", status: "成功" },
        ]

        //write file
        //user ID file
        fs.mkdirSync(
            `${directName}/public/Access/${req.body.studentId}/${fileId}`,
            err => {
                if (err) {
                    fileWritingStatus[0].status = "失敗"
                }
            }
        )
        //js file write
        const jsFileName = `${directName}/public/Access/${req.body.studentId}/${fileId}/${fileId}.js`
        const jsFileContent = `try{console.log("Game Launcher...")
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
            }catch(err){
                if (err instanceof TypeError) {
                    console.error("TypeError",err.stack)
                  } else if (err instanceof RangeError) {
                    console.error("RangeError",err.stack)
                  } else if (err instanceof EvalError) {
                    console.error("EvalError",err.stack)
                  } else if (err instanceof SyntaxError) {
                    console.error("SyntaxError",err.stack)
                  }else{
                    console.error("Else",err.stack)
                  }
            }
            `
        fs.writeFileSync(jsFileName, jsFileContent, err => {
            if (err) {
                fileWritingStatus[2].status = "失敗"
            }
        })

        //html file write
        const htmlFileName = `${directName}/public/Access/${req.body.studentId}/${fileId}/${fileId}.html`
        const htmlFileContent = `<!DOCTYPE html>
         <html lang="en" class=''>
         <head>
             <meta charset="UTF-8">
             <title>Demo</title>
             <!-- jQuery -->
             <script src="https://code.jquery.com/jquery-3.6.1.min.js"
             integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
         </head>
         <body>
             <div id="container"></div>
         </body>
         <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/phaser.min.js"></script>
         <script src="./${fileId}.js" defer></script>
         </html>
         `
        fs.writeFileSync(htmlFileName, htmlFileContent, err => {
            if (err) {
                fileWritingStatus[1].status = "失敗"
            }
        })

        //res wirte in this function
        detectCreatingError(res, fileWritingStatus, fileId)
    } catch (err) {
        console.log(err)
        res.json({
            message: "建立 access 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})

export default router
