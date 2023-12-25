import { io } from "https:/cdn.socket.io/4.3.2/socket.io.esm.min.js"
import customizeOperation from './customizeOperation.js'



const socketConnect = {
    socket: io(`/room_${customizeOperation.getFrontEndCode('chatRoomId')}`),
    // 傳送進入房間訊息
    enterRoom: () => {
        const emitMessage = {
            studentId: customizeOperation.getFrontEndCode('studentId'),
            sendTime: customizeOperation.getNowTime('SimpleTime'),
            chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
        }
        socketConnect.socket.emit('enterRoom', JSON.stringify(emitMessage))
    },
    // 傳送離開房間訊息
    leaveRoom: () => {
        const emitMessage = {
            studentId: customizeOperation.getFrontEndCode('studentId'),
            sendTime: customizeOperation.getNowTime('SimpleTime'),
            chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
        }
        socketConnect.socket.emit('leaveRoom', JSON.stringify(emitMessage))
    },

    // 收到進入房間訊息
    receiveEnterRoom: () => {
        socketConnect.socket.on('re-enterRoom', (message) => {
            const receiveMessage = JSON.parse(message)
            MessageType.enterRoom(receiveMessage)
            // 前十則訊息接收
            if (receiveMessage.chatRoomId === undefined) {
                for (let message of receiveMessage) {
                    if (message.studentId === customizeOperation.getFrontEndCode('studentId')) {
                        MessageType.sendMessage(message)
                    } else {
                        //別人傳則使用別人傳的模型
                        MessageType.receiveMessage(message)
                    }
                }
            }

        })
    },
    // 收到離開房間訊息
    receiveLeaveRoom: () => {
        socketConnect.socket.on('re-leaveRoom', (message) => {
            const receiveMessage = JSON.parse(message)
            MessageType.leaveRoom(receiveMessage)
        })
    },

    // 收到房間人數變動訊息
    receiveRoomNumber: () => {
        socketConnect.socket.on('roomNumber', (message) => {
            $('#roomNumberCounter').text(`🤓 ${message}`)
        })
    },

    // 傳送訊息
    sendMessage: (message) => {
        const emitMessage = {
            studentId: customizeOperation.getFrontEndCode('studentId'),
            sendTime: customizeOperation.getNowTime('SecondTime'),
            message: message,
            chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
        }
        socketConnect.socket.emit('sendMessage', JSON.stringify(emitMessage))
    },

    // 接收訊息
    receiveMessage: () => {
        socketConnect.socket.on('re-sendMessage', (message) => {
            const receiveMessage = JSON.parse(message)
            //若自己傳的，顯示自己傳送的模型
            if (receiveMessage.studentId === customizeOperation.getFrontEndCode('studentId')) {
                MessageType.sendMessage(receiveMessage)
            } else {
                //別人傳則使用別人傳的模型
                MessageType.receiveMessage(receiveMessage)
            }
        })
    },

    //共編部分
    cowork: {
        selectionArea: 'golist',
        executor: null,
        changeReceiveMounted: false,
        //偵測滑鼠移動
        mouseMove: () => {
            $(document).on('mousemove', (e) => {
                const mousePosition = {
                    chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
                    studentId: customizeOperation.getFrontEndCode('studentId'),
                    selectionArea: socketConnect.cowork.selectionArea,
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                }
                socketConnect.socket.emit('sendMouseMove', JSON.stringify(mousePosition))
            })
        },
        //偵測滑鼠點擊
        mouseClick: () => {

        },
        // 接收滑鼠偵測
        receiveMouseMove: () => {
            socketConnect.socket.on('re-sendMouseMove', (message) => {
                const receivedMouseMove = JSON.parse(message)
                if (receivedMouseMove.studentId !== customizeOperation.getFrontEndCode('studentId')) {
                    MouseType.mouseIcon(receivedMouseMove)
                }
            })
        },

        // 共編程式
        updateCode: (text, lineFrom, lineTo, origin) => {
            const codeInformation = {
                chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
                studentId: customizeOperation.getFrontEndCode('studentId'),
                text: text,
                lineFrom: lineFrom,
                lineTo: lineTo,
                origin: origin
            }
            socketConnect.socket.emit('sendUpdateCode', JSON.stringify(codeInformation))
        },
        // 接收共編程式
        receiveUpdateCode: () => {
            $('#coworkArea').data("CodeMirror").on('change', emitUpdateCode)
            socketConnect.socket.on('re-sendUpdateCode', (message) => {
                const reciveMessage = JSON.parse(message)
                if (reciveMessage.studentId !== customizeOperation.getFrontEndCode('studentId')) turnChangeEventOff(replaceCode, turnChangeEventOn)

                async function turnChangeEventOff(replaceCode, evenOn) {
                    await $('#coworkArea').data("CodeMirror").off('change', emitUpdateCode)
                    await replaceCode()
                    await evenOn()
                }

                function replaceCode() {
                    $('#coworkArea').data("CodeMirror").replaceRange(
                        reciveMessage.text,
                        reciveMessage.lineFrom,
                        reciveMessage.lineTo,
                        reciveMessage.origin
                    )
                }

                function turnChangeEventOn() {
                    $('#coworkArea').data("CodeMirror").on('change', emitUpdateCode)
                }
            })

            // 偵測 change 事件
            function emitUpdateCode(instance, obj) {
                socketConnect.cowork.updateCode(obj.text, obj.from, obj.to, obj.origin)
            }
        },
        // 關閉接收共編程式
        closeReceiveUpdateCode: () => {
            socketConnect.socket.removeAllListeners('re-sendUpdateCode')
        },

        // 執行程式
        executeProject: (response) => {
            const executeMessage = {
                studentId: customizeOperation.getFrontEndCode("studentId"),
                execute: true,
                response: response
            }
            socketConnect.socket.emit("executeProject", JSON.stringify(executeMessage))
        },
        // 結束執行程式
        endProject: () => {
            const executeMessage = {
                studentId: customizeOperation.getFrontEndCode("studentId"),
                execute: false
            }
            socketConnect.socket.emit("executeProject", JSON.stringify(executeMessage))
        },
        // 收到執行/結束程式
        receiveExecuteProject: () => {
            socketConnect.socket.on("re-executeProject", (message) => {
                const reciveMessage = JSON.parse(message)

                if (socketConnect.cowork.selectionArea.split("-")[1] === '3') {
                    if (reciveMessage.execute) {
                        renderDemoContainer(reciveMessage.response)
                        $('#coworkArea').data("CodeMirror").setOption('readOnly', reciveMessage.execute)
                        socketConnect.cowork.executor = reciveMessage.studentId
                        console.log("EXE", reciveMessage, socketConnect.cowork.executor = reciveMessage.studentId)
                    } else {
                        if (socketConnect.cowork.executor === reciveMessage.studentId) {
                            $('#coworkArea').data("CodeMirror").setOption('readOnly', reciveMessage.execute)
                            console.log("LEAVE", reciveMessage, socketConnect.cowork.executor = reciveMessage.studentId)
                        }
                    }
                }
            })
            function renderDemoContainer(response) {
                $('.DemoDiv').remove()
                const demoDiv = $("<div>")
                    .prop({
                        className: "container-fluid DemoDiv",
                    })
                    .prependTo($("body"))

                const demoIframe = $("<div>")
                    .prop({
                        className:
                            "row justify-content-start iframeContainer",
                    })
                    .appendTo(demoDiv)

                const demoContent = $("<div>")
                    .prop({
                        className: "col-12 demoContent",
                        id: "LS_programmingDemoContent_up",
                    })
                    .click(e => {
                        if (
                            demoContent.attr("id") ===
                            "LS_programmingDemoContent_up"
                        ) {
                            demoContent.attr(
                                "id",
                                "LS_programmingDemoContent_down"
                            )
                            downIcon.css({
                                transform: "rotate(180deg)",
                            })
                            demoContent.css({
                                transform: "translateY(-10px)",
                            })
                        } else {
                            demoContent.attr(
                                "id",
                                "LS_programmingDemoContent_up"
                            )
                            downIcon.css({
                                transform: "rotate(0deg)",
                            })
                            demoContent.css({
                                transform: "translateY(-95vh)",
                            })
                            socketConnect.cowork.endProject()
                        }
                    })
                    .appendTo(demoIframe)

                const demoIframeInfo = $("<iframe>")
                    .prop({
                        className: "col-12",
                        id: "demoIframe",
                        src: customizeOperation.getFrontEndCode('coworkStatus') === 'N' ?
                            `../Access/${customizeOperation.getCookie("studentId")}/${response}/${response}.html` :
                            `../../Cowork/${customizeOperation.getFrontEndCode('chatRoomId')}/${response}/${response}.html`,
                        sandBox: "allow-scripts"
                    })
                    .css({
                        width: "100%",
                        height: "95%",
                        margin: "0 auto",
                        "margin-top": "5px",
                        border: "1px dashed black",
                        "border-radius": "20px",
                    })
                    .appendTo(demoContent)
                //DownIcon
                const downIcon = $("<div>")
                    .prop({
                        className: "col-1 offset-md-5 downIcon",
                        innerHTML:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="20px" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>',
                    })
                    .appendTo(demoContent)

                demoIframeInfo.on("load", e => {
                    e.preventDefault()
                    customizeOperation.loadingPage(false)
                    demoContent.click()
                })
            }
        },


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
    leaveRoom: (message) => {
        $('<div>').prop({
            className: 'chatBox_enterMessage',
            innerHTML: `${message.sendTime} ${message.studentId} 離開房間`
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

        //轉換選擇區域
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