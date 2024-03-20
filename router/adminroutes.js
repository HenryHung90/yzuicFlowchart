import express from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
const router = express.Router()

// import adminConfig from '../models/adminconfig.js'
import studentConfig from '../models/studentconfig.js'
import standardcontent from '../models/standardcontent.js'
import chatroomconfig from '../models/chatroomconfig.js'
import listenerConfig from '../models/listenerconfig.js'
import reflectionconfig from '../models/reflectionconfig.js'
import coworkconfig from '../models/coworkconfig.js'
import coworkcontent from '../models/coworkcontent.js';


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


        await studentConfig.findOne({ studentId: req.body.studentId, studentClass: req.body.studentClass }).then(response => {
            if (response == null) {
                bcrypt.hash(tempPassword, saltRound, async (err, hashedPassword) => {
                    if (err) throw 'bad hash'

                    const newStudent = new studentConfig({
                        studentClass: req.body.studentClass,
                        studentId: req.body.studentId,
                        studentPassword: hashedPassword,
                        studentName: req.body.studentName,
                        studentAccess: true,
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
// 批量新增學生
router.post('/updatestudentlist', async (req, res) => {
    try {
        if (req.body.studentList !== null || req.body.studentList !== undefined) {
            const studentData = await studentConfig.find({ studentClass: req.body.studentClass })

            const studentCheckMap = new Map()
            studentData.forEach(student => {
                studentCheckMap.set(student.studentId, student.studentName)
            })

            //檢測是否有錯
            let errorStudentId = []
            req.body.studentList.forEach(student => {
                console.log(student.studentId)
                if (studentCheckMap.has(student.studentId)) {
                    errorStudentId.push(student.studentId)
                }
            })
            if (errorStudentId.length > 0) {
                res.json({
                    message: `${errorStudentId.join(",")} 學生已存在`,
                    status: 501
                })
                return
            }

            //批量新增學生
            req.body.studentList.forEach(student => {
                if (student.studentPassword == "" || student.studentPassword == null) student.studentPassword = student.studentId

                bcrypt.hash(student.studentPassword, saltRound, async (err, hashedPassword) => {
                    if (err) throw 'bad hash'

                    await new studentConfig({
                        studentClass: student.studentClass,
                        studentId: student.studentId,
                        studentPassword: hashedPassword,
                        studentName: student.studentName,
                        studentAccess: true,
                        studentGoList: {},
                        studentCodeList: {}
                    }).save()
                })
            })
            res.json({
                message: 'success',
                status: 200
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            message: '批量上傳學生錯誤，請聯繫管理員(err)',
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

//新增 chatroom
router.post('/addchatroom', async (req, res) => {
    try {
        const chatRoomId = uuidv4()
        // 創造新的聊天室
        await new chatroomconfig({
            class: req.body.studentClass,
            access: true,
            chatRoomId: chatRoomId,
            studentGroup: req.body.studentGroup,
            messageHistory: []
        }).save()

        // 將學生加入群組
        for (const studentId of req.body.studentGroup) {
            await studentConfig.updateOne(
                { studentClass: req.body.studentClass, studentId: studentId },
                { studentChatRoomId: chatRoomId }
            ).then(response => {
                if (!response.acknowledged) {
                    res.json({
                        message: studentId + " 加入房間失敗",
                        status: 500
                    })
                    return
                }
            })
        }

        //尋找共編教材，並將教材配發給該群組
        const coworkContentData = await coworkcontent.find({ class: req.body.studentClass })
        if (coworkContentData !== null) {
            for (const { _id, coworkTitle } of coworkContentData) {
                await new coworkconfig({
                    class: req.body.studentClass,
                    coworkTitle: coworkTitle,
                    coworkContentId: _id,
                    coworkStatus: { process: 0, completeVote: new Array(req.body.studentGroup.length).fill(false), isComplete: false },
                    groupId: chatRoomId,
                    studentGroup: req.body.studentGroup,
                    coworkContent: {},
                    coworkTimesheet: { time: getNowTime("FullTime"), student: "Admin", coworkContent: "initialzed" }
                }).save()
            }
        }


        res.json({
            message: `創建成功!\n房間ID:${chatRoomId}\n學生群組${req.body.studentGroup.map(value => { return value })}`,
            status: 200,
        })
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
router.get('/getallchatroom', async (req, res) => {
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
            message: {
                chatRoom: chatRoomData
            },
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
//取得單一 chatroom
router.post('/getchatroom', async (req, res) => {
    try {
        const chatRoomData = await chatroomconfig.findOne({ chatRoomId: req.body.chatRoomId })

        if (chatRoomData === null) {
            res.json({
                message: 'empty',
                status: 501
            })
            return
        }

        res.json({
            message: chatRoomData,
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
//更新 chatroom
router.post('/updatechatroom', async (req, res) => {
    try {
        // 更新 Chatroom 部分
        await chatroomconfig.updateOne(
            { chatRoomId: req.body.studentChatRoomId },
            { studentGroup: req.body.studentGroup }
        )
        for (const studentId of req.body.studentGroup) {
            await studentConfig.updateOne(
                { studentClass: req.body.studentClass, studentId: studentId },
                { studentChatRoomId: req.body.studentChatRoomId || "" }
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
        // 更新共編部分
        await coworkconfig.updateOne(
            { groupId: req.body.studentChatRoomId },
            { studentGroup: req.body.studentGroup }
        )
        res.json({
            message: `加入成功!\n房間ID:${req.body.studentChatRoomId}\n學生群組${req.body.studentGroup.map(value => { return value })}`,
            status: 200,
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "更新聊天室失敗，請聯繫管理員(err)",
            status: 500,
        })
    }
})

// Admin 取得所有課程
router.get('/getallcourse', async (req, res) => {
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
// Admin 新增課程
router.post('/createcourse', async (req, res) => {
    try {
        const checkData = await standardcontent.findOne({ goListTitle: req.body.courseName })

        if (checkData !== null) {
            res.json({
                message: "該名字已存在，請輸入別的名字",
                status: 500
            })
            return
        }

        const newCourse = new standardcontent({
            class: req.body.courseClass,
            goListTitle: req.body.courseName,
            access: true
        })

        newCourse.save().then(response => {
            res.json({
                message: {
                    _id: response._id,
                    goListTitle: response.goListTitle
                },
                status: 200
            })
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: "創建遊戲失敗，請聯繫管理員(err)",
            status: 500
        })
    }
})
// Admin 取得所有協作課程
router.get('/getallcoworkcourse', async (req, res) => {
    try {
        const coworkData = await coworkcontent.find({})

        res.json({
            coworkData: coworkData,
            status: 200
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "取得協作課程失敗，請聯繫管理員(err)",
            status: 500
        })
    }
})
// Admin 新增協作課程
router.post('/createcoworkcourse', async (req, res) => {
    try {
        // 新增課程內容
        await new coworkcontent({
            class: req.body.class,
            access: true,
            coworkTitle: req.body.coworkTitle,
            standardGoList: req.body.standardGoList || {},
            standardMaterial: req.body.standardMaterial || '',
            standardStarting: req.body.standardStarting || { 1: { target: "", material: "" } },
            standardUnderstanding: req.body.standardUnderstanding || { 1: { target: "", operation: "", limit: "" } },
            standardFormulating: req.body.standardFormulating || { 1: { content: [], hint: "" } },
            standardProgramming: req.body.standardProgramming || { 1: { hint: "" } },
        }).save()

        const coworkContentId = await coworkcontent.findOne({ class: req.body.class, coworkTitle: req.body.coworkTitle })
        // 搜尋所有的 Group 並將其加入一份共編課程的初始介面
        const groupData = await chatroomconfig.find({})
        const groupId = []
        for (const { chatRoomId, studentGroup } of groupData) {
            await new coworkconfig({
                class: req.body.class,
                coworkTitle: req.body.coworkTitle,
                coworkContentId: coworkContentId._id,
                coworkStatus: { process: 1, completeVote: new Array(studentGroup.length).fill(false), isComplete: false },
                groupId: chatRoomId,
                studentGroup: studentGroup,
                coworkContent: {},
                coworkTimesheet: [
                    { time: getNowTime("FullTime"), student: "Admin", coworkContent: "initialzed" }
                ],
            }).save()

            groupId.push({
                chatRoomId: chatRoomId,
                studentGroup: studentGroup,
                currentCoworkContentId: coworkContentId._id
            })
        }
        res.json({
            message: groupId,
            status: 200
        })


    } catch (err) {
        console.log(err)
        res.json({
            message: "創建協作課程失敗，請聯繫管理員(err)",
            status: 500
        })
    }
})

// Admin 取得所有學生
router.get('/getallstudent', async (req, res) => {
    try {
        const studentData = await studentConfig.find({})

        let returnStudentData = []

        for (let i = 0; i < studentData.length; i++) {
            returnStudentData.push(
                {
                    studentClass: studentData[i].studentClass,
                    studentId: studentData[i].studentId,
                    studentName: studentData[i].studentName,
                    studentChatRoomId: studentData[i].studentChatRoomId,
                    studentAccess: studentData[i].studentAccess
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
// Admin 修改學生
router.post('/updatestudent', async (req, res) => {
    try {
        //刪除群組功能 removeChatRoom
        if (req.body.type === 'removeChatRoom') {
            await studentConfig.updateOne(
                { studentId: req.body.studentId, studentClass: req.body.studentClass },
                { studentChatRoomId: "" }
            ).then(response => {
                if (!response.acknowledged) {
                    res.json({
                        message: "刪除失敗",
                        status: 500
                    })
                    return
                }
                res.json({
                    message: "success",
                    status: 200
                })
            })
        }
        //增加群組功能 addChatRoom
        if (req.body.type === 'addChatRoom') {
            await studentConfig.updateOne(
                { studentId: req.body.studentId, studentClass: req.body.studentClass },
                { studentChatRoomId: "" }
            ).then(response => {
                if (!response.acknowledged) {
                    res.json({
                        message: "刪除失敗",
                        status: 500
                    })
                    return
                }
                res.json({
                    message: "success",
                    status: 200
                })
            })
        }
        // 合作功能開啟/關閉 switchCowork
        if (req.body.type === 'switchCowork') {
            req.body.studentId.forEach(async (studentId, index) => {
                await studentConfig.updateOne(
                    { studentId: studentId, studentClass: req.body.studentClass },
                    { studentAccess: !req.body.switchConfirm[index] }
                ).then(response => {
                    if (!response.acknowledged) {
                        console.log(studentId, response)
                        res.json({
                            message: "更改失敗",
                            status: 500
                        })
                        return
                    }
                })
            })
            res.json({
                message: "success",
                status: 200
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            message: "修改學生時發生錯誤，請聯繫管理員(err)",
            status: 500,
        })
    }
})

//Admin 取得所有學生 from 特殊值
router.post('/getallstudentbylimit', async (req, res) => {
    try {
        const studentData = await studentConfig.find({})

        switch (req.body.limit) {
            case 'course':
                findByCourseId()
                return
        }

        res.json({ status: 501 })

        //透過 CourseId 進行查找
        function findByCourseId() {
            let selectName = []
            let selectValue = []

            for (const { studentId, studentName, studentGoList } of studentData) {
                if (studentGoList) {
                    if (studentGoList[req.body.courseId] !== null || studentGoList[req.body.courseId] !== undefined) {
                        selectName.push(studentName)
                        selectValue.push(studentId)
                    }
                }
            }

            res.json({
                message: {
                    selectName: selectName,
                    selectValue: selectValue
                },
                status: 200,
            })
        }


    } catch (err) {
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
        const reflectionData = await reflectionconfig.find({
            courseId: req.body.courseId
        })

        let sheetName = []
        let sheetData = []

        for (const { studentId, studentName, studentReflectionData } of reflectionData) {
            sheetName.push(`${studentId}_${studentName}`)

            for (const reflectionIndex of ["1-4", "2-4", "3-4", "4-4", "5-4", "6-4", "7-4"])
                if (studentReflectionData[reflectionIndex] === undefined) {
                    studentReflectionData[reflectionIndex] = {
                        "learing": "",
                        "workhard": "",
                        "difficult": "",
                        "scoring": ""
                    }
                }

            sheetData.push(Object.values(studentReflectionData))
        }

        if (sheetData.length === 0) {
            res.json({
                message: "目前尚未有任何該課程資料!",
                status: 500,
            })
            return
        }

        res.json({
            message: {
                sheetName: sheetName,
                sheetData: sheetData
            },
            status: 200
        })

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
            coworkStatus: 'N',
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
//Admin 進入共編課程
router.get('/co/:courseId', async (req, res) => {
    try {
        const courseData = await coworkcontent.findOne({ _id: req.params.courseId })
        if (courseData === null || courseData === undefined || courseData.length === 0) {
            res.redirect(`/home/${req.user.adminId}`)
            return
        }
        res.render('./admin/cowork', {
            courseId: req.params.courseId,
            courseTitle: courseData.coworkTitle,
            adminId: req.user.adminId,
            coworkStatus: 'Y',
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
//Admin 修改 cowork understanding
router.post("/cowork/updatestandardunderstanding", async (req, res) => {

})
//Admin 修改 cowork formulating
router.post("/cowork/updatestandardformulating", async (req, res) => {

})


//Admin 取得學生GoList
router.post("/getstudentcourse", async (req, res) => {
    try {
        const studentData = await studentConfig.findOne({
            studentId: req.body.studentId,
            studentClass: req.body.studentClass
        })

        const courseData = await standardcontent.find({})

        if (studentData.studentGoList === null || studentData.studentGoList === undefined) {
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

//Admin 讀取 Cowork
router.post('/readcowork', async (req, res) => {
    try {
        const coworkData = await coworkcontent.findOne({ _id: req.body.courseId })

        res.json(
            {
                message: coworkData.standardGoList,
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
//Admin 儲存 Cowork
router.post('/savecowork', async (req, res) => {
    try {
        await coworkcontent.updateOne({ _id: req.body.courseId, }, { standardGoList: req.body.goList })
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
//Admin 重整 Cowork
router.post('/restartcowork', async (req, res) => {
    try {
        const coworkData = await coworkcontent.findOne({ _id: req.body.courseId })

        res.json(
            {
                message: coworkData.standardGoList,
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

//取得 當前時間
function getNowTime(type) {
    const date = new Date()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    if (hour.toString().length === 1) {
        hour = "0" + hour
    }
    if (minute.toString().length === 1) {
        minute = "0" + minute
    }
    if (second.toString().length === 1) {
        second = "0" + second
    }

    switch (type) {
        case "SimpleTime":
            return hour + ":" + minute
        case "SecondTime":
            return hour + ":" + minute + ":" + second
        case "FullTime":
            return `${date.getFullYear()}/${date.getMonth() + 1
                }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
}

export default router