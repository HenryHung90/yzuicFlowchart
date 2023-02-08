import { io } from "https:/cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { getCookie, getNowTime } from './common.js'


const socket = io()
const socketConnect = {
    // 傳送進入房間訊息
    enterRoom: () => {
        const emitMessage = {
            studentId: getCookie("studentId"),
            sendTime: getNowTime('SimpleTime')
        }
        socket.emit('enterRoom', JSON.stringify(emitMessage))
    },

    // 收到進入房間訊息
    receiveEnterRoom: () => {
        socket.on('re-enterRoom', (message) => {
            const receiveMessage = JSON.parse(message)
            MessageType.enterRoom(receiveMessage)
        })
    },

    // 傳送訊息
    sendMessage: (message) => {
        const emitMessage = {
            studentId: getCookie("studentId"),
            sendTime: getNowTime('SecondTime'),
            message: message,
        }
        socket.emit('sendMessage', JSON.stringify(emitMessage))
    },

    // 接收訊息
    receiveMessage: () => {
        socket.on('re-sendMessage', (message) => {
            const receiveMessage = JSON.parse(message)
            //若自己傳的，顯示自己傳送的模型
            if (receiveMessage.studentId === getCookie("studentId")) {
                MessageType.sendMessage(receiveMessage)
            } else {
                //別人傳則使用別人傳的模型
                MessageType.receiveMessage(receiveMessage)
            }
        })
    },
}


const MessageType = {
    enterRoom: (message) => {
        $('<div>').prop({
            className: 'chatBox_enterMessage',
            innerHTML: `${message.sendTime} ${message.studentId} 進入房間`
        }).appendTo($('.chatBox_MessageContent'))
    },
    sendMessage: (message) => {
        const sendMessageBox = $('<div>').prop({
            className: 'chatBox_sendMessageBox'
        }).appendTo($('.chatBox_MessageContent'))

        //student Id
        $('<div>').prop({
            className:'chatBox_sendMessageBox_studentId',
            innerHTML: `<div>${message.studentId}</div>`
        }).appendTo(sendMessageBox)

        //Message
        $('<div>').prop({
            className: 'chatBox_sendMessage_messageBox',
            innerHTML: `<span>${message.message}</span>`
        }).appendTo(sendMessageBox)

        //send Time
        $('<div>').prop({
            className: 'chatBox_sendMessage_sendTime',
            innerHTML: `<div>${message.sendTime}</div>`
        }).appendTo(sendMessageBox)

    },
    receiveMessage: (message) => {
        const sendMessageBox = $('<div>').prop({
            className: 'chatBox_receiveMessageBox'
        }).appendTo($('.chatBox_MessageContent'))

        //student Id
        $('<div>').prop({
            className: 'chatBox_receiveMessageBox_studentId',
            innerHTML: `<div>${message.studentId}</div>`
        }).appendTo(sendMessageBox)

        //Message
        $('<div>').prop({
            className: 'chatBox_receiveMessage_messageBox',
            innerHTML: `<span>${message.message}</span>`
        }).appendTo(sendMessageBox)

        //send Time
        $('<div>').prop({
            className: 'chatBox_receiveMessage_sendTime',
            innerHTML: `<div>${message.sendTime}</div>`
        }).appendTo(sendMessageBox)
    }
}

export { socketConnect }