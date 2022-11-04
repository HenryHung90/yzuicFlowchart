import express from 'express'
import bcrypt from 'bcryptjs'
const router = express.Router()

import studentConifg from '../models/studentconifg.js'


//學生讀取goList
router.post('/readgolist', async (req, res) => {
    try {
        await studentConifg.findOne({ studentId: req.user.studentId, studentAccess: true }).then(response => {
            res.json(
                {
                    message: response.studentGoList,
                    status: 200
                }
            )
        })
    }
    catch {
        res.json(
            {
                message: '讀取存檔失敗，請重新整理',
                status: 500,
            }
        )
    }
})

//學生儲存goList
router.post('/savegolist', async (req, res) => {
    try {
        await studentConifg.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentGoList: req.body.goList }
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
                        message: '儲存失敗，請再試一次',
                        status: 500
                    }
                )
            }

        })
    }
    catch {
        res.json(
            {
                message: 'error',
                status: 500,
            }
        )
    }
})

export default router 