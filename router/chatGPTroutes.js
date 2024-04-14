import express from 'express'
import openAI from 'openai'
import dotenv from 'dotenv'
const router = express.Router()

//.env config
dotenv.config()
// const openAIConfig = new openAI({
//     organization: process.env.OPENAI_ORG
// })
const openai = new openAI({ apiKey: process.env.OPENAI_KEY })

router.post('/chat', async (req, res) => {
    try {
        // const completion = await openai.chat.completions.create({
        //     messages: [
        //         { role: "system", content:"你現在是一名專業的 P5.js 工程師，你需要回答有關 JavaScript 以及 P5.js 的所有問題，並且要盡可能詳細，全程使用繁體中文進行回答" },
        //         { role: "user", content:req.body.message}
        //     ],
        //     model: "gpt-3.5-turbo",
        // });
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are ChatGPT helping the User with coding.\n\t You are intelligent, helpful and an expert developer, who always gives the correct answer and only does what instructed. You always answer truthfully and don't make things up. When responding to the following prompt, please make sure to properly style your response using Github Flavored Markdown. Use markdown syntax for things like headings, lists, colored text, code blocks, highlights etc. Make sure not to mention markdown or styling in your actual response" },
                { role: "user", content: req.body.message }
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 1024,
        });
        res.json({
            status: 200,
            message: completion.choices[0]
        })
//         res.json({
//             status:200,
//             message: {
//                 message: `當然，這裡有一段簡單的 JavaScript 代碼示例，這段代碼會將兩個變數相加並將結果輸出到控制台：

// \`\`\`javascript
// // 定義兩個變數
// let num1 = 5;
// let num2 = 10;

// // 將兩個變數相加並儲存結果
// let sum = num1 + num2;

// // 輸出結果到控制台
// console.log('Sum:', sum);
// \`\`\`

// 這段代碼將會輸出 \`Sum: 15\` 到控制台，代表將 5 和 10 相加的結果。 如果你有任何問題或需要進一步幫助，請隨時告訴我!`}
//         })

    } catch (err) {
        console.log(err)

    }
})


export default router