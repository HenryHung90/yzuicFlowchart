import { io } from "https:/cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { NormalizeFunc } from './common.js'


const socket = io()
const socketConnect = {
    // 傳送進入房間訊息
    enterRoom: () => {
        const emitMessage = {
            studentId: NormalizeFunc.getFrontEndCode('studentId'),
            sendTime: NormalizeFunc.getNowTime('SimpleTime'),
            chatRoomId: NormalizeFunc.getFrontEndCode('chatRoomId'),
        }
        socket.emit('enterRoom', JSON.stringify(emitMessage))
    },

    // 收到進入房間訊息
    receiveEnterRoom: () => {
        socket.on('re-enterRoom', (message) => {
            const receiveMessage = JSON.parse(message)
            if (receiveMessage.chatRoomId === NormalizeFunc.getFrontEndCode('chatRoomId')) {
                MessageType.enterRoom(receiveMessage)
            }
            // 前十則訊息接收
            if (receiveMessage.chatRoomId === undefined) {
                for (let message of receiveMessage) {
                    if (message.studentId === NormalizeFunc.getFrontEndCode('studentId')) {
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
            studentId: NormalizeFunc.getFrontEndCode('studentId'),
            sendTime: NormalizeFunc.getNowTime('SecondTime'),
            message: message,
            chatRoomId: NormalizeFunc.getFrontEndCode('chatRoomId'),
        }
        socket.emit('sendMessage', JSON.stringify(emitMessage))
    },

    // 接收訊息
    receiveMessage: () => {
        socket.on('re-sendMessage', (message) => {
            const receiveMessage = JSON.parse(message)
            if (receiveMessage.chatRoomId === NormalizeFunc.getFrontEndCode('chatRoomId')) {
                //若自己傳的，顯示自己傳送的模型
                if (receiveMessage.studentId === NormalizeFunc.getFrontEndCode('studentId')) {
                    MessageType.sendMessage(receiveMessage)
                } else {
                    //別人傳則使用別人傳的模型
                    MessageType.receiveMessage(receiveMessage)
                }
            }
        })
    },

    //共編部分
    cowork: {
        selectionArea: 'golist',
        //偵測滑鼠移動
        mouseMove: () => {
            $(document).on('mousemove', (e) => {
                const mousePosition = {
                    chatRoomId: NormalizeFunc.getFrontEndCode('chatRoomId'),
                    studentId: NormalizeFunc.getFrontEndCode('studentId'),
                    selectionArea: socketConnect.cowork.selectionArea,
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                }
                socket.emit('sendMouseMove', JSON.stringify(mousePosition))
            })
        },
        //偵測滑鼠點擊
        mouseClick: () => {

        },
        // 接收滑鼠偵測
        receiveMouseMove: () => {
            socket.on('re-sendMouseMove', (message) => {
                const receivedMouseMove = JSON.parse(message)
                if (receivedMouseMove.chatRoomId === NormalizeFunc.getFrontEndCode('chatRoomId') &&
                    receivedMouseMove.studentId !== NormalizeFunc.getFrontEndCode('studentId')
                ) {
                    MouseType.mouseIcon(receivedMouseMove)
                }
            })
        },

        // 共編程式
        updateCode: (text, lineFrom, lineTo, origin) => {
            const codeInformation = {
                chatRoomId: NormalizeFunc.getFrontEndCode('chatRoomId'),
                studentId: NormalizeFunc.getFrontEndCode('studentId'),
                text: text,
                lineFrom: lineFrom,
                lineTo: lineTo,
                origin: origin
            }
            socket.emit('sendUpdateCode', JSON.stringify(codeInformation))
        },

        // 接收共編程式
        receiveUpdateCode: () => {
            $('#coworkArea').data("CodeMirror").on('change', emitUpdateCode)

            socket.on('re-sendUpdateCode', (message) => {
                const reciveMessage = JSON.parse(message)
                if (reciveMessage.chatRoomId === NormalizeFunc.getFrontEndCode('chatRoomId') &&
                    reciveMessage.studentId !== NormalizeFunc.getFrontEndCode('studentId')
                ) {
                    $('#coworkArea').data("CodeMirror").off('change', emitUpdateCode)
                    $('#coworkArea').data("CodeMirror").replaceRange(
                        reciveMessage.text,
                        reciveMessage.lineFrom,
                        reciveMessage.lineTo,
                        reciveMessage.origin
                    )
                    $('#coworkArea').data("CodeMirror").on('change', emitUpdateCode)
                }
            })

            function emitUpdateCode(instance, obj) {
                console.log(obj)
                socketConnect.cowork.updateCode(obj.text, obj.from, obj.to, obj.origin)
            }
        }
    }
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
    sendMessage_History: (message) => {
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

const MouseType = {
    mouseColor: () => {
        const randomColor_R = Math.floor(Math.random() * 256)
        const randomColor_G = Math.floor(Math.random() * 256)
        const randomColor_B = Math.floor(Math.random() * 256)

        // 隨機產生顏色
        return `rgb(${randomColor_R},${randomColor_G},${randomColor_B})`
    },

    // 顯示其他人的鼠標
    mouseIcon: (message) => {
        if ($(`#mouseMoveContainer_${message.studentId}`).length == 0) {
            const mouseMoveIconContainer = $('<div>').prop({
                className: 'mouseMoveContainer_mouseIconContainer',
                id: `mouseMoveContainer_${message.studentId}`
            }).appendTo($('.mouseMovingContainer'))

            $('<svg>').prop({
                className: 'mouseMoveContainer_mouseIcon',
                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="${MouseType.mouseColor()}" viewBox="0 0 320 512"><path d="M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>`
            }).appendTo(mouseMoveIconContainer)

            $('<div>').prop({
                className: 'mouseMoveContainer_mouseStudentId',
                id: `mouseMoveContainer_mouseStudentId_${message.studentId}`
            }).appendTo(mouseMoveIconContainer)
        }


        if (message.selectionArea === socketConnect.cowork.selectionArea) {
            $(`#mouseMoveContainer_${message.studentId}`).css({
                top: message.mouseY,
                left: message.mouseX,
                display: 'absolute',
            }).css({ opacity: 1 })
            $(`#mouseMoveContainer_mouseStudentId_${message.studentId}`).html(message.studentId)
        } else {
            $(`#mouseMoveContainer_${message.studentId}`).css({ opacity: 0.3 })

            $(`#mouseMoveContainer_mouseStudentId_${message.studentId}`).html(`${message.studentId}<br>(${transformSelectArea(message.selectionArea)})`)
        }

        function transformSelectArea(id) {
            const progress = id.split("-")[0]
            const status = id.split("-")[1]
            let result = progress

            switch (status) {
                case "1":
                    result += "_探索理解"
                    break
                case "2":
                    result += "_表徵制定"
                    break
                case "3":
                    result += "_計畫執行"
                    break
                case "4":
                    result += "_監控反思"
                    break
            }

            return result
        }
    }
}

export { socketConnect, MessageType }