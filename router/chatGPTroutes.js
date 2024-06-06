import chatGPTconfig from '../models/chatGPTconfig.js'
import express from 'express'
import openAI from 'openai'
import dotenv from 'dotenv'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const router = express.Router()
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

//.env config
dotenv.config()
// const openAIConfig = new openAI({
//     organization: process.env.OPENAI_ORG
// })
const openai = new openAI({ apiKey: process.env.OPENAI_KEY })

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

router.post('/chat', async (req, res) => {
    try {
        // const completion = await openai.chat.completions.create({
        //     messages: [
        //         { role: "system", content:"你現在是一名專業的 P5.js 工程師，你需要回答有關 JavaScript 以及 P5.js 的所有問題，並且要盡可能詳細，全程使用繁體中文進行回答" },
        //         { role: "user", content:req.body.message}
        //     ],
        //     model: "gpt-3.5-turbo",
        // });
        const chatGPTData = await chatGPTconfig.findOne({
            class: req.user.studentClass,
            studentId: req.user.studentId,
            courseId: req.body.courseId
        })

        const messageHistory = []
        for (const { message, studentId } of chatGPTData.messageHistory) {
            if (studentId) {
                messageHistory.push({
                    role: studentId === 'AmumAmum' ? 'system' : 'user',
                    content: message
                })
            }

        }


        const userMsg = converDangerString(req.body.message)
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system", content: `
You are ChatGPT helping the User with coding. 
You are intelligent, helpful and an expert developer,
who always gives the correct answer and only does what instructed.
You always answer truthfully and don't make things up. 
When responding to the following prompt, 
please make sure to properly style your response using Github Flavored Markdown. 
Use markdown syntax for things like headings, lists, colored text, code blocks, highlights etc.

Please be sure to follow those roles below and you and you always be sure that your answer is follow the roles
1. Please be sure to attach the entire corrected code that combine your remake and my origin code to the explanation and use ***修正後的程式*** to wrap code.
2. All explanation must before the code, make sure no anymore explanation or texts below the corrected code
3. It is important to be sure that the entire corrected code is combine your remake and my origin code.
4. you always make the entire corrected code that combine your remake and my origin code.

For example below:
input is user's question
output is your answer

input: 
以下是我的程式
// my original code...
以下是我的問題
// my question...
output: 
 // Your explanation...   
***修正後的程式***
// the entire corrected code is combine your remake and my origin code...
***修正後的程式***
` },
                // ...messageHistory,
                { role: "user", content: req.body.codePrompt + userMsg }
            ],
            model: "ft:gpt-3.5-turbo-1106:personal:flowchart:9Wj0qZuT",
            max_tokens: 1024,
            temperature: 0.3,
        })


        if (chatGPTData == null) {
            new chatGPTconfig({
                class: req.user.studentClass,
                studentId: req.user.studentId,
                courseId: req.body.courseId,
                courseName: req.body.courseName,
                messageHistory: [{
                    studentId: req.user.studentId,
                    sendTime: req.body.sendTime,
                    message: userMsg
                }, {
                    studentId: 'AmumAmum',
                    sendTime: req.body.sendTime,
                    message: completion.choices[0].message.content
                }]
            }).save()
        } else {
            chatGPTData.messageHistory.push({
                studentId: req.user.studentId,
                sendTime: req.body.sendTime,
                message: userMsg
            })
            chatGPTData.messageHistory.push({
                studentId: 'AmumAmum',
                sendTime: req.body.sendTime,
                message: completion.choices[0].message.content
            })

            await chatGPTconfig.updateOne({
                class: req.user.studentClass,
                studentId: req.user.studentId,
                courseId: req.body.courseId
            }, {
                messageHistory: chatGPTData.messageHistory
            })
        }
        res.json({
            status: 200,
            message: {
                userMsg: userMsg,
                GPTreply: completion.choices[0]
            }
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: 500,
            message: "課程助理 AmumAmum 無法連線，請聯繫管理員(err)"
        })
    }
})

router.post('/history', async (req, res) => {
    try {
        const messageData = await chatGPTconfig.findOne({
            studentId: req.user.studentId, courseId: req.body.courseId
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


export default router