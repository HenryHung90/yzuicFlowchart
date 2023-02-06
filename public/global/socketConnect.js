import { io } from "https:/cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { getCookie, getNowTime } from './common.js'


const socket = io()
const socketConnect = {
    enterRoom: () => {
        const emitMessage = {
            studentId: getCookie("studentId"),
            enterTime: getNowTime('SimpleTime')
        }
        socket.emit('enterRoom', JSON.stringify(emitMessage))
    },
    receiveEnterRoom: () => {
        socket.on('re-enterRoom', (message) => {
            const receiveMessage = JSON.parse(message)
            console.log(message)
            MessageType.enterRoom(`${receiveMessage.enterTime} ${receiveMessage.studentId} 進入房間`)
        })
    },

    sendMessage: (message) => {
        const emitMessage = {
            studentId: getCookie("studentId"),
            enterTime: getNowTime('SimpleTime'),
            message: message,
        }
        socket.emit('sendMessage', JSON.stringify(emitMessage))
    },
    receiveMessage: (message) => {
        socket.on('re-sendMessage', (message) => {
            const receiveMessage = JSON.parse(message)
            console.log(receiveMessage)
            if (receiveMessage.studentId === getCookie("studentId")) {
                MessageType.sendMessage()
            } else {
                MessageType.receiveMessage()
            }
        })
    },
}


const MessageType = {
    enterRoom: (message) => {
        $('<div>').prop({
            className: 'chatBox_enterMessage',
            innerHTML: message
        }).appendTo($('.chatBox_MessageContent'))
    },
    sendMessage: (message) => {

    },
    receiveMessage: () => {

    }
}

export { socketConnect }