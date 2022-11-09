import express from 'express'
const router = express.Router()

import studentConfig from '../models/studentconfig.js'
import standardcontent from '../models/standardcontent.js'


//學生讀取 goList
router.post('/readgolist', async (req, res) => {
    try {
        await studentConfig.findOne({ studentId: req.user.studentId, studentAccess: true }).then(response => {
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
//學生儲存 goList
router.post('/savegolist', async (req, res) => {
    try {
        await studentConfig.updateOne(
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
        let standardGoList = {}
        //尋找 GoList
        await standardcontent.findOne({ class: req.user.studentClass, access: true }).then(response => {
            standardGoList = response.standardGoList
        })
        //更新 GoList
        await studentConfig.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentGoList: standardGoList })
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

//學生讀取 code
router.post('/readcode', async (req, res) => {
    try {
        await studentConfig.findOne({ studentId: req.user.studentId, studentAccess: true }).then(response => {
            res.json(
                {
                    data: response.studentCodeList[req.body.keyCode] || '',
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
        // console.log(req.body)
        //取得目前檔案
        let studentUpdateData = {}
        //儲存狀態
        let saveStatus = false

        await studentConfig.findOne({ studentId: req.user.studentId, studentAccess: true }).then(response => {
            studentUpdateData = response.studentCodeList
        })

        //更新 or 新增 coding 檔案
        studentUpdateData[req.body.keyCode] = {
            setting: req.body.setting,
            config: req.body.config,
            preload: req.body.preload,
            create: req.body.create,
            update: req.body.update,
            custom: req.body.custom,
        }

        //存入 coding 檔案
        await studentConfig.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentCodeList: studentUpdateData }).then(response => {
                saveStatus = response.acknowledged
            })
        if (saveStatus) {
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
        //取得目前檔案
        let studentUpdateData = {}
        //刪除狀態
        let deleteStatus = false

        await studentConfig.findOne({ studentId: req.user.studentId, studentAccess: true }).then(response => {
            studentUpdateData = response.studentCodeList
        })

        delete studentUpdateData[req.body.keyCode]

        await studentConfig.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentCodeList: studentUpdateData }
        ).then(response => {
            deleteStatus = response.acknowledged
        })
        if (deleteStatus) {
            res.json({
                message: 'success',
                status: 200
            })
        } else {
            res.json({
                message: '刪除該 node code 失敗，請重新整理網頁！',
                status: 500
            })
        }
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
            standardCodeList  = response.standardCodeList || {}
        })
        //更新 Code
        await studentConfig.updateOne(
            { studentId: req.user.studentId, studentAccess: true },
            { studentCodeList:standardCodeList })
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

export default router 