import express from 'express'
import bcrypt from 'bcryptjs'
const router = express.Router()

import studentConfig from '../models/studentconfig.js'
import standardcontent from '../models/standardcontent.js'
import chatroomconfig from '../models/chatroomconfig.js'

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
            studentData.studentGoList === undefined
        ) {
            const standardData = await standardcontent.findOne({
                class: req.user.studentClass,
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

        studentData.studentGoList[req.body.courseId] = req.body.goList

        if (studentData.studentCodeList[req.body.courseId] === undefined) {
            studentData.studentCodeList[req.body.courseId] = { 0: "-100" }
        }

        console.log(studentData.studentCodeList)

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
            class: req.user.studentClass,
            _id: req.body.courseId,
            access: true
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
            class: req.user.studentClass,
            _id: req.body.courseId,
            access: true
        })
        //尋找學生資料
        const studentData = await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        })
        // GoList
        if (studentData.studentGoList[req.body.courseId] !== undefined) {
            studentData.studentGoList[req.body.courseId] = standardData.standardGoList[req.body.courseId]
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
        await studentConfig.findOne({
            studentClass: req.user.studentClass,
            studentId: req.user.studentId,
            studentAccess: true
        }).then(response => {
            if (response.studentCodeList[req.body.courseId] === undefined) {
                res.json(
                    {
                        code: '',
                        status: 200
                    }
                )
                return
            }
            res.json(
                {
                    code: response.studentCodeList[req.body.courseId][req.body.keyCode],
                    status: 200
                }
            )
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

        if (studentData.studentCodeList[req.body.courseId] === undefined) {
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
//學生重整 code
router.post('/restartcode', async (req, res) => {
    try {
        let standardCodeList = {}
        //尋找 Code
        await standardcontent.findOne({ class: req.user.studentClass, access: true }).then(response => {
            standardCodeList = response.standardCodeList || {}
        })
        //更新 Code
        await studentConfig.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentCodeList: standardCodeList })
            .then(response => {
                if (response.acknowledged) {
                    res.json({
                        message: 'success',
                        status: 200
                    })
                } else {
                    res.json({
                        message: '重整 Code 失敗，請重新整理網頁！',
                        status: 500
                    })
                }

            })

    }
    catch (err) {
        console.log(err)
        res.json({
            message: '重整 Code 失敗，請聯繫管理員 (err)',
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
                message: 'no more',
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

export default router 