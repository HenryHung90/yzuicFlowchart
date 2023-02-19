import express from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
const router = express.Router()

import studentConifg from '../models/studentconfig.js'
import standardcontent from '../models/standardcontent.js'
import chatroomconfig from '../models/chatroomconfig.js'

const saltRound = 10



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


        await studentConifg.findOne({ studentId: req.body.studentId, studentClass: req.body.studentClass }).then(response => {
            if (response == null) {
                bcrypt.hash(tempPassword, saltRound, async (err, hashedPassword) => {
                    if (err) throw 'bad hash'

                    const newStudent = new studentConifg({
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

//新增 Standard 各項內容
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

//修改 Standard 各項內容
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
                studentConifg.updateOne(
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
                studentConifg.updateOne(
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


export default router