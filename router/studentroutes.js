import express from "express"
import bcrypt from "bcryptjs"
const router = express.Router()

import createDOMPurify from "dompurify"
import { JSDOM } from "jsdom"

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)

import studentConfig from "../models/studentconfig.js"
import standardcontent from "../models/standardcontent.js"
import coworkconfig from "../models/coworkconfig.js"
import chatroomconfig from "../models/chatroomconfig.js"
import reflectionconfig from "../models/reflectionconfig.js"
import listenerconfig from "../models/listenerconfig.js"
import formulatingconfig from "../models/formulatingconfig.js"
import coworkcontent from "../models/coworkcontent.js"
import adminconfig from "../models/adminconfig.js"

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

const saltRound = 10

// 學生修改密碼
router.post("/changepassword", async (req, res) => {
    try {
        let result = false
        const studentData = await studentConfig.findOne({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
        })

        await bcrypt
            .compare(req.body.oldPassword, studentData.studentPassword)
            .then(response => {
                result = response
            })
        if (!result) {
            res.json({
                message: "舊密碼輸入錯誤!",
                status: 500,
            })
            return
        }

        await bcrypt.hash(req.body.newPassword, saltRound).then(hashed => {
            studentConfig
                .updateOne(
                    {
                        studentId: req.user.studentId,
                        studentClass: req.user.studentClass,
                    },
                    {
                        studentPassword: hashed,
                    }
                )
                .then(response => {
                    if (response.acknowledged) {
                        res.json({
                            message: "修改成功!",
                            status: 200,
                        })
                    } else {
                        res.json({
                            message: "修改失敗!請再試一次",
                            status: 201,
                        })
                    }
                })
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "修改失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
// 學生取得所有教學資料
router.get("/getallcourse", async (req, res) => {
    try {
        const standardData = await standardcontent.find({
            class: req.user.studentClass,
            access: true,
        })

        res.json({
            standardData: standardData,
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得學生教材時發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生取得所有共編資料
router.get('/getallcoworkcourse', async (req, res) => {
    try {
        if (req.user.studentChatRoomId == undefined) {
            res.json({
                message: "您尚未擁有群組, 請通知管理員新增群組",
                status: 500,
            })
            return
        }

        const coworkData = await coworkconfig.find({ groupId: req.user.studentChatRoomId })

        res.json({
            coworkData: coworkData,
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得共編教材時發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 最高管理員取得所有共編資料
router.get("/getallcourse_admin", async (req, res) => {
    try {
        const standardData = await standardcontent.find({})
        const coworkData = await coworkconfig.find({ groupId: req.user.studentChatRoomId })

        res.json({
            message: {
                standardData: standardData,
                coworkData: coworkData
            },
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "管理權限取得所有課程失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生進入教程
router.get("/:courseId", async (req, res) => {
    try {
        const courseData = await standardcontent.findOne({
            _id: req.params.courseId,
        })
        if (
            courseData === null ||
            courseData === undefined ||
            courseData.length === 0
        ) {
            res.redirect(`/home/${req.user.studentId}`)
            return
        }

        const studentData = await studentConfig.findOne({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
        })

        if (studentData.studentGoList === undefined) {
            studentData.studentGoList = {
                [req.params.courseId]: null,
            }
            await studentConfig.updateOne(
                {
                    studentId: req.user.studentId,
                    studentClass: req.user.studentClass,
                },
                {
                    studentGoList: studentData.studentGoList,
                }
            )
        } else if (
            studentData.studentGoList[req.params.courseId] == undefined
        ) {
            studentData.studentGoList[req.params.courseId] = null
            await studentConfig.updateOne(
                {
                    studentId: req.user.studentId,
                    studentClass: req.user.studentClass,
                },
                {
                    studentGoList: studentData.studentGoList,
                }
            )
        }

        res.render("./golist", {
            studentId: req.user.studentId,
            courseId: req.params.courseId,
            courseTitle: courseData.goListTitle,
            chatRoomId: req.user.studentChatRoomId,
            coworkStatus: 'N',
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "錯誤開啟，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生進入共編教材
router.get("/co/:courseId", async (req, res) => {
    try {
        const coworkData = await coworkconfig.findOne({
            _id: req.params.courseId,
        })
        if (
            coworkData === null ||
            coworkData === undefined ||
            coworkData.length === 0
        ) {
            res.redirect(`/home/${req.user.studentId}`)
            return
        }

        res.render("./cowork", {
            studentId: req.user.studentId,
            courseId: coworkData.coworkContentId,
            courseTitle: coworkData.coworkTitle,
            chatRoomId: req.user.studentChatRoomId,
            coworkStatus: 'Y',
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "錯誤開啟，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//個人模式教材取得區域------------------------------------
// 學生取得 demo 位置
router.post("/getmaterial", async (req, res) => {
    try {
        const materialData = await standardcontent.findOne({
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
// 學生取得 start 內容
// router.post("/getstarting", async (req, res) => {
//     try {
//         const materialData = await standardcontent.findOne({
//             _id: req.body.courseId,
//         })

//         if (
//             materialData.standardStarting === undefined ||
//             materialData.standardStarting === null
//         ) {
//             res.json({
//                 message: "查無此demo，請稍後再試",
//                 status: 500,
//             })
//             return
//         }
//         res.json({
//             message: materialData.standardStarting[req.body.key],
//             status: 200,
//         })
//     } catch (err) {
//         console.log(err)
//         res.json({
//             message: "取得 start task 失敗，請聯繫管理員(err)",
//             status: 500,
//         })
//     }
// })
// 學生取得 understanding 內容
router.post("/getunderstanding", async (req, res) => {
    try {
        const courseData = await standardcontent.findOne({
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
//學生取得 formulating 內容
router.post("/getformulating", async (req, res) => {
    try {
        const formulatingData = await standardcontent.findOne({
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
//學生取得 writeFormulating 內容
router.post("/getwriteformulating", async (req, res) => {
    try {
        const formulatingData = await formulatingconfig.findOne({
            studentClass: req.user.studentClass,
            studentName: req.user.studentName,
            studentId: req.user.studentId,
        })

        if (formulatingData === null) {
            res.json({
                status: 501,
            })
            return
        }
        if (formulatingData[req.body.courseId] === null) {
            res.json({
                status: 501,
            })
            return
        }
        res.json({
            message:
                formulatingData.formulatingData[req.body.courseId][
                req.body.key
                ],
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 Bonus表徵制定 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//學生儲存 writeFormulating 內容
router.post("/savewriteformulating", async (req, res) => {
    try {
        const formulatingData = await formulatingconfig.findOne({
            studentClass: req.user.studentClass,
            studentName: req.user.studentName,
            studentId: req.user.studentId,
        })

        if (formulatingData === null) {
            const newFormulatingData = new formulatingconfig({
                studentId: req.user.studentId,
                studentName: req.user.studentName,
                studentClass: req.user.studentClass,
                formulatingData: {
                    [req.body.courseId]: {
                        [req.body.key]: req.body.formulatingData,
                    },
                },
            })

            newFormulatingData.save()
            res.json({
                message: "success",
                status: 200,
            })
            return
        }
        if (formulatingData[req.body.courseId] === null) {
            formulatingData[req.body.courseId] = {
                [req.body.key]: req.body.formulatingData,
            }
        } else {
            formulatingData.formulatingData[req.body.courseId][req.body.key] =
                req.body.formulatingData
        }

        await formulatingconfig
            .updateOne(
                {
                    studentClass: req.user.studentClass,
                    studentName: req.user.studentName,
                    studentId: req.user.studentId,
                },
                {
                    formulatingData: formulatingData.formulatingData,
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
                    message: "儲存 writeFormulating 失敗，請再試一次",
                    status: 500,
                })
            })
    } catch (err) {
        console.log(err)
        res.json({
            message: "儲存 Bonus表徵制定 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//-------------------------------------------------------
//學生讀取 goList
router.post("/readgolist", async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
        })


        if (
            studentData.studentGoList === null ||
            studentData.studentGoList === undefined ||
            studentData.studentGoList[req.body.courseId] === null
        ) {
            const standardData = await standardcontent.findOne({
                _id: req.body.courseId
            })
            res.json({
                message: standardData.standardGoList,
                status: 200,
            })
            return
        }
        res.json({
            message: studentData.studentGoList[req.body.courseId],
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取存檔失敗，請重新整理",
            status: 500,
        })
    }
})
//學生儲存 goList
router.post("/savegolist", async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
        })

        if (
            studentData.studentGoList === undefined ||
            studentData.studentGoList === null
        ) {
            studentData.studentGoList = {
                [req.body.courseId]: req.body.goList,
            }
        } else {
            studentData.studentGoList[req.body.courseId] = req.body.goList
        }

        await studentConfig
            .updateOne(
                {
                    studentClass: req.user.studentClass,
                    studentId: req.user.studentId,
                },
                {
                    studentGoList: studentData.studentGoList,
                    studentCodeList: studentData.studentCodeList,
                }
            )
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: "success",
                        status: 200,
                    })
                } else {
                    res.json({
                        message: "儲存失敗，請再試一次",
                        status: 500,
                    })
                }
            })
    } catch (err) {
        console.log(err)
        res.json({
            message: "error",
            status: 500,
        })
    }
})
//學生重整 goList
router.post("/restartgolist", async (req, res) => {
    try {
        //尋找 GoList
        const standardData = await standardcontent.findOne({
            _id: req.body.courseId,
        })
        //尋找學生資料
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,

        })
        // GoList
        if (studentData.studentGoList !== undefined) {
            studentData.studentGoList[req.body.courseId] =
                standardData.standardGoList
        }
        // CodeList
        if (studentData.studentCodeList !== undefined) {
            studentData.studentCodeList[req.body.courseId] =
                standardData.standardCodeList
        }
        //重整 GoList
        await studentConfig
            .updateOne(
                {
                    studentClass: req.user.studentClass,
                    studentId: req.user.studentId,
                },
                {
                    studentGoList: studentData.studentGoList,
                    studentCodeList: studentData.studentCodeList,
                }
            )
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: "success",
                        status: 200,
                    })
                } else {
                    res.json({
                        message: "重整 GoList 失敗，請重新整理網頁！",
                        status: 500,
                    })
                }
            })
    } catch (err) {
        console.log(err)
        res.json({
            message: "重整 golist 失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
//學生更新 goList
router.post("/downloadgolist", async (req, res) => {
    try {
        //尋找 GoList
        const standardData = await standardcontent.findOne({
            _id: req.body.courseId,
        })
        //尋找學生資料
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
        })
        // GoList
        if (studentData.studentGoList[req.body.courseId] !== undefined) {
            studentData.studentGoList[req.body.courseId] =
                standardData.standardGoList
        }
        //更新 GoList
        await studentConfig
            .updateOne(
                {
                    studentClass: req.user.studentClass,
                    studentId: req.user.studentId,
                },
                {
                    studentGoList: studentData.studentGoList,
                }
            )
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: "success",
                        status: 200,
                    })
                } else {
                    res.json({
                        message: "更新 GoList 失敗，請重新整理網頁！",
                        status: 500,
                    })
                }
            })
    } catch (err) {
        console.log(err)
        res.json({
            message: "重整 golist 失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
//學生讀取 cowork
router.post("/readcowork", async (req, res) => {
    try {
        const coworkData = await coworkcontent.findOne({ _id: req.body.courseId })

        const coworkStatus = await coworkconfig.findOne({ groupId: req.body.groupId })

        res.json(
            {
                message: {
                    coworkData: coworkData.standardGoList,
                    coworkStatus: {
                        process: coworkStatus.coworkStatus.process,
                        studentGroup: coworkStatus.studentGroup
                    }
                },
                status: 200
            }
        )
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取存檔失敗，請重新整理",
            status: 500,
        })
    }
})

//個人模式 code 增刪區域------------------------------------
//學生讀取 code
router.post("/readcode", async (req, res) => {
    try {
        const returnData = {
            code: "",
            hintList: [],
            status: 200,
        }

        await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
        }).then(response => {
            if (response.studentCodeList === undefined || response.studentCodeList === null) {
                returnData.code = ""
            } else {
                if (response.studentCodeList[req.body.courseId] === undefined || response.studentCodeList[req.body.courseId] === null) {
                    returnData.code = ""
                } else {
                    returnData.code = response.studentCodeList[req.body.courseId][req.body.keyCode]
                }
            }
        })

        await standardcontent.findOne({ _id: req.body.courseId }).then(response => {
            if (response.standardProgramming[req.body.keyCode] === undefined) {
                res.json(returnData)
            } else {
                returnData.hintList = response.standardProgramming[req.body.keyCode].hintList
                res.json(returnData)
            }
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取 code 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})
//學生儲存 code
router.post("/savecode", async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
        })

        if (studentData.studentCodeList === undefined) {
            // 初始化載入
            studentData.studentCodeList = {
                [req.body.courseId]: {
                    [req.body.keyCode]: {
                        code: req.body.codeArea
                    },
                },
            }
        } else {
            // 後續新增
            if (studentData.studentCodeList[req.body.courseId] === undefined || studentData.studentCodeList[req.body.courseId] === null) {
                studentData.studentCodeList[req.body.courseId] = {
                    [req.body.keyCode]: {
                        code: req.body.codeArea
                    }
                }
            } else {
                studentData.studentCodeList[req.body.courseId][req.body.keyCode] = {
                    code: req.body.codeArea
                }
            }

        }

        //存入 coding 檔案
        await studentConfig
            .updateOne(
                {
                    studentClass: req.user.studentClass,
                    studentId: req.user.studentId,
                },
                { studentCodeList: studentData.studentCodeList }
            )
            .then(response => {
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
//學生刪除 code
router.post("/deletecode", async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
        })

        delete studentData.studentCodeList[req.body.courseId]

        await studentConfig
            .updateOne(
                { studentId: req.user.studentId },
                { studentCodeList: studentData.studentCodeList }
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
                    message: "刪除該 node code 失敗，請重新整理網頁！",
                    status: 500,
                })
            })
    } catch (err) {
        console.log(err)
        res.json({
            message: "刪除失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
//-------------------------------------------------------
//學生暫存 reflection
router.post("/tempsavereflection", async (req, res) => {
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
//學生儲存 reflection
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
            workhard: converDangerString(req.body.workhard) || "",
            difficult: converDangerString(req.body.difficult) || "",
            scoring: req.body.scoring || 0,
        }

        const studentData = await studentConfig.findOne({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
        })

        const nextProgress = parseInt(req.body.key.split("-")[0]) + 1

        // 如果接收到的 Progress 比原本的大 才進行覆蓋
        // 否則維持原本的 Progress
        studentData.studentGoList[req.body.courseId].progress > nextProgress
            ? null
            : (studentData.studentGoList[req.body.courseId].progress =
                nextProgress)

        await studentConfig.updateOne(
            {
                studentId: req.user.studentId,
                studentClass: req.user.studentClass,
            },
            {
                studentGoList: studentData.studentGoList,
            }
        )
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
//學生讀取 reflection
router.post("/readreflection", async (req, res) => {
    try {
        const reflectionData = await reflectionconfig.findOne({
            studentId: req.user.studentId,
            class: req.user.studentClass,
            courseId: req.body.courseId,
        })

        if (reflectionData == undefined) {
            res.json({
                status: 501,
            })
            return
        }

        if (reflectionData.studentReflectionData[req.body.key] == undefined) {
            res.json({
                status: 501,
            })
            return
        }

        res.json({
            message: reflectionData.studentReflectionData[req.body.key],
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 reflection 失敗，請聯絡管理員(err)",
            status: 500,
        })
    }
})

//學生讀取所有人的 Progress 以及各 Progress 總人數
router.post("/getallstudentprogress", async (req, res) => {
    try {
        const studentConfigs = await studentConfig.find({ studentClass: req.user.studentClass })

        const returnData = []

        for (const { studentName, studentGoList } of studentConfigs) {
            if (studentGoList !== undefined) {
                if (studentGoList[req.body.courseId] !== undefined && studentGoList[req.body.courseId] !== null) {
                    const studentProgress = studentGoList[req.body.courseId].progress || 0

                    if (studentProgress > returnData.length) {
                        for (let i = returnData.length; i <= studentProgress; i++) {
                            returnData.push({ count: 0, member: [] })
                        }
                    }

                    if (studentProgress !== 0) {
                        returnData[studentProgress - 1].count++
                        returnData[studentProgress - 1].member.push(studentName)
                    }
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

//學生取得訊息紀錄
router.post("/getmessagehistory", async (req, res) => {
    try {
        const messageData = await chatroomconfig.findOne({
            chatRoomId: req.user.studentChatRoomId,
            access: true,
        })

        // 50 則訊息 0 ~ 49
        // 49 48 47 46 45 44 44 42 41 40
        // 39 ~ 30
        // 50 - (20) => 30
        // 50 - (11)  => 39
        let sliceStart = messageData.messageHistory.length - (10 * req.body.freshCount)
        let sliceEnd = messageData.messageHistory.length - (1 + 10 * (req.body.freshCount - 1))
        let isTop = false
        if (sliceEnd < 0) {
            res.json({
                status: 501,
            })
            return
        }

        while (sliceStart < 0) {
            sliceStart++
            isTop = true
        }

        if (sliceStart === 0 && sliceEnd === 0) {
            sliceEnd = 1
        }

        const messageSlice = messageData.messageHistory.slice(
            sliceStart,
            sliceEnd
        )

        res.json({
            message: messageSlice,
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得歷史訊息失敗，請聯繫管理員 (err)",
            status: 500,
        })
    }
})
//學生點擊事件監聽
router.post("/listener", async (req, res) => {
    try {
        const listenerData = await listenerconfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentName: req.user.studentName,
        })


        if (listenerData == null) {
            const newListenerData = new listenerconfig({
                studentName: req.user.studentName,
                studentClass: req.user.studentClass,
                studentId: req.user.studentId,
                listenerData: [
                    {
                        "頁面": req.body.page,
                        "主項": req.body.mainTag,
                        "小項": req.body.subTag,
                        "子項": req.body.aidTag,
                        "描述": req.body.description,
                        "時間": req.body.time
                    },
                ],
            })

            newListenerData.save()

            res.json({
                message: "success",
                status: 200,
            })
        } else {
            listenerData.listenerData.push({
                "頁面": req.body.page,
                "主項": req.body.mainTag,
                "小項": req.body.subTag,
                "子項": req.body.aidTag,
                "描述": req.body.description,
                "時間": req.body.time
            })

            await listenerconfig
                .updateOne(
                    {
                        studentName: req.user.studentName,
                        studentId: req.user.studentId,
                        studentClass: req.user.studentClass,
                    },
                    {
                        listenerData: listenerData.listenerData,
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
                        message: "DOM 監聽事件失敗，請重新整理網頁",
                        status: 501,
                    })
                })
        }
    } catch (err) {
        console.log(err)
        res.json({
            message: "DOM 監聽事件失敗，請重新整理網頁",
            status: 501,
        })
    }
})
//確認使用者身分
router.post('/getpermission', async (req, res) => {
    try {
        const adminConfig = await adminconfig.findOne({ adminId: req.user.studentId })
        if (adminConfig === null) return res.json({ message: false, status: 200 })
        if (adminConfig.adminId == req.user.studentId) {
            res.json({
                message: true,
                status: 200,
            })
        } else {
            res.json({
                message: false,
                status: 200
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            message: "無法確認使用者身分，請聯繫管理員(err)",
            status: 501,
        })
    }
})
export default router
