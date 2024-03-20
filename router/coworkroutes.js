import express from "express"
import bcrypt from "bcryptjs"
//multer
import multer from "multer"
const router = express.Router()

import createDOMPurify from "dompurify"
import { JSDOM } from "jsdom"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
//將 '/router' 字樣刪除
const __dirname = path.dirname(__filename)
const directName = __dirname.substring(0, __dirname.length - 7)

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)

import coworkconfig from "../models/coworkconfig.js"
import coworkcontent from "../models/coworkcontent.js"
import reflectionconfig from "../models/reflectionconfig.js"

function converDangerString(string) {
    let clean = DOMPurify.sanitize(string)
    let outputString = []

    const converString = new Map([
        ["<", "&lt;"],
        [">", "&gt;"],
        ["&", "$amp;"],
        ['"', "&quot;"],
        ["'", "&#039;"],
    ])

    clean.split("").map(value => {
        converString.get(value) == undefined
            ? outputString.push(value)
            : outputString.push(converString.get(value))
    })
    return outputString.join("")
}

function detectCreatingError(res, errorObj, fileId) {
    for (let value of Object.values(errorObj)) {
        if (value.status == "失敗") {
            res.json({
                message:
                    `${errorObj[0].name}:${errorObj[0].status}\n` +
                    `${errorObj[1].name}:${errorObj[1].status}\n` +
                    `${errorObj[2].name}:${errorObj[2].status}`,
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

const fileFilter = (req, file, cb) => {
    // reject a file
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true)
    } else {
        cb(null, false)
        //cb(new Error('I don\'t have a clue!'))
    }
}
const coworkStorageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${directName}/public/Cowork/${req.user.studentChatRoomId}/media`)
    },
    filename: function (req, file, cb) {
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'))
    },
})
const coworkUploadImg = multer({
    storage: coworkStorageImg,
    limits: {
        //後端限制最大 25 MB 之圖片
        fileSize: 25 * 1024 * 1024,
    },
    fileFilter: fileFilter,
})
//共編模式教材取得區域-------------------------------------
// 學生取得 demo 位置
router.post('/getmaterial', async (req, res) => {
    try {
        const materialData = await coworkcontent.findOne({
            _id: req.body.courseId,
        })
        if (
            materialData.standardMaterial === undefined ||
            materialData.standardMaterial === null
        ) {
            res.json({
                message: "查無此demo，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: materialData.standardMaterial,
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 demo 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生取得 understanding 內容
router.post('/getunderstanding', async (req, res) => {
    try {
        const courseData = await coworkcontent.findOne({
            _id: req.body.courseId,
        })

        if (
            courseData.standardUnderstanding === undefined ||
            courseData.standardUnderstanding === null
        ) {
            res.json({
                message: "查無 探索理解，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: {
                understandingData: courseData.standardUnderstanding[req.body.key],
                startingData: courseData.standardStarting[req.body.key],
            },
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 探索理解 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生取得 formulating 內容
router.post('/getformulating', async (req, res) => {
    try {
        const formulatingData = await coworkcontent.findOne({
            _id: req.body.courseId,
        })

        if (
            formulatingData.standardFormulating === undefined ||
            formulatingData.standardFormulating === null
        ) {
            res.json({
                message: "查無 表徵制定，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: formulatingData.standardFormulating[req.body.key],
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 表徵制定 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生取得 CoworkConfig
router.post('/getcoworkconfig', async (req, res) => {
    try {
        const configData = await coworkconfig.findOne({
            groupId: req.body.groupId,
            coworkContentId: req.body.courseId
        })

        res.json({
            message: {
                coworkStatus: configData.coworkStatus,
                studentGroup: configData.studentGroup
            },
            status: 200
        })

    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 config 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生取得所有 Group 進度
router.post('/getallgroupprogess', async (req, res) => {
    try {
        const coworkData = await coworkconfig.find({ coworkContentId: req.body.courseId })

        const returnData = []
        for (const { studentGroup, coworkStatus } of coworkData) {
            if (studentGroup !== undefined) {
                const coworkProcess = coworkStatus.process || 0

                if (coworkProcess > returnData.length) {
                    for (let i = returnData.length; i <= coworkProcess; i++) {
                        returnData.push({ count: 0, member: [] })
                    }
                }

                if (coworkProcess !== 0) {
                    returnData[coworkProcess - 1].count++
                    returnData[coworkProcess - 1].member.push(studentGroup.join(","))
                }
            }
        }

        res.json({
            message: returnData,
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 Progress 失敗，請聯繫管理員(err)",
            status: 500
        })
    }
})
//共編模式 code 增刪區域-------------------------------------
//讀取 code & hint
router.post("/readcode", async (req, res) => {
    try {
        const coworkData = await coworkconfig.findOne({
            coworkContentId: req.body.courseId,
            groupId: req.user.studentChatRoomId,
        })

        const hintData = await coworkcontent.findOne({
            _id: req.body.courseId
        })
        res.json({
            message: {
                coworkContent: coworkData.coworkContent || "",
                hintList: hintData.standardProgramming[req.body.key].hintList,
            },
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取 code 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})
//儲存 code
router.post('/savecode', async (req, res) => {
    try {
        await coworkconfig.updateOne({
            groupId: req.user.studentChatRoomId,
            coworkContentId: req.body.courseId
        }, {
            coworkContent: req.body.coworkContent
        }).then(response => {
            if (response.acknowledged) {
                res.json({
                    message: "success",
                    status: 200,
                })
            } else {
                res.json({
                    message:
                        "儲存 code 失敗，請記下您當前的 code 並重新整理頁面",
                    status: 500,
                })
            }
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "儲存 code 失敗，請記下您當前的 code 並聯絡管理員 (err)",
            status: 500,
        })
    }
})
//共編 media------------------------------------------------
//共編尋找 media file
router.get('/searchmedia', async (req, res) => {
    try {
        let fileList = []

        //若新增 Media 失敗之備案
        if (
            !fs.existsSync(
                `${directName}/public/Cowork/${req.user.studentChatRoomId}/media`
            )
        ) {
            //user media file
            fs.mkdirSync(
                `${directName}/public/Cowork/${req.user.studentChatRoomId}/media`
            )
        }

        fs.readdirSync(
            `${directName}/public/Cowork/${req.user.studentChatRoomId}/media`
        ).forEach(filename => {
            fileList.push({
                src: `../../Cowork/${req.user.studentChatRoomId}/media/${filename}`,
                name: filename,
            })
        })

        res.json({
            files: fileList,
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取 Cowork/Media 失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
//輸入img file
router.post('/uploadimg', coworkUploadImg.array("image", 5), async (req, res) => {
    try {
        res.json({
            message: "success",
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "上傳凸面失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
//建立共編 Access file
router.post('/createdemo', async (req, res) => {
    try {
        // console.log(req.user)
        //檢測進度是否正常
        const fileWritingStatus = [{ name: "建立資料夾", status: "成功" }]
        //write file
        //user ID file
        if (
            fs.existsSync(`${directName}/public/Cowork/${req.user.studentChatRoomId}`)
        ) {
            res.json({
                message: "success",
                status: 200,
            })
        } else {
            fs.mkdirSync(
                `${directName}/public/Cowork/${req.user.studentChatRoomId}`,
                err => {
                    if (err) {
                        console.log(err)
                        fileWritingStatus[0].status = "失敗"
                    }
                }
            )
            //user media file
            fs.mkdirSync(
                `${directName}/public/Cowork/${req.user.studentChatRoomId}/media`,
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
router.post('/launchdemo', async (req, res) => {
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
            `${directName}/public/Cowork/${req.user.studentChatRoomId}/${fileId}`,
            err => {
                if (err) {
                    fileWritingStatus[0].status = "失敗"
                }
            }
        )
        //js file write
        // console.log(req.body.coworkArea)
        const jsFileName = `${directName}/public/Cowork/${req.user.studentChatRoomId}/${fileId}/${fileId}.js`
        const jsFileContent = `try{console.log("Game Launcher...")
${req.body.coworkArea}
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
        const htmlFileName = `${directName}/public/Cowork/${req.user.studentChatRoomId}/${fileId}/${fileId}.html`
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
//----------------------------------------------------------
// relfection
//學生暫存 reflection
router.post("/savereflection", async (req, res) => {
    try {
        const reflectionData = await reflectionconfig.findOne({
            studentId: req.user.studentId,
            class: req.user.studentClass,
            courseId: req.body.courseId,
        })
        //若為第一次新增該 course 的 relfeciton
        if (reflectionData == null) {
            const newReflectionData = new reflectionconfig({
                studentName: req.user.studentName,
                studentId: req.user.studentId,
                class: req.user.studentClass,
                courseId: req.body.courseId,
                studentReflectionData: {
                    [req.body.key]: {
                        learing: converDangerString(req.body.learning) || "",
                        difficult: converDangerString(req.body.difficult) || "",
                        scoring: req.body.scoring || 0,
                        teammate: req.body.teammate || "",
                        teammateScore: req.body.teammateScore || 0
                    },
                },
            })

            newReflectionData.save()

            res.json({
                message: "success",
                status: 200,
            })
            return
        }

        //其他
        reflectionData.studentReflectionData[req.body.key] = {
            learing: converDangerString(req.body.learning) || "",
            difficult: converDangerString(req.body.difficult) || "",
            scoring: req.body.scoring || 0,
            teammate: req.body.teammate || "",
            teammateScore: req.body.teammateScore || 0
        }

        await reflectionconfig
            .updateOne(
                {
                    studentId: req.user.studentId,
                    class: req.user.studentClass,
                    courseId: req.body.courseId,
                },
                {
                    studentReflectionData: reflectionData.studentReflectionData,
                }
            )
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: "success",
                        status: 200,
                    })
                    return
                }
                res.json({
                    message: "儲存 reflection 失敗，請再試一次!",
                    status: 500,
                })
            })
    } catch (err) {
        console.log(err)
        res.json({
            message: "儲存 Reflection 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//-----------------------------------------------------------

export default router