import express from 'express'
import bcrypt from 'bcryptjs'
const router = express.Router()

import studentConifg from '../models/studentconfig.js'

const saltRound = 10

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
                    return 'success'
                })
            }
        }).then(response => {
            if (response == 'success') {
                res.status(200).json({
                    message: 'success',
                    status: 200
                })
            }
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: err,
            status: 500
        })
    }

})

export default router 