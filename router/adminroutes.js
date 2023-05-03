import express from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
const router = express.Router()

import studentConfig from '../models/studentconfig.js'
import standardcontent from '../models/standardcontent.js'
import chatroomconfig from '../models/chatroomconfig.js'
import adminConfig from '../models/adminconfig.js'
import listenerConfig from '../models/listenerconfig.js'
import reflectionconfig from '../models/reflectionconfig.js'

const saltRound = 10


// router.post('/addadmin', async (req, res) => {
//     try {
//         bcrypt.hash(req.body.adminPassword, saltRound, async (err, hashedPassword) => {
//             if (err) throw 'bad hash'

//             const newAdmin = new adminConfig({
//                 adminId: req.body.adminId,
//                 adminPassword: hashedPassword,
//                 adminName: req.body.adminName
//             })
//             newAdmin.save()

//             res.json({
//                 message: 'success',
//                 status: 200
//             })
//         })

//     } catch (err) {
//         console.log(err)
//         res.json({
//             message: '新增管理員錯誤，請聯繫管理員(err)',
//             status: 500,
//         })
//     }
// })

//新增學生
router.post('/addstudent', async (req, res) => {
    try {
        let tempPassword

        if (req.body.studentClass == null) {
            throw 'studentclass require'
        }
        if (req.body.studentId == null) {
            throw 'studentid require'
        }
        if (req.body.studentPassword == null) {
            tempPassword = req.body.studentId
        } else {
            tempPassword = req.body.studentPassword
        }
        if (req.body.studentName == null) {
            throw 'studentname require'
        }
        if (req.body.studentAccess == null) {
            throw 'studentaccess require'
        }


        await studentConfig.findOne({ studentId: req.body.studentId, studentClass: req.body.studentClass }).then(response => {
            if (response == null) {
                bcrypt.hash(tempPassword, saltRound, async (err, hashedPassword) => {
                    if (err) throw 'bad hash'

                    const newStudent = new studentConfig({
                        studentClass: req.body.studentClass,
                        studentId: req.body.studentId,
                        studentPassword: hashedPassword,
                        studentName: req.body.studentName,
                        studentAccess: req.body.studentAccess,
                        studentGoList: {},
                        studentCodeList: {}
                    })
                    newStudent.save()
                    res.json({
                        message: 'success',
                        status: 200
                    })
                })
            } else {
                throw 'student is exist'
            }
        })

    }
    catch (err) {
        console.log(err)
        res.json({
            message: err,
            status: 500
        })
    }

})

//新增 goList Standard 各項內容
router.post('/addstandardcontent', async (req, res) => {
    try {
        const newStandardcontent = new standardcontent({
            class: req.body.class,
            access: true,
            goListTitle: req.body.goListTitle,
            standardGoList: req.body.standardGoList,
            standardCodeList: req.body.standardCodeList || {},
            standardUnderstanding: req.body.standardUnderstanding || {},
            standardFormulating: req.body.standardFormulating || {}
        })

        newStandardcontent.save()
        res.json({
            message: "success",
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "新增go list失敗，請聯繫管理員(err)",
            status: 500,
        })
    }

})
//修改 goList Standard 各項內容
router.post('/updatestandardgolist', async (req, res) => {
    try {
        const standardData = await standardcontent.findOne({
            _id: req.body._id
        })

        await standardcontent.updateOne({
            _id: req.body._id
        }, {
            standardGoList: req.body.standardGoList,
        })

        res.json({
            message: "success",
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "編輯go list失敗，請聯繫管理員(err)",
            status: 500,
        })
    }

})
//修改 goList understanding 內容
router.post('/updatestandardunderstanding', async (req, res) => {
    try {
        const understandingData = await standardcontent.findOne({
            _id: req.body._id
        })

        understandingData.standardUnderstanding[req.body.key] = req.body.standardUnderstanding


        await standardcontent.updateOne({
            _id: req.body._id
        }, {
            standardUnderstanding: understandingData.standardUnderstanding
        })

        res.json({
            message: "success",
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "編輯 understanding 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//修改 goList formulating 內容
router.post('/updatestandardformulating', async (req, res) => {
    try {
        const understandingData = await standardcontent.findOne({
            _id: req.body._id
        })

        understandingData.standardFormulating[req.body.key] = req.body.standardFormulating

        await standardcontent.updateOne({
            _id: req.body._id
        }, {
            standardFormulating: understandingData.standardFormulating
        })

        res.json({
            message: "success",
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "編輯 formulating 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})

//新增 chatroom (加入 studentId)
router.post('/addchatroom', async (req, res) => {
    try {
        const chatRoomId = uuidv4()

        if (req.body.chatRoomId === '') {
            const newChatRoom = new chatroomconfig({
                class: req.body.class,
                access: true,
                chatRoomId: chatRoomId,
                studentGroup: req.body.studentGroup,
                messageHistory: []
            })

            newChatRoom.save()

            for (let studentId of req.body.studentGroup) {
                studentConfig.updateOne(
                    { studentAccess: true, studentClass: req.body.class, studentId: studentId },
                    { studentChatRoomId: chatRoomId }
                ).then(response => {
                    if (!response.acknowledged) {
                        res.json({
                            message: studentId + "加入房間失敗",
                            status: 500
                        })
                        return
                    }
                })
            }
            res.json({
                message: `創建成功!\n房間ID:${chatRoomId}\n學生群組${req.body.studentGroup.map(value => { return value })}`,
                status: 200,
            })
        } else {
            await chatroomconfig.updateOne(
                { class: req.body.class, chatRoomId: req.body.chatRoomId },
                { studentGroupId: req.body.studentGroupId }
            )
            for (let studentId of req.body.studentGroup) {
                studentConfig.updateOne(
                    { studentAccess: true, studentClass: req.body.class, studentId: studentId },
                    { studentChatRoomId: req.body.chatRoomId }
                ).then(response => {
                    if (!response.acknowledged) {
                        res.json({
                            message: studentId + "加入房間失敗",
                            status: 500
                        })
                        return
                    }
                })
            }
            res.json({
                message: `加入成功!\n房間ID:${chatRoomId}\n學生群組${req.body.studentGroup.map(value => { return value })}`,
                status: 200,
            })
        }

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "新增聊天室失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//取得目前所有 chatroom
router.post('/getchatroom', async (req, res) => {
    try {
        const chatRoomData = await chatroomconfig.find({})

        if (chatRoomData === null) {
            res.json({
                message: 'empty',
                status: 501
            })
            return
        }
        res.json({
            message: { chatRoomId: chatRoomData.chatRoomId, studentGroup: chatRoomData.studentGroup },
            status: 200
        })

    } catch (err) {
        console.log(err)
        res.json({
            message: "取得聊天室失敗，請聯繫管理員(err)",
            status: 500,
        })
    }


})

//Admin 取得所有課程
router.post('/getallcourse', async (req, res) => {
    try {
        const standardData = await standardcontent.find({})

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
//Admin 取得所有學生
router.post('/getallstudent', async (req, res) => {
    try {
        const studentData = await studentConfig.find({})

        let returnStudentData = []


        for (let i = 0; i < studentData.length; i++) {
            returnStudentData.push(
                {
                    studentClass: studentData[i].studentClass,
                    studentId: studentData[i].studentId,
                    studentName: studentData[i].studentName,
                }
            )
        }

        returnStudentData.sort((a, b) => {
            return a.studentId > b.studentId ? 1 : -1
        })

        res.json({
            studentData: returnStudentData,
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "取得學生時發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})

//Admin 取得所有監聽
router.post('/getallstudentlistener', async (req, res) => {
    try {
        const listenData = await listenerConfig.find({})

        let sheetName = []
        let sheetData = []

        for (const { studentName, studentId, listenerData } of listenData) {
            // 分頁標頭
            sheetName.push(`${studentId}_${studentName}`)
            // 資料內容
            sheetData.push(listenerData)
        }

        res.json({
            message: {
                sheetName: sheetName,
                sheetData: sheetData
            },
            status: 200
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "取得監聽資料發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//Admin 取得單一學生監聽資料
router.post('/getsinglestudentlistener', async (req, res) => {
    try {
        const listenData = await listenerConfig.find({ studentId: req.body.studentId, studentClass: req.body.studentClass })

        let sheetName = []
        let sheetData = []

        for (const { studentName, studentId, listenerData } of listenData) {
            // 分頁標頭
            sheetName.push(`${studentId}_${studentName}`)
            // 資料內容
            sheetData.push(listenerData)
        }

        res.json({
            message: {
                sheetName: sheetName,
                sheetData: sheetData
            },
            status: 200
        })
    }
    catch {
        console.log(err)
        res.json({
            message: "取得監聽資料發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//Admin 取得所有學生 reflection
router.post('/getallstudentreflection', async (req, res) => {
    try {
        const reflectionData = await reflectionconfig.find({})

        let sheetName = []
        let sheetData = []

        for (const { studentId, studentName, courseId, studentReflectionData } of reflectionData) {
            const courseName = await standardcontent.findOne({ _id: courseId })

            
        }

    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取 reflection 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})
//Admin 取得單一學生 refletion
router.post('/getsinglestudentreflection', async (req, res) => {
    try {
        const reflectionData = await reflectionconfig.find({
            studentId: req.body.studentId,
        })

        let sheetName = []
        let sheetData = []

        for (const { courseId, studentReflectionData } of reflectionData) {
            const courseName = await standardcontent.findOne({ _id: courseId })

            sheetName.push(courseName.goListTitle)
            sheetData.push(Object.values(studentReflectionData))
        }

        res.json({
            message: {
                sheetName: sheetName,
                sheetData: sheetData
            },
            status: 200,
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取 reflection 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})

//Admin 進入課程
router.get('/:courseId', async (req, res) => {
    try {
        const courseData = await standardcontent.findOne({ _id: req.params.courseId })
        if (courseData === null || courseData === undefined || courseData.length === 0) {
            res.redirect(`/home/${req.user.adminId}`)
            return
        }
        res.render('./admin/golist', {
            courseId: req.params.courseId,
            courseTitle: courseData.goListTitle,
            adminId: req.user.adminId,
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

//Admin 取得學生GoList
router.post("/getstudentcourse", async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentId: req.body.studentId,
            studentClass: req.body.studentClass
        })

        const courseData = await standardcontent.find({})

        if (studentData.studentGoList === {} || studentData.studentGoList === undefined) {
            res.json({
                status: 501
            })
            return
        }

        res.json({
            message: {
                studentCourse: studentData.studentGoList,
                courseData: courseData
            },
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "無法取得學生 GoList，請聯繫管理員(err)",
            status: 500,
        })
    }
})
//Admin 讀取學生GoList
router.post('/readstudentcourse', async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentId: req.body.studentId,
        })

        if (studentData.studentGoList[req.body.courseId] === undefined) {
            res.json({
                message: "學生資料為空！",
                status: 500
            })
            return
        }

        res.json({
            message: studentData.studentGoList[req.body.courseId],
            status: 200
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "讀取學生 GoList 失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})

//Admin 讀取 Standard
router.post('/readstandard', async (req, res) => {
    try {
        const standardData = await standardcontent.findOne({ _id: req.body.courseId })

        res.json(
            {
                message: standardData.standardGoList,
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
//Admin 儲存 Standard
router.post('/savestandard', async (req, res) => {
    try {
        await standardcontent.updateOne({ _id: req.body.courseId, }, { standardGoList: req.body.goList })
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
                message: '儲存失敗，請聯繫管理員(err)',
                status: 500,
            }
        )
    }
})
//Admin 重整 Standard
router.post('/restartstandard', async (req, res) => {
    try {
        await standardcontent.updateOne({ _id: req.body.courseId, }, { standardGoList: {}, standardCodeList: {} })
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
                            message: '重整失敗，請再試一次',
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
                message: '重整失敗，請聯繫管理員(err)',
                status: 500,
            }
        )
    }
})

//Admin 讀取學生 Code
router.post('/readcode', async (req, res) => {
    try {
        const returnData = {
            code: "",
            hint: "",
            hintCode: "123",
            status: 200,
        }

        await studentConfig
            .findOne({
                studentId: req.body.studentId,
                studentAccess: true,
            })
            .then(response => {
                if (
                    response.studentCodeList === undefined ||
                    response.studentCodeList === null
                ) {
                    returnData.code = ""
                } else {
                    if (response.studentCodeList[req.body.courseId] === null) {
                        returnData.code = ""
                    } else {
                        returnData.code =
                            response.studentCodeList[req.body.courseId][
                            req.body.keyCode
                            ]
                    }
                }
            })

        await standardcontent
            .findOne({
                _id: req.body.courseId,
            })
            .then(response => {
                if (
                    response.standardProgramming[req.body.keyCode] === undefined
                ) {
                    res.json(returnData)
                } else {
                    returnData.hint =
                        response.standardProgramming[req.body.keyCode].hint
                    returnData.hintCode =
                        response.standardProgramming[req.body.keyCode].hintCode
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

//Admin 讀取學生 reflection
router.post('/readreflection', async (req, res) => {
    try {
        const reflectionData = await reflectionconfig.findOne({
            studentId: req.body.studentId,
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
            message: "讀取 reflection 失敗，請聯絡管理員 (err)",
            status: 500,
        })
    }
})


//Admin 新增 programming 中的 hint
router.post('/updateprogramminghint', async (req, res) => {
    try {
        const programmingHintData = await standardcontent.findOne({
            courseId: req.body.courseId
        })

        programmingHintData.standardProgramming[req.body.key] = req.body.standardProgramming

        await standardcontent.updateOne({
            courseId: req.body.courseId
        }, {
            standardProgramming: programmingHintData.standardProgramming
        }).then(response => {
            if (response.acknowledged) {
                res.json({
                    message: 'success',
                    status: 200
                })
                return
            }
            res.json({
                message: '新增失敗，請再試一次!',
                status: 500
            })
        })

    }
    catch (err) {
        console.log(err)
        res.json({
            message: '新增 hint 失敗，請聯繫管理員(err)',
            status: 500
        })
    }
})

//Admin 跳過路程（用於跳過預覽學生畫面時不必要的動作）
router.post('/skip', async (req, res) => {
    try {
        res.json({
            status: 501
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: '路由過程失敗，請聯繫管理員(err)',
            status: 500
        })
    }
})

export default router