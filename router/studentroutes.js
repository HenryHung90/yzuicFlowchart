import express from 'express'
import bcrypt from 'bcryptjs'
const router = express.Router()


import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

import studentConfig from '../models/studentconfig.js'
import standardcontent from '../models/standardcontent.js'
import chatroomconfig from '../models/chatroomconfig.js'
import reflectionconfig from '../models/reflectionconfig.js'
import listenerconfig from '../models/listenerconfig.js'

function converDangerString(string) {
    let clean = DOMPurify.sanitize(string)
    let outputString = []

    const converString = new Map(
        [
            ["\<", "&lt;"],
            ["\>", "&gt;"],
            ["\&", "$amp;"],
            ["\"", "&quot;"],
            ["\'", "&#039;"]
        ]
    )

    clean.split("").map((value) => {
        converString.get(value) == undefined ? outputString.push(value) : outputString.push(converString.get(value))
    })
    return outputString.join("")
}


const saltRound = 10

//學生修改密碼
router.post('/changepassword', async (req, res) => {
    try {
        let result = false
        const studentData = await studentConfig.findOne({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
            studentAccess: true
        })

        await bcrypt.compare(req.body.oldPassword, studentData.studentPassword).then(response => {
            result = response
        })
        if (!result) {
            res.json(
                {
                    message: '舊密碼輸入錯誤!',
                    status: 500,
                }
            )
            return
        }

        await bcrypt.hash(req.body.newPassword, saltRound).then(hashed => {
            studentConfig.updateOne({
                studentId: req.user.studentId,
                studentClass: req.user.studentClass,
                studentAccess: true
            }, {
                studentPassword: hashed
            }).then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: '修改成功!',
                        status: 200,
                    })
                } else {
                    res.json({
                        message: '修改失敗!請再試一次',
                        status: 201,
                    })
                }
            })
        })

    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '修改失敗，請聯繫管理員 (err)',
                status: 500
            }
        )
    }
})
//學生取得所有教學資料
router.post('/getallcourse', async (req, res) => {
    try {
        const standardData = await standardcontent.find({ access: true })

        res.json({
            standardData: standardData,
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "取得教材時發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//學生進入教程
router.get('/:courseId', async (req, res) => {
    try {
        const courseData = await standardcontent.findOne({ _id: req.params.courseId })
        if (courseData === null || courseData === undefined || courseData.length === 0) {
            res.redirect(`/home/${req.user.studentId}`)
            return
        }
        res.render('./golist', {
            studentId: req.user.studentId,
            courseId: req.params.courseId,
            courseTitle: courseData.goListTitle,
            studentChatRoomId: req.user.studentChatRoomId,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "錯誤開啟，請聯繫管理員(err)",
            status: 500,
        })
    }
})

// 學生取得 demo 位置
router.post('/getmaterial', async (req, res) => {
    try {
        const materialData = await standardcontent.findOne({
            _id: req.body.courseId
        })

        if (materialData.standardMaterial === undefined ||
            materialData.standardMaterial === null) {
            res.json({
                message: "查無此demo，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: materialData.standardMaterial,
            status: 200
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
router.post('/getstarting', async (req, res) => {
    try {
        const materialData = await standardcontent.findOne({
            _id: req.body.courseId
        })

        if (materialData.standardStarting === undefined ||
            materialData.standardStarting === null) {
            res.json({
                message: "查無此demo，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: materialData.standardStarting[req.body.key],
            status: 200
        })


    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 start task 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
// 學生取得 understanding 內容
router.post('/getunderstanding', async (req, res) => {
    try {
        const understandingData = await standardcontent.findOne({
            _id: req.body.courseId
        })

        if (understandingData.standardUnderstanding === undefined ||
            understandingData.standardUnderstanding === null) {
            res.json({
                message: "查無 探索理解，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: understandingData.standardUnderstanding[req.body.key],
            status: 200
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
router.post('/getformulating', async (req, res) => {
    try {
        const understandingData = await standardcontent.findOne({
            _id: req.body.courseId
        })

        if (understandingData.standardFormulating === undefined ||
            understandingData.standardFormulating === null) {
            res.json({
                message: "查無 表徵制定，請稍後再試",
                status: 500,
            })
            return
        }
        res.json({
            message: understandingData.standardFormulating[req.body.key],
            status: 200
        })

    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 表徵制定 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})

//學生讀取 goList
router.post('/readgolist', async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        })

        if (studentData.studentGoList === null ||
            studentData.studentGoList === undefined ||
            studentData.studentGoList[req.body.courseId] === null
        ) {
            const standardData = await standardcontent.findOne({
                _id: req.body.courseId,
                access: true
            })
            res.json({
                message: standardData.standardGoList,
                status: 200
            })
            return
        }
        res.json(
            {
                message: studentData.studentGoList[req.body.courseId],
                status: 200
            }
        )
    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '讀取存檔失敗，請重新整理',
                status: 500,
            }
        )
    }
})
//學生儲存 goList
router.post('/savegolist', async (req, res) => {
    try {
        const studentData = await studentConfig.findOne(
            {
                studentClass: req.user.studentClass,
                studentId: req.user.studentId,
                studentAccess: true
            })



        if (studentData.studentGoList === undefined || studentData.studentGoList === {}) {
            studentData.studentGoList = {
                [req.body.courseId]: req.body.goList
            }
        } else {
            studentData.studentGoList[req.body.courseId] = req.body.goList
        }

        await studentConfig.updateOne(
            {
                studentClass: req.user.studentClass,
                studentId: req.user.studentId,
                studentAccess: true
            },
            {
                studentGoList: studentData.studentGoList,
                studentCodeList: studentData.studentCodeList
            })
            .then(response => {
                if (response.acknowledged) {
                    res.json(
                        {
                            message: 'success',
                            status: 200
                        }
                    )
                } else {
                    res.json(
                        {
                            message: '儲存失敗，請再試一次',
                            status: 500
                        }
                    )
                }

            })
    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: 'error',
                status: 500,
            }
        )
    }
})
//學生重整 goList
router.post('/restartgolist', async (req, res) => {
    try {
        //尋找 GoList
        const standardData = await standardcontent.findOne({
            _id: req.body.courseId,
        })
        //尋找學生資料
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        })
        // GoList
        if (studentData.studentGoList !== undefined) {
            studentData.studentGoList[req.body.courseId] = standardData.standardGoList
        }
        // CodeList
        if (studentData.studentCodeList !== undefined) {
            studentData.studentCodeList[req.body.courseId] = standardData.standardCodeList
        }
        //重整 GoList
        await studentConfig.updateOne(
            { studentClass: req.user.studentClass, studentId: req.user.studentId, studentAccess: true },
            {
                studentGoList: studentData.studentGoList,
                studentCodeList: studentData.studentCodeList
            })
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: 'success',
                        status: 200
                    })
                } else {
                    res.json({
                        message: '重整 GoList 失敗，請重新整理網頁！',
                        status: 500
                    })
                }
            })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: '重整 golist 失敗，請聯繫管理員 (err)',
            status: 500
        })
    }
})
//學生更新 goList
router.post('/downloadgolist', async (req, res) => {
    try {
        //尋找 GoList
        const standardData = await standardcontent.findOne({
            _id: req.body.courseId
        })
        //尋找學生資料
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        })
        // GoList
        if (studentData.studentGoList[req.body.courseId] !== undefined) {
            studentData.studentGoList[req.body.courseId] = standardData.standardGoList
        }
        //更新 GoList
        await studentConfig.updateOne(
            { studentClass: req.user.studentClass, studentId: req.user.studentId, studentAccess: true },
            {
                studentGoList: studentData.studentGoList,
            })
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: 'success',
                        status: 200
                    })
                } else {
                    res.json({
                        message: '更新 GoList 失敗，請重新整理網頁！',
                        status: 500
                    })
                }
            })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: '重整 golist 失敗，請聯繫管理員 (err)',
            status: 500
        })
    }
})

//學生讀取 code
router.post('/readcode', async (req, res) => {
    try {
        const returnData = {
            code: '',
            hint: '',
            hintCode: '123',
            status: 200
        }

        await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        }).then(response => {
            if (response.studentCodeList === undefined || response.studentCodeList === null) {
                returnData.code = ""
            } else {
                if (response.studentCodeList[req.body.courseId] === null) {
                    returnData.code = ""
                } else {
                    returnData.code = response.studentCodeList[req.body.courseId][req.body.keyCode]
                }
            }
        })

        await standardcontent.findOne({
            _id: req.body.courseId
        }).then(response => {
            if (response.standardProgramming[req.body.keyCode] === undefined) {
                res.json(returnData)
            } else {
                returnData.hint = response.standardProgramming[req.body.keyCode].hint
                returnData.hintCode = response.standardProgramming[req.body.keyCode].hintCode
                res.json(returnData)
            }
        })

    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '讀取 code 失敗，請聯絡管理員 (err)',
                status: 500,
            }
        )
    }
})
//學生儲存 code
router.post('/savecode', async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        })

        if (studentData.studentCodeList[req.body.courseId] === undefined || studentData.studentCodeList[req.body.courseId] === null) {
            // 初始化載入
            studentData.studentCodeList[req.body.courseId] = {
                [req.body.keyCode]: {
                    setting: req.body.setting,
                    config: req.body.config,
                    preload: req.body.preload,
                    create: req.body.create,
                    update: req.body.update,
                    custom: req.body.custom,
                }
            }
        } else {
            // 後續新增
            studentData.studentCodeList[req.body.courseId][req.body.keyCode] = {
                setting: req.body.setting,
                config: req.body.config,
                preload: req.body.preload,
                create: req.body.create,
                update: req.body.update,
                custom: req.body.custom
            }
        }

        //存入 coding 檔案
        await studentConfig.updateOne(
            {
                studentClass: req.user.studentClass,
                studentId: req.user.studentId,
                studentAccess: true
            },
            { studentCodeList: studentData.studentCodeList }
        ).then(response => {
            if (response.acknowledged) {
                res.json(
                    {
                        message: 'success',
                        status: 200
                    }
                )
            } else {
                res.json(
                    {
                        message: '儲存 code 失敗，請記下您當前的 code 並重新整理頁面',
                        status: 500
                    }
                )
            }
        })

    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '儲存 code 失敗，請記下您當前的 code 並聯絡管理員 (err)',
                status: 500
            }
        )
    }
})
//學生刪除 code
router.post('/deletecode', async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        })

        delete studentData.studentCodeList[req.body.courseId]

        await studentConfig.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentCodeList: studentData.studentCodeList }
        ).then(response => {
            if (response.acknowledged) {
                res.json({
                    message: 'success',
                    status: 200
                })
                return
            }
            res.json({
                message: '刪除該 node code 失敗，請重新整理網頁！',
                status: 500
            })
        })
    }
    catch (err) {
        console.log(err)
        res.json(
            {
                message: '刪除失敗，請聯繫管理員 (err)',
                status: 500
            }
        )
    }
})

//學生儲存 reflection
router.post('/savereflection', async (req, res) => {
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
                        learing: converDangerString(req.body.learning) || '',
                        workhard: converDangerString(req.body.workhard) || '',
                        difficult: converDangerString(req.body.difficult) || '',
                        scoring: req.body.scoring || 0
                    }
                }
            })

            newReflectionData.save()

            res.json({
                message: 'success',
                status: 200
            })
            return
        }

        //其他
        reflectionData.studentReflectionData[req.body.key] = {
            learing: converDangerString(req.body.learning) || '',
            workhard: converDangerString(req.body.workhard) || '',
            difficult: converDangerString(req.body.difficult) || '',
            scoring: req.body.scoring || 0
        }

        const studentData = await studentConfig.findOne({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
            studentAccess: true,
        })

        const nextProgress = parseInt(req.body.key.split('-')[0]) + 1

        // 如果接收到的 Progress 比原本的大 才進行覆蓋
        // 否則維持原本的 Progress
        studentData.studentGoList[req.body.courseId].progress > nextProgress ? null : studentData.studentGoList[req.body.courseId].progress = nextProgress

        await studentConfig.updateOne({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
            studentAccess: true,
        }, {
            studentGoList: studentData.studentGoList
        })

        await reflectionconfig.updateOne({
            studentId: req.user.studentId,
            class: req.user.studentClass,
            courseId: req.body.courseId,
        }, {
            studentReflectionData: reflectionData.studentReflectionData
        }).then(response => {
            if (response.acknowledged) {
                res.json({
                    message: 'success',
                    status: 200
                })
                return
            }
            res.json({
                message: '儲存 reflection 失敗，請再試一次!',
                status: 500
            })
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "儲存 Reflection 失敗，請聯繫管理員(err)",
            status: 500
        })
    }
})
//學生讀取 reflection
router.post('/readreflection', async (req, res) => {
    try {
        const reflectionData = await reflectionconfig.findOne({
            studentId: req.user.studentId,
            class: req.user.studentClass,
            courseId: req.body.courseId,
        })

        if (reflectionData == undefined) {
            res.json({
                status: 501
            })
            return
        }

        if (reflectionData.studentReflectionData[req.body.key] == undefined) {
            res.json({
                status: 501
            })
            return
        }

        res.json({
            message: reflectionData.studentReflectionData[req.body.key],
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "取得 reflection 失敗，請聯絡管理員(err)",
            status: 500
        })
    }
})

//學生取得訊息紀錄
router.post('/getmessagehistory', async (req, res) => {
    try {
        const messageData = await chatroomconfig.findOne({ chatRoomId: req.body.chatRoomId, access: true })

        let sliceStart = messageData.messageHistory.length - (11 + (11 * req.body.freshCount))
        let sliceEnd = messageData.messageHistory.length - (1 + (11 * req.body.freshCount))
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

        const messageSlice = messageData.messageHistory.slice(sliceStart, sliceEnd)

        res.json({
            message: messageSlice,
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: '取得歷史訊息失敗，請聯繫管理員 (err)',
            status: 500
        })
    }
})
//學生點擊事件監聽
router.post('/listener', async (req, res) => {
    try {
        const listenerData = await listenerconfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentName: req.user.studentName
        })

        if (listenerData == null) {
            const newListenerData = new listenerconfig({
                studentName: req.user.studentName,
                studentClass: req.user.studentClass,
                studentId: req.user.studentId,
                listenerData: [
                    {
                        time: req.body.time,
                        operation: req.body.operation,
                        description: req.body.description,
                        courseTitle: req.body.courseTitle,
                    }
                ]
            })

            newListenerData.save()

            res.json({
                message: 'success',
                status: 200
            })
        } else {
            listenerData.listenerData.push({
                time: req.body.time,
                operation: req.body.operation,
                description: req.body.description,
                courseTitle: req.body.courseTitle,
            })

            await listenerconfig.updateOne({
                studentName: req.user.studentName,
                studentId: req.user.studentId,
                studentClass: req.user.studentClass,
            }, {
                listenerData: listenerData.listenerData
            }).then(response => {
                if(response.acknowledged){
                    res.json({
                        message: 'success',
                        status: 200
                    })
                    return
                }
                res.json({
                    message: 'DOM 監聽事件失敗，請重新整理網頁',
                    status: 501
                })
            })
        }

    } catch (err) {
        console.log(err)
        res.json({
            message: 'DOM 監聽事件失敗，請重新整理網頁',
            status: 501,
        })
    }
})

export default router 