import { io } from "https:/cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { NormalizeFunc } from './common.js'


const socket = io()
const socketConnect = {
    chatRoomId: NormalizeFunc.getFrontEndCode('studentChatRoomId'),
    // 傳送進入房間訊息
    enterRoom: () => {
        const emitMessage = {
            studentId: NormalizeFunc.getCookie("studentId"),
            sendTime: NormalizeFunc.getNowTime('SimpleTime'),
            studentChatRoomId: socketConnect.chatRoomId,
        }
        socket.emit('enterRoom', JSON.stringify(emitMessage))
    },

    // 收到進入房間訊息
    receiveEnterRoom: () => {
        socket.on('re-enterRoom', (message) => {
            const receiveMessage = JSON.parse(message)
            if (receiveMessage.studentChatRoomId === socketConnect.chatRoomId) {
                MessageType.enterRoom(receiveMessage)
            }
            if (receiveMessage.studentChatRoomId === undefined) {
                for (let message of receiveMessage) {
                    if (message.studentId === NormalizeFunc.getCookie("studentId")) {
                        MessageType.sendMessage(message)
                    } else {
                        //別人傳則使用別人傳的模型
                        MessageType.receiveMessage(message)
                    }
                }
            }

        })
    },

    // 傳送訊息
    sendMessage: (message) => {
        const emitMessage = {
            studentId: NormalizeFunc.getCookie("studentId"),
            sendTime: NormalizeFunc.getNowTime('SecondTime'),
            message: message,
            studentChatRoomId: socketConnect.chatRoomId,
        }
        socket.emit('sendMessage', JSON.stringify(emitMessage))
    },

    // 接收訊息
    receiveMessage: () => {
        socket.on('re-sendMessage', (message) => {
            const receiveMessage = JSON.parse(message)
            if (receiveMessage.studentChatRoomId === socketConnect.chatRoomId) {
                //若自己傳的，顯示自己傳送的模型
                if (receiveMessage.studentId === NormalizeFunc.getCookie("studentId")) {
                    MessageType.sendMessage(receiveMessage)
                } else {
                    //別人傳則使用別人傳的模型
                    MessageType.receiveMessage(receiveMessage)
                }
            }
        })
    },
}


const MessageType = {
    // 進入房間時創造訊息
    enterRoom: (message) => {
        $('<div>').prop({
            className: 'chatBox_enterMessage',
            innerHTML: `${message.sendTime} ${message.studentId} 進入房間`
        }).appendTo($('.chatBox_MessageContent'))

        $('.chatBox_MessageContent').scrollTop($('.chatBox_MessageContent')[0].scrollHeight)
    },
    // 自己傳送的訊息
    sendMessage: (message) => {
        const sendMessageBox = $('<div>').prop({
            className: 'chatBox_sendMessageBox'
        }).appendTo($('.chatBox_MessageContent'))

        //student Id
        $('<div>').prop({
            className: 'chatBox_sendMessageBox_studentId',
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

        $('.chatBox_MessageContent').scrollTop($('.chatBox_MessageContent')[0].scrollHeight)
    },
    //別人傳送的訊息
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

        $('.chatBox_MessageContent').scrollTop($('.chatBox_MessageContent')[0].scrollHeight)
    },
    sendMessage_History: (message) =>{
        const sendMessageBox = $('<div>').prop({
            className: 'chatBox_sendMessageBox'
        }).prependTo($('.chatBox_MessageContent'))

        //student Id
        $('<div>').prop({
            className: 'chatBox_sendMessageBox_studentId',
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
    receiveMessage_History: (message) => {
        const sendMessageBox = $('<div>').prop({
            className: 'chatBox_receiveMessageBox'
        }).prependTo($('.chatBox_MessageContent'))

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
    },
}

export { socketConnect, MessageType }