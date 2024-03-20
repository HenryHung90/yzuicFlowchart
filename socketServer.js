import chatroomconfig from './models/chatroomconfig.js'
import coworkconfig from './models/coworkconfig.js';
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

const socketServer = async (io) => {
    io.of(/room_[a-zA-Z0-9]+/).on('connection', socket => {
        // console.log(socket.nsp.name.split("_")[1])
        const socketRoomUser = socket.nsp.adapter.rooms
        // 收到進入房間資訊
        socket.on('enterRoom', async (message) => {
            const messageData = JSON.parse(message)

            const chatData = await chatroomconfig.findOne({ access: true, chatRoomId: messageData.chatRoomId })
            //發給自己最近 10 則訊息
            const chatHistory = chatData.messageHistory.slice(chatData.messageHistory.length - 11, chatData.messageHistory.length - 1)
            socket.emit('re-enterRoom', JSON.stringify(chatHistory))

            //告訴所有人你進來了
            socket.nsp.emit('re-enterRoom', message)
            socket.nsp.emit('roomNumber', socketRoomUser.size)
        })
        // 收到離開房間資訊
        socket.on('leaveRoom', async (message) => {
            socket.nsp.emit('re-leaveRoom', message)
        })

        // 收到訊息
        socket.on('sendMessage', async (message) => {
            const messageData = JSON.parse(message)

            // 將訊息內藏的危險字詞轉換
            messageData.message = converDangerString(messageData.message)

            const chatData = await chatroomconfig.findOne({ access: true, chatRoomId: messageData.chatRoomId })

            chatData.messageHistory.push({
                studentId: messageData.studentId,
                sendTime: messageData.sendTime,
                message: messageData.message
            })

            await chatroomconfig.updateOne({
                access: true, chatRoomId: messageData.chatRoomId
            }, {
                messageHistory: chatData.messageHistory
            })

            socket.nsp.emit('re-sendMessage', JSON.stringify(messageData))
        })

        // 收到滑鼠監聽事件
        socket.on('sendMouseMove', async (message) => {
            socket.nsp.emit('re-sendMouseMove', message)
        })

        // 收到共編程式事件
        socket.on('sendUpdateCode', async (message) => {
            socket.nsp.emit('re-sendUpdateCode', message)
        })

        // 收到執行程式事件
        socket.on("executeProject", async (message) => {
            socket.nsp.emit('re-executeProject', message)
        })

        // 收到開始投票事件
        socket.on("startVoting", async (message) => {
            const votingMessage = JSON.parse(message)
            const votingData = await coworkconfig.findOne({ groupId: votingMessage.chatRoomId })

            let isComplete = false

            // 填入投票訊息，並確認是否所有人都進行投票過
            for (const index in votingData.coworkStatus.completeVote) {
                if (votingData.coworkStatus.completeVote[index] == votingMessage.studentId) {
                    break
                }
                if (!votingData.coworkStatus.completeVote[index]) {
                    votingData.coworkStatus.completeVote[index] = votingMessage.studentId
                    if (index == votingData.coworkStatus.completeVote.length - 1) isComplete = true
                    break
                }
            }
            // 完成投票額外告知完成投票
            if (isComplete) {
                setTimeout(async () => {
                    if (votingData.coworkStatus.process < 6) {
                        votingData.coworkStatus.process++
                    } else {
                        votingData.coworkStatus.isComplete = true
                    }
                    votingData.coworkStatus.completeVote = new Array(votingData.coworkStatus.completeVote.length).fill(false)
                    await coworkconfig.updateOne({ groupId: votingMessage.chatRoomId }, { coworkStatus: votingData.coworkStatus })
                }, 500)
                socket.nsp.emit('completeVoting', message)
            } else {
                // 更新 database 投票資料
                await coworkconfig.updateOne({ groupId: votingMessage.chatRoomId }, { coworkStatus: votingData.coworkStatus })
                // 回傳投票資訊
                socket.nsp.emit('re-startVoting', message)
            }

        })

        // 收到離開房間訊息
        socket.on('disconnect', async (type) => {
            socket.nsp.emit('roomNumber', socketRoomUser.size)
        })

        // 收到取消投票事件
        socket.on("endVoting", async (message) => {

        })
    })
}

export default socketServer