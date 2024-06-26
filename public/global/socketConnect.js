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
            coworkStatus: customizeOperation.getFrontEndCode('coworkStatus'),
            courseId: customizeOperation.getFrontEndCode('courseId'),
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
            // 前十則訊息接收
            if (receiveMessage.chatRoomId === undefined) {
                for (let message of receiveMessage.reverse()) {
                    if (message.studentId === customizeOperation.getFrontEndCode('studentId')) {
                        MessageType.sendMessage(message, true)
                    } else {
                        //別人傳則使用別人傳的模型
                        MessageType.receiveMessage(message, false, true)
                    }
                }
            } else {
                MessageType.enterRoom(receiveMessage)
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
        mouseMove: function () {
            $(document).on('mousemove', (e) => {
                const mousePosition = {
                    chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
                    studentId: customizeOperation.getFrontEndCode('studentId'),
                    selectionArea: this.selectionArea,
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
        receiveExecuteProject: function () {
            socketConnect.socket.on("re-executeProject", (message) => {
                const reciveMessage = JSON.parse(message)

                if (this.selectionArea.split("-")[1] === '3') {
                    if (reciveMessage.execute) {
                        renderDemoContainer(reciveMessage.response)
                        // $('#coworkArea').data("CodeMirror").setOption('readOnly', reciveMessage.execute)
                        this.executor = this.studentId
                        // console.log("EXE", reciveMessage, this.executor = reciveMessage.studentId)
                    } else {
                        if (this.executor === reciveMessage.studentId) {
                            // $('#coworkArea').data("CodeMirror").setOption('readOnly', reciveMessage.execute)
                            // console.log("LEAVE", reciveMessage, this.executor = reciveMessage.studentId)
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

        // 接收投票通知
        receiveVoting: function () {
            socketConnect.socket.on('re-startVoting', (message) => {
                const votingMessage = JSON.parse(message)
                if (votingMessage.studentId !== customizeOperation.getFrontEndCode("studentId") && this.selectionArea !== 'vote') {
                    $('#vote').click()
                    setTimeout(() => {
                        $(`#voting_member_${votingMessage.studentId}`)
                            .text('✔️')
                            .removeClass('voting_memberContent_memberVoteStatus_noVote')
                            .addClass('voting_memberContent_memberVoteStatus_Voted')
                    }, 500)
                    customizeOperation.activeToast(
                        '投票通知',
                        `由 ${votingMessage.studentId} 發起`,
                        `${votingMessage.studentId} 發起了 ${votingMessage.type} 投票`
                    )
                } else if (votingMessage.studentId !== customizeOperation.getFrontEndCode("studentId") && this.selectionArea == 'vote') {
                    $(`#voting_member_${votingMessage.studentId}`)
                        .text('✔️')
                        .removeClass('voting_memberContent_memberVoteStatus_noVote')
                        .addClass('voting_memberContent_memberVoteStatus_Voted')
                    customizeOperation.activeToast(
                        '投票通知',
                        `${votingMessage.studentId} 同意`,
                        `${votingMessage.studentId} 同意了 ${votingMessage.type} 投票`
                    )
                }
            })
            // 完成投票通知
            socketConnect.socket.on('completeVoting', (message) => {
                const votingMessage = JSON.parse(message)
                customizeOperation.activeToast(
                    '投票通知',
                    `投票完成`,
                    `${votingMessage.type} 投票已通過`
                )
                setTimeout(() => {
                    if (votingMessage.type === '前往下一階段') {
                        alert("開啟下一階段")
                        location.reload()
                    }
                }, 1000)
            })
        },
        // 發起投票通知
        startVoting: function (type = "testing") {
            const votingMessage = {
                studentId: customizeOperation.getFrontEndCode('studentId'),
                chatRoomId: customizeOperation.getFrontEndCode('chatRoomId'),
                vote: true,
                type: type
            }
            socketConnect.socket.emit("startVoting", JSON.stringify(votingMessage))
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

    /**
     * 自己傳送的訊息
     * @param {string} message 傳出訊息
     * @param {boolean} history 是否為歷史回顧訊息
     */
    sendMessage: (message, history = false) => {
        const messageBox = $('<div>').prop({
            className: 'chatBox_sendMessageBox'
        })

        history ? messageBox.prependTo($('.chatBox_MessageContent')) : messageBox.appendTo($('.chatBox_MessageContent'))

        //student Id
        $('<div>').prop({
            className: 'chatBox_sendMessageBox_studentId',
            innerHTML: `<div>${message.studentId}</div>`
        }).appendTo(messageBox)

        //Message
        $('<div>').prop({
            className: 'chatBox_sendMessage_messageBox',
            innerHTML: `<span>${message.message}</span>`
        }).appendTo(messageBox)

        //send Time
        $('<div>').prop({
            className: 'chatBox_sendMessage_sendTime',
            innerHTML: `<div>${message.sendTime}</div>`
        }).appendTo(messageBox)

        $('.chatBox_MessageContent').scrollTop($('.chatBox_MessageContent')[0].scrollHeight)
        if (!history) $('#sendMsg')[0].play()
    },
    /**
     * 別人傳送的訊息
     * @param {string} message 傳入訊息
     * @param {boolean} typingbubble 是否是正在輸入的氣泡訊息
     * * @param {boolean} history 是否為歷史回顧訊息
     */
    receiveMessage: (message, typingbubble = false, history = false) => {
        const { markedHighlight } = globalThis.markedHighlight
        const { Marked } = globalThis.marked
        const marked = new Marked(
            markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang, info) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                }
            })
        );
        const messageBox = $('<div>').prop({
            className: 'chatBox_receiveMessageBox'
        })

        history ? messageBox.prependTo($('.chatBox_MessageContent')) : messageBox.appendTo($('.chatBox_MessageContent'))

        if (typingbubble) messageBox.attr('id', 'bubbleText')

        //student Id
        $('<div>').prop({
            className: 'chatBox_receiveMessageBox_studentId',
            innerHTML: `<div>${message.studentId}</div>`
        }).appendTo(messageBox)

        //Message
        $('<div>').prop({
            className: 'chatBox_receiveMessage_messageBox',
            innerHTML: `<span>${marked.parse(message.message || '')}</span>`
        }).appendTo(messageBox)

        //send Time
        $('<div>').prop({
            className: 'chatBox_receiveMessage_sendTime',
            innerHTML: `<div>${message.sendTime}</div>`
        }).appendTo(messageBox)

        $('.chatBox_MessageContent').scrollTop($('.chatBox_MessageContent')[0].scrollHeight)
        if (!history) $('#reciveMsg')[0].play()
        if ($('.chatBox').attr("id") === 'chatBox_Close' && !history) {
            // 顯示未讀訊息
            $('.chatBox').addClass("unreadMessage")
            $('.chatBox_unreadCount').text(parseInt($('.chatBox_unreadCount').text()) + 1).css('opacity', '1')
        }
    }
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