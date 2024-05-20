import { socketConnect, MessageType } from "../../global/socketConnect.js"
import { ClickListening } from "../../global/common.js"
import { studentClientConnect } from "../../global/axiosconnect.js"
import customizeOperation from "./customizeOperation.js"

const chatBoxInit = () => {
    if (customizeOperation.getFrontEndCode('coworkStatus') === 'N') {
        renderChatBox("person")
        return
    }
    if (customizeOperation.getFrontEndCode("chatRoomId")) {
        // 傳送進入房間訊息
        socketConnect.enterRoom()
        // 監聽是否有人進入
        socketConnect.receiveEnterRoom()
        // 監聽是否有人離開
        socketConnect.receiveLeaveRoom()
        // 監聽訊息
        socketConnect.receiveMessage()
        // 監聽房間人數
        socketConnect.receiveRoomNumber()

        // 產生聊天室窗
        renderChatBox("cowork")
    }
}

function renderChatBox(status = "cowork") {
    const chatBoxMessageContainer = $("<div>")
        .prop({
            className: "chatBox_MessageContainer",
        })
        .prependTo($(".chatBoxContainer"))

    //Title
    $("<div>")
        .prop({
            className: "chatBox_MessageTitle",
            innerHTML: status == "cowork" ? "<h3>聊天</h3>" : "<h3>程式助理：阿姆阿姆</h3>",
        })
        .appendTo(chatBoxMessageContainer)

    // MessageBox
    const MessageBox = $("<div>")
        .prop({
            className: "chatBox_MessageBox",
        })
        .appendTo(chatBoxMessageContainer)
    //Content
    const MessageContent = $("<div>")
        .prop({
            className: "chatBox_MessageContent",
        })
        .appendTo(MessageBox)
    //EnterBox
    const EnterBox = $("<div>")
        .prop({
            className: "input-group chatBox_MessageEnterBox",
            innerHTML:
                '<textarea id="Message" class="form-control chatBox_MessageEnterBox_Input" placeholder="..." aria-describedby="button-addon2">',
        })
        .appendTo(MessageBox)

    $("<button>")
        .prop({
            className: "btn btn-outline-secondary",
            type: "button",
            id: "sendMessage",
            innerHTML:
                '<svg xmlns="http://www.w3.org/2000/svg" width="50%" height="100%" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/></svg>',
        })
        .css({
            width: "70px",
        })
        .click(() => {
            sendMessage()
        })
        .appendTo(EnterBox)

    const chatBox = $(".chatBox")
    chatBox.click(e => {
        if (chatBox.attr("id") === "chatBox_Close") {
            openChatBox()
        } else {
            closeChatBox()
        }
    })

    const openChatBox = () => {
        chatBox.attr("id", "chatBox_Open")
        $(".chatBox_MessageContainer")
            .css({
                display: "inline",
            })
            .animate(
                {
                    opacity: "1",
                },
                300
            )

        $(".chatBox_MessageContent").scrollTop(
            $(".chatBox_MessageContent")[0].scrollHeight
        )

        $("#Message").keydown(e => {
            if (e.shiftKey && e.keyCode === 13) {
                $("#Message").val($("#Message").val() + "\n")
            } else if (e.keyCode === 13) {
                e.preventDefault()
                sendMessage()
            }
        })

        //reset 未讀訊息
        $('.chatBox').removeClass("unreadMessage")
        $('.chatBox_unreadCount').text("0").css('opacity', 0)
    }
    const closeChatBox = () => {
        chatBox.attr("id", "chatBox_Close")
        $(".chatBox_MessageContainer").animate(
            {
                opacity: "0",
            },
            300
        )
        $("#Message").off("keydown")
        setTimeout(e => {
            $(".chatBox_MessageContainer").css({
                display: "none",
            })
        }, 300)
    }

    // send message
    const sendMessage = () => {
        if ($("#Message").val() !== "") {
            ClickListening("", `FlowChart-傳送訊息-${$("#courseTitle").text().replace(/\s/g, "")}-${$("#Message").val()}`)
            if (status === "cowork") {
                socketConnect.sendMessage($("#Message").val())
            } else {
                MessageType.sendMessage({
                    studentId: customizeOperation.getFrontEndCode('studentId'),
                    sendTime: customizeOperation.getNowTime('SecondTime'),
                    message: $("#Message").val()
                })
                MessageType.receiveMessage({
                    studentId: '阿姆阿姆',
                    sendTime: customizeOperation.getNowTime('SecondTime'),
                    message: "請稍等...正在處理你的問題..."
                }, true)
                studentClientConnect.connectChatGPT(
                    customizeOperation.getNowTime("FullTime"),
                    $("#Message").val(),
                    customizeOperation.getFrontEndCode("courseId"),
                    $("#courseTitle").text().replace(/\s/g, "")
                ).then(response => {
                    // 引入 markedHightlight
                    // 使用 Markdown 解析 chatGPT 回傳字串
                    // Ref -=-
                    // abstract: https://www.cnblogs.com/rotk2022/p/17223591.html
                    // hightlightJS:　https://highlightjs.org/#usage
                    // Markdown: https://marked.js.org/
                    // markedHightlight: https://www.npmjs.com/package/marked-highlight
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
                    MessageType.receiveMessage({
                        studentId: '阿姆阿姆',
                        sendTime: customizeOperation.getNowTime('SecondTime'),
                        message: marked.parse(response.data.message.GPTreply.message.content)
                        // message: marked.parse(response.data.message.message)
                    })
                    $('#bubbleText').remove()
                })
            }
            $("#Message").val("")
        }
    }

    //重新整理次數記錄
    let freshCount = 2
    $(MessageContent).on("scroll", () => {
        if ($(MessageContent).scrollTop() === 0) {
            if (status === 'cowork') {
                studentClientConnect.getMessageHistory(freshCount, customizeOperation.getFrontEndCode("chatRoomId"))
                    .then(response => {
                        if (customizeOperation.serverResponseErrorDetect(response)) {
                            if (response.data.message == undefined) return
                            const reverseMessage = response.data.message.reverse()
                            const OffsetScrollTop = $(".chatBox_MessageContent")[0].scrollHeight

                            for (let messageHistory of reverseMessage) {
                                if (messageHistory.studentId === customizeOperation.getCookie("studentId")) {
                                    MessageType.sendMessage(messageHistory, true)
                                } else {
                                    //別人傳則使用別人傳的模型
                                    MessageType.receiveMessage(messageHistory, false, true)
                                }
                            }
                            $(".chatBox_MessageContent").scrollTop($(".chatBox_MessageContent")[0].scrollHeight - OffsetScrollTop - 100)
                            freshCount++
                        }
                    })
            } else {

            }
        }
    })
}

export { chatBoxInit }
