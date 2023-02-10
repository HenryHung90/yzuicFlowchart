import chatroomconfig from './models/chatroomconfig.js'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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

const socketServer = (io) => {
    io.on('connection', (socket) => {
        socket.on('enterRoom', async (message) => {
            const messageData = JSON.parse(message)

            const chatData = await chatroomconfig.findOne({ access: true, studentChatRoomId: messageData.studentChatRoomId })

            //發給自己最近 10 則訊息
            const chatHistory = chatData.messageHistory.slice(chatData.messageHistory.length - 11, chatData.messageHistory.length - 1)
            socket.emit('re-enterRoom', JSON.stringify(chatHistory))

            //告訴所有人你進來了
            io.emit('re-enterRoom', message)
        })

        socket.on('sendMessage', async (message) => {
            const messageData = JSON.parse(message)

            // 將訊息內藏的危險字詞轉換
            messageData.message = converDangerString(messageData.message)

            const chatData = await chatroomconfig.findOne({ access: true, studentChatRoomId: messageData.studentChatRoomId })

            chatData.messageHistory.push({
                studentId: messageData.studentId,
                sendTime: messageData.sendTime,
                message: messageData.message
            })

            await chatroomconfig.updateOne({
                access: true, studentChatRoomId: messageData.studentChatRoomId
            }, {
                messageHistory: chatData.messageHistory
            })

            io.emit('re-sendMessage', JSON.stringify(messageData))
        })
    })
}

export default socketServer