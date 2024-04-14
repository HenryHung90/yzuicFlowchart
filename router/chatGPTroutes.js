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
        const userMsg = converDangerString(req.body.message)
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are ChatGPT helping the User with coding.\n\t You are intelligent, helpful and an expert developer, who always gives the correct answer and only does what instructed. You always answer truthfully and don't make things up. When responding to the following prompt, please make sure to properly style your response using Github Flavored Markdown. Use markdown syntax for things like headings, lists, colored text, code blocks, highlights etc. Make sure not to mention markdown or styling in your actual response" },
                { role: "user", content: userMsg }
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 1024,
        });

        const chatGPTData = await chatGPTconfig.findOne({
            class: req.user.studentClass,
            studentId: req.user.studentId,
            courseId: req.body.courseId
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


export default router