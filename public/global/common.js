import {
    TargetBox,
    CommentBox,
    UnderstandingBox,
    FormulatingBox,
    ProgrammingBox,
    ReflectionBox,
    WriteFormulatingBox,
} from "../js/golist/gogrammingPage.js"
import {
    adminTargetBox,
    adminStartBox,
    adminUnderstandingBox,
    adminFormulatingBox,
    adminProgrammingBox,
    adminReflectionBox,
} from "../js/admin/golist/gogrammingPage.js"
import { adminClientConnect, studentClientConnect } from "./axiosconnect.js"

//------------------------------ normal function ------------------------------//]
const NormalizeFunc = {
    //loading Page
    loadingPage: state => {
        if (state) {
            $(".loadingContainer").css('top', $(document).scrollTop())
            $(".loadingContainer").fadeIn(200)
        } else {
            $(".loadingContainer").fadeOut(200)
        }
    },
    //與 server 聯繫進行偵錯
    serverResponseErrorDetect: response => {
        // status sign meaning
        // status 200 => success
        // status 500 => server error
        // status 501 => empty
        // status 404 => error
        // status 401 => account error
        switch (response.data.status) {
            case 200:
                return true
            case 500:
                window.alert(response.data.message)
                return false
            case 501:
                if (response.data.message) window.alert(response.data.message)
                return true
            case 404:
                window.alert(response.data.message || "Error 請重新整理網頁")
                return false
            case 401:
                window.alert(response.data.message)
                NormalizeFunc.loadingPage(false)
                return false
        }
    },
    //取得 cookie值
    getCookie: name => {
        let value = "; " + document.cookie
        let parts = value.split("; " + name + "=")
        if (parts.length == 2) return parts.pop().split(";").shift()
    },
    //取得 當前時間
    getNowTime: type => {
        const date = new Date()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()

        if (hour.toString().length === 1) {
            hour = "0" + hour
        }
        if (minute.toString().length === 1) {
            minute = "0" + minute
        }
        if (second.toString().length === 1) {
            second = "0" + second
        }

        switch (type) {
            case "SimpleTime":
                return hour + ":" + minute
            case "SecondTime":
                return hour + ":" + minute + ":" + second
            case "FullTime":
                return `${date.getFullYear()}/${date.getMonth() + 1
                    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
    },
    //取得 Front-end Code
    getFrontEndCode: id => {
        return $.trim($(`#${id}`).text())
    },
    //calculate maximumSizeInMegaByte
    maximumSizeInMegaByte: Byte => {
        //MB -> KB -> Byte
        return Byte * 1024 * 1024
    },
    //return Download xlsx
    downloadDataToExcel: async (workbookTitle, worksheetData, worksheetName) => {
        // console.log(workbookTitle, worksheetData, worksheetName)
        const workbook = XLSX.utils.book_new();
        worksheetData.map((dataValue, dataIndex) => {
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataValue), worksheetName[dataIndex]);
            //Binary string
            // XLSX.write(workbook, { book_type: "xlsx", type: "binary" });
            if (dataIndex == worksheetData.length - 1) {
                const Month = new Date().getMonth();
                const Today = new Date().getDate();
                XLSX.writeFile(workbook, `${workbookTitle}_${Month}\/${Today}.xls`);
            }
        })
    }
}
//------------------------------ category Box Function -----------------------------------//
const categoryBox = {
    Target: data => {
        $(".targetIframe").attr(
            "src",
            `../Material/${data.message}/full/index.html`
        )
    },
    Start: (data, key) => {
        if (data.message === undefined) {
            $("#startDescription").html(`<h3>Task undefined</h3>`)
            return
        }

        return
    },
    Understanding: data => {
        console.log(data)
        if (data.message === undefined) {
            $("#understandingDescription").html(
                `<h3>任務目標 -</h3><h3> -- </h3>`
            )
            return
        }
        $("#understandingDescription").html(
            `<h3>任務目標 -</h3><h3>⭐${data.message.understandingData.target}⭐</h3>`
        )

        //starting 移植部分
        // 設定 Iframe 跑的　demo
        $("#startIframe").attr("src", `../Material${data.message.startingData.material}`)
        // 設定 button click 事件
        $("#start_launchbtn").click(e => {
            $("#startIframe").attr("src", `../Material${data.message.startingData.material}`)
            $("#demoContent").addClass("startDemoFinish")
            setTimeout(e => {
                $("#demoContent").removeClass("startDemoFinish")
            }, 800)
        })
        //----------------------------

        //operation
        if (data.message.understandingData.operation !== undefined) {
            data.message.understandingData.operation.split("\n").forEach(operation => {
                $("<p>")
                    .prop({
                        className: "understandingDescription_operationText",
                        innerHTML: "🕹 " + operation,
                    })
                    .appendTo($("#understandingOperation"))
            })
        }

        //limit
        if (data.message.understandingData.limit !== undefined) {
            data.message.understandingData.limit.split("\n").forEach(limit => {
                $("<p>")
                    .prop({
                        className: "understandingDescription_limitText",
                        innerHTML: "⚠ " + limit,
                    })
                    .appendTo($("#understandingLimit"))
            })
        }
    },
    Formulating: data => {
        if (data.message === undefined) {
            return
        }
        if (data.message.content !== undefined) {
            let index = 0
            for (const { title, code, description } of data.message.content) {
                // ContentBox
                const contentBox = $("<div>")
                    .prop({
                        className: "formulatingDescription_contentBox",
                    })
                    .appendTo($("#formulatingContent"))

                //Title
                $("<div>")
                    .prop({
                        className: "formulatingDescription_contentTitle",
                        innerHTML: `<h4>⌨ ${title}</h4>`,
                    })
                    .appendTo(contentBox)

                //Code
                $("<textarea>")
                    .prop({
                        className: "formulatingDescription_contentCode",
                        id: `code_${index}`,
                        innerHTML: code,
                    })
                    .appendTo(contentBox)

                CodeMirrorFunc.codeMirrorProgram(`code_${index}`, code, true)
                $(`#code_${index}`).data("CodeMirror").setSize("auto", "auto")
                $(`#code_${index}`)
                    .data("CodeMirror")
                    .setOption("readOnly", true)
                index++

                //Description
                $("<div>")
                    .prop({
                        className: "formulatingDescription_contentDescription",
                        innerHTML: `<p>${description}</p>`,
                    })
                    .appendTo(contentBox)
            }
        }
    },
    WriteFormulating: data => {
        if (data.message === undefined) {
            return
        } else {
            let index = 0
            for (const { title, code, description } of data.message) {
                // ContentBox
                const contentBox = $("<div>")
                    .prop({
                        className: "formulatingDescription_contentBox",
                        id: `writeFormulating_${index}`,
                    })
                    .insertBefore($("#addFormulationBtn"))

                //Button area------------------------------------
                const formulatingButton = $("<div>")
                    .prop({
                        className: "row writeFormulatingButton",
                    })
                    .appendTo(contentBox)

                $("<h2>")
                    .prop({
                        className: "col-1 writeFormulatingButton_hash",
                        innerHTML: `#${index}`
                    }).appendTo(formulatingButton)

                $("<button>")
                    .prop({
                        className:
                            "col-1 btn btn-outline-danger writeFormulatingButton_cancel",
                        id: index,
                        innerHTML:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="20px" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>',
                    })
                    .click(e => {
                        removeFormulating(e.currentTarget.id)
                        ClickListening("", `刪除-表徵制定-自訂義語法 ${e.currentTarget.id}`)
                    })
                    .appendTo(formulatingButton)
                //-----------------------------------------------

                //Title
                $("<div>")
                    .prop({
                        className:
                            "form-floating writeFormulatingDescription_contentTitle",
                        innerHTML:
                            `<input type="text" class="form-control formulatingContentTitleValue" id="formulatingContentTitleValue" placeholder="將使用到的語法" value=${title}/>` +
                            '<label for="formulatingContentTitle">將使用到的語法</label>',
                    })
                    .appendTo(contentBox)
                //Code
                $("<textarea>")
                    .prop({
                        className: "formulatingDescription_contentCode",
                        id: `code_${index}`,
                        innerHTML: code,
                    })
                    .appendTo(contentBox)

                CodeMirrorFunc.codeMirrorProgram(`code_${index}`, code, false)
                $(`#code_${index}`).data("CodeMirror").setSize("auto", "auto")
                index++

                //Description
                $("<div>")
                    .prop({
                        className:
                            "form-floating writeFormulatingDescription_contentDescription",
                        innerHTML:
                            `<textarea class="form-control formulatingContentDescription" id="formulatingContentDescription" placeholder="該語法的描述" style="height:300px;resize:none">${description}</textarea>` +
                            '<label for="formulatingContentDescription">該語法的描述</label>',
                    })
                    .appendTo(contentBox)
            }

            function removeFormulating(index) {
                $(`#writeFormulating_${index}`).fadeOut("fast")
                setTimeout(e => {
                    $(`#writeFormulating_${index}`).remove()
                }, 500)
            }
        }
    },
    Programming: (data, key) => {
        let codeData = [
            { name: "setting", data: "" },
            { name: "config", data: "" },
            { name: "preload", data: "" },
            { name: "create", data: "" },
            { name: "update", data: "" },
            { name: "custom", data: "" },
        ]
        // 塞入紀錄的程式內容----------------------------------
        if (data.code !== undefined) {
            codeData = [
                { name: "setting", data: data.code.setting || "" },
                { name: "config", data: data.code.config || "" },
                { name: "preload", data: data.code.preload || "" },
                { name: "create", data: data.code.create || "" },
                { name: "update", data: data.code.update || "" },
                { name: "custom", data: data.code.custom || "" },
            ]
        }

        for (const CodeMirror of codeData) {
            CodeMirrorFunc.codeMirrorProgram(
                CodeMirror.name,
                CodeMirror.data,
                false
            )
            $(`#${CodeMirror.name}`).data("CodeMirror").setSize("auto", "auto")
        }
        //-----------------------------------------------------

        //hint
        if (data.hint !== undefined) {
            data.hint.split("\n").forEach((hint, index) => {
                if (index !== 0) {
                    $("<div>")
                        .prop({
                            className: "programmingDescription_hintArrow",
                            innerHTML:
                                '<img src="../media/img/arrow.gif" width="50px" height="50px" style="transform:rotate(90deg); user-select:none"></img>',
                        })
                        .appendTo($("#programmingHint"))
                }

                $("<div>")
                    .prop({
                        className: "programmingDescription_hintText",
                        innerHTML: `<p>👊step ${index + 1}</p>` + hint,
                        id: `programmingHint_${index}`,
                    })
                    .appendTo($("#programmingHint"))

                $("<div>")
                    .prop({
                        className: "programmingDescription_hintCode",
                        innerHTML:
                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="100%" fill="orange"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>',
                        id: `programmingHintCode_${index}`,
                    })
                    .attr({
                        "data-bs-toggle": "tooltip",
                        "data-bs-placement": "right",
                        "data-container": "body",
                        "data-bs-html": "true",
                        name: "hint",
                        title: "<h3>程式碼參考</h3>若無顯示請重新點擊",
                    })
                    .appendTo($(`#programmingHint_${index}`))
            })
        }

        //初始化 boostrap Tooltip
        $('[data-bs-toggle="tooltip"]').tooltip({
            trigger: "click",
        })

        //點擊時將其他 tooltip 關閉
        $('[data-bs-toggle="tooltip"]').click(function () {
            if ($(this).attr("name") === "hint") {
                $('[data-bs-toggle="tooltip"]').not(this).tooltip("hide")
            }
        })
        // $('[data-bs-toggle="tooltip"]').on('show.bs.tooltip', function () {

        // })

        //Hint tooltip 內容
        $('[data-bs-toggle="tooltip"]').on("shown.bs.tooltip", function () {

            const hintTooltip = $(this)

            if (hintTooltip.attr("name") === "hint") {
                //Code 展示區
                $("<textarea>")
                    .prop({
                        id: "hint",
                    })
                    .css({
                        resize: "none",
                    })
                    .appendTo($(".tooltip-inner"))

                if (data.hintCode !== undefined) {
                    CodeMirrorFunc.codeMirrorProgram(
                        "hint",
                        data.hintCode[hintTooltip.attr("id").split("_")[1]] ||
                        "no data",
                        true
                    )
                } else {
                    CodeMirrorFunc.codeMirrorProgram("hint", "no data", true)
                }
                $("#hint").data("CodeMirror").setSize("auto", "auto")

                //Code 複製 button
                $("<button>")
                    .prop({
                        id: "hintCopy",
                        className: "btn btn-primary",
                        innerHTML: "Copy",
                    })
                    .click(e => {
                        e.stopPropagation()
                        // console.log(data.hintCode[hintTooltip.attr("id").split("_")[1]])
                        navigator.clipboard.writeText(
                            data.hintCode[hintTooltip.attr("id").split("_")[1]]
                        )
                    })
                    .appendTo($(".tooltip-inner"))
            }
        })
    },
    Reflection: data => {
        if (data == undefined) {
            return
        }
        $("#learningValue").val(data.learing)
        $("#workhardValue").val(data.workhard)
        $("#difficultValue").val(data.difficult)
        $("#scoringValue").val(data.scoring)

        switch (data.scoring) {
            case "0":
                $("#scoringText").html(
                    "<p>0分，我完全不滿意我的表現，好爛!</p>"
                )
                break
            case "1":
                $("#scoringText").html("<p>1分，我甚麼都不會😢</p>")
                break
            case "2":
                $("#scoringText").html(
                    "<p>2分，我的人生怎麼會遇到這種難題😵</p>"
                )
                break
            case "3":
                $("#scoringText").html(
                    "<p>3分，我的程式碼跟我的人生一樣，只有一半成功，另一半還在Debug。</p>"
                )
                break
            case "4":
                $("#scoringText").html("<p>4分，感覺有了，但不多</p>")
                break
            case "5":
                $("#scoringText").html("<p>5分，中規中矩🤏</p>")
                break
            case "6":
                $("#scoringText").html(
                    "<p>6分，只要程式碼會跑，再亂都沒問題👌</p>"
                )
                break
            case "7":
                $("#scoringText").html(
                    "<p>7分，只要程式碼夠亂，就沒有人能抄襲😎</p>"
                )
                break
            case "8":
                $("#scoringText").html(
                    "<p>8分，程式碼有沒有問題不重要，能用就好</p>"
                )
                break
            case "9":
                $("#scoringText").html(
                    "<p>9分，這個世界上只有我搞不定的女生，沒有我搞不定的程式碼🤙🤙</p>"
                )
                break
            case "10":
                $("#scoringText").html(
                    "<p>10分，我的程式碼都是 ChatGPT 教我的，呵😎🤏</p>"
                )
                break
        }
    },
}
//------------------------------ Go.js Function -----------------------------------//
const GoListFunc = {
    saveCodeStatus: state => {
        if (state) {
            $(".content_status").fadeIn(200)
            $(".content_complete").animate(
                {
                    color: "black",
                    border: "1px solid black",
                    "font-size": "12px",
                    "font-weight": "normal",
                    opacity: "0.3",
                },
                200
            )
        } else {
            $(".content_status").fadeOut(200)
            $(".content_complete").animate(
                {
                    color: "green",
                    border: "1px solid green",
                    "font-size": "20px",
                    "font-weight": "bolder",
                    opacity: "1",
                },
                200
            )
        }
    },
    //show Each Box
    showContainer: async (s, id) => {
        ClickListening("", `打開-Task ${s.key} ${s.text}`)
        //取得 Iframe 發出之 Error 警訊
        const reciveMessage = e => {
            e.preventDefault()
            const sendPort = e.origin
            const sendMessage = e.data.data.arguments.join()
            const sendStatus = e.data.data.function
            // console.log(e.data.data.function)
            if (sendPort == "http://localhost:3000") {
                let logger = document.getElementById("testingCode")
                if (sendStatus == "log") {
                    logger.innerHTML +=
                        '<div class="consoleErrorArea_logCode">' +
                        sendMessage +
                        "</div>"
                } else if (sendStatus == "error") {
                    logger.innerHTML +=
                        '<div class="consoleErrorArea_errorCode">' +
                        sendMessage +
                        "</div>"
                }
            }
        }
        //listen Message from iframe
        const listenMessageBind = () => {
            window.addEventListener("message", reciveMessage, false)
        }
        const listenMessageUnbind = () => {
            window.removeEventListener("message", reciveMessage, false)
        }
        //click close function
        const closePage = () => {
            ClickListening("", `離開-${s.text}`)
            //關閉自動儲存
            //取得各階段程式碼
            if (
                s.category === "Programming" ||
                s.category === "Completed-Programming"
            ) {
                NormalizeFunc.loadingPage(true)
                const settingCode = $("#setting").data("CodeMirror")
                const configCode = $("#config").data("CodeMirror")
                const preloadCode = $("#preload").data("CodeMirror")
                const createCode = $("#create").data("CodeMirror")
                const updateCode = $("#update").data("CodeMirror")
                const customCode = $("#custom").data("CodeMirror")
                const keyCode = s.key

                studentClientConnect
                    .saveCode(
                        settingCode.getValue(),
                        configCode.getValue(),
                        preloadCode.getValue(),
                        createCode.getValue(),
                        updateCode.getValue(),
                        customCode.getValue(),
                        keyCode,
                        NormalizeFunc.getFrontEndCode("courseId")
                    )
                    .then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            NormalizeFunc.loadingPage(false)
                        }
                    })
            }

            //Auto save For Bonus-Formulating---------------------
            if (s.category === "Bonus-Formulating") {
                //得出現在共有多少個 Formulating
                const formulatingCount = $(
                    ".formulatingDescription_contentBox"
                ).length

                if (formulatingCount !== 0) {
                    //讀出最大數字為何
                    const codeMixed = parseInt(
                        $(".formulatingDescription_contentBox")[
                            $(".formulatingDescription_contentBox").length - 1
                        ].id.split("_")[1]
                    )

                    NormalizeFunc.loadingPage(true)

                    let codeData = []

                    for (let i = 0; i <= codeMixed; i++) {
                        if ($(`#code_${i}`).length !== 0) {
                            codeData.push($(`#code_${i}`).data("CodeMirror").getValue())
                        }
                    }

                    let formulatingData = []

                    for (let i = 0; i < formulatingCount; i++) {
                        formulatingData.push({
                            title: $(".formulatingContentTitleValue")[i].value,
                            description: $(".formulatingContentDescription")[i]
                                .value,
                            code: codeData[i],
                        })
                    }

                    studentClientConnect
                        .saveWriteFormulating(
                            NormalizeFunc.getFrontEndCode("courseId"),
                            s.key,
                            formulatingData
                        )
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                } else {
                    studentClientConnect
                        .saveWriteFormulating(
                            NormalizeFunc.getFrontEndCode("courseId"),
                            s.key,
                            []
                        )
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                }
            }
            //----------------------------------------------------


            // console.log(s.category)
            //Auto save For Reflection and Bonus-Reflection----------
            if (s.category === "Reflection" || s.category === "Bonus-Reflection" || s.category === "Completed-Reflection") {
                ClickListening("", `暫存-監控反思`)
                NormalizeFunc.loadingPage(true)
                studentClientConnect.tempSaveReflection(
                    NormalizeFunc.getFrontEndCode("courseId"),
                    s.key,
                    $("#learningValue").val(),
                    $("#workhardValue").val(),
                    $("#difficultValue").val(),
                    $("#scoringValue").val()
                ).then(response => {
                    if (NormalizeFunc.serverResponseErrorDetect(response)) {
                        NormalizeFunc.loadingPage(false)
                    }
                })
            }
            //-------------------------------------------------------

            block.fadeOut(200)
            contentDiv.fadeOut(200)
            //iframe
            $(".DemoDiv").fadeOut(200)
            $(".content_dataVisualizationArea").fadeOut(200)
            $(".content_consoleErrorArea").fadeOut(200)
            //unbind listenEvent
            listenMessageUnbind()
            setTimeout(() => {
                $("body").css({
                    overflow: "auto",
                })
                contentDiv.remove()
                block.remove()
                //iframe
                $(".DemoDiv").remove()
                $(".content_consoleErrorArea").remove()
                $(".content_dataVisualizationArea").remove()
                //Programming modal
                $(".modal").remove()
            }, 200)
        }

        //rotate Slide Code
        const rotateAllIconAndSlideAllCode = () => {
            const content_codingContainer = [
                ".content_coding_settingContainer",
                ".content_coding_configContainer",
                ".content_coding_preloadContainer",
                ".content_coding_createContainer",
                ".content_coding_updateContainer",
                ".content_coding_customContainer",
            ]

            if ($(".content_slide").attr("id") === "open") {
                ClickListening("", `全部收合-${s.text}-Code`)
                for (const codeContainer of content_codingContainer) {
                    if ($(codeContainer).attr("id") === "open") {
                        $(codeContainer).attr("id", "close").slideUp(300)
                        $(".codeDownIcon").css(
                            {
                                transform: "rotate(0deg)",
                            },
                            200
                        )

                        $(".content_slide").attr("id", "close").html("全部展開")
                    }
                }
            } else {
                ClickListening("", `全部展開-${s.text}-Code`)
                for (const codeContainer of content_codingContainer) {
                    if ($(codeContainer).attr("id") === "close") {
                        $(codeContainer).attr("id", "open").slideDown(300)
                        $(".codeDownIcon").css(
                            {
                                transform: "rotate(180deg)",
                            },
                            200
                        )

                        $(".content_slide").attr("id", "open").html("全部收合")
                    }
                }
            }
        }
        // loadingPage(true)

        //辨別任務
        //console.log(s)
        //禁止滾動
        $("body").css({
            overflow: "hidden",
        })
        NormalizeFunc.loadingPage(true)

        //blocking
        const block = $("<div>").prop({
            className: "container-fluid block",
        }).css({
            "margin-top": `calc(${window.pageYOffset}px - 15px)`,
        }).click(() => {
            closePage()
        }).prependTo($("body"))

        //contentDiv
        const contentDiv = $("<div>")
            .prop({
                className: "container-fluid contentDiv",
            })
            .css({
                "margin-top": `calc(${window.pageYOffset}px + 15px)`,
            })
            .prependTo($("body"))

        //contentContainer
        const contentContainer = $("<div>")
            .prop({
                className: "container-md contentContainer",
            })
            .appendTo(contentDiv)

        //------------------------------------------------
        //contentContainer Btn Area
        const content_iconContainer = $("<div>")
            .prop({
                className: "row justify-content-start",
            })
            .appendTo(contentContainer)
        //Cancel Btn
        const content_CancelBtn = $("<div>")
            .prop({
                className: "col-1 content_cancel",
                innerHTML:
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>',
            })
            .hover(
                e => {
                    content_CancelBtn.css({
                        "transition-duration": "0.3s",
                        "background-color": "rgba(0,0,0,0.2)",
                        "border-radius": "20px",
                    })
                },
                e => {
                    content_CancelBtn.css({
                        "transition-duration": "0.3s",
                        "background-color": "transparent",
                        "border-radius": "0",
                    })
                }
            )
            .click(e => {
                closePage()
            })
            .appendTo(content_iconContainer)
        //------------------------------------------------
        $("<button>")
            .prop({
                className: "col-1 content_slide btn-outline-primary btn",
                id: "open",
                innerHTML: "全部收合",
            })
            .click(e => {
                e.stopPropagation()
                rotateAllIconAndSlideAllCode()
            })
            .appendTo(content_iconContainer)

        //question button
        $("<button>")
            .prop({
                className: "col-1 btn btn-warning content_question",
                innerHTML:
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="20px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C352 78.8 273.2 0 176 0S0 78.8 0 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0C66.5 324.9 86.4 352.1 96 384H256zM176 512c44.2 0 80-35.8 80-80V416H96v16c0 44.2 35.8 80 80 80zM96 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"/></svg>',
                id: "LS_programmingHint",
            })
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#programmingHintModal")
            .appendTo(content_iconContainer)

        //complete Icon
        $("<div>")
            .prop({
                className: "col-1 content_complete",
                innerHTML: "Sync",
            })
            .appendTo(content_iconContainer)
        //status Icon
        $("<div>")
            .prop({
                className: "col-2 content_status",
                innerHTML:
                    '<svg id="content_status_icon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/></svg>' +
                    " Save code...",
            })
            .appendTo(content_iconContainer)

        //Start 任務欄
        //Comment 筆記
        //Understanding 探索理解
        //Formulating 表徵制定
        //Programming 計畫執行
        //Reflection 監控反思
        //利用 Key 值紀錄內容
        // console.log(s)

        if (id === "admin") {
            switch (s.category) {
            }
        } else {
            switch (s.category) {
                // 一般情況所使用
                case "Target":
                    TargetBox().appendTo(contentContainer)

                    await studentClientConnect
                        .getMaterial(NormalizeFunc.getFrontEndCode("courseId"))
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                categoryBox.Target(response.data)
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                    break
                case "Understanding":
                case "Completed-Understanding":
                case "Bonus-Understanding":
                    UnderstandingBox().appendTo(contentContainer)

                    await studentClientConnect
                        .getUnderstanding(
                            NormalizeFunc.getFrontEndCode("courseId"),
                            s.key
                        )
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                categoryBox.Understanding(response.data)
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                    break
                case "Formulating":
                case "Completed-Formulating":
                    FormulatingBox(s).appendTo(contentContainer)

                    await studentClientConnect
                        .getFormulating(
                            NormalizeFunc.getFrontEndCode("courseId"),
                            s.key
                        )
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                categoryBox.Formulating(response.data)
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                    break
                case "Programming":
                case "Completed-Programming":
                case "Bonus-Programming":
                    ProgrammingBox(s).appendTo(contentContainer)

                    //確認userId資料夾是否建立
                    await studentClientConnect.createDemo().then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            //讀取該key值的Code內容
                            studentClientConnect
                                .readCode(
                                    NormalizeFunc.getFrontEndCode("courseId"),
                                    s.key
                                )
                                .then(response => {
                                    if (
                                        NormalizeFunc.serverResponseErrorDetect(
                                            response
                                        )
                                    ) {
                                        // listenMessageBind()
                                        categoryBox.Programming(
                                            response.data,
                                            s.key
                                        )
                                        GoListFunc.saveCodeStatus(false)
                                        NormalizeFunc.loadingPage(false)
                                    }
                                })
                        }
                    })
                    break
                case "Reflection":
                case "Completed-Reflection":
                case "Bonus-Reflection":
                    ReflectionBox(s).appendTo(contentContainer)

                    //讀取 reflection 內容
                    await studentClientConnect
                        .readReflection(
                            NormalizeFunc.getFrontEndCode("courseId"),
                            s.key
                        )
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                categoryBox.Reflection(response.data.message)
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                    break
                case "Comment":
                    CommentBox(s).appendTo(contentContainer)
                    NormalizeFunc.loadingPage(false)
                    break
                // Bouns 使用
                case "Bonus-Formulating":
                    WriteFormulatingBox(s).appendTo(contentContainer)

                    await studentClientConnect
                        .getWriteFormulating(
                            NormalizeFunc.getFrontEndCode("courseId"),
                            s.key
                        )
                        .then(response => {
                            if (
                                NormalizeFunc.serverResponseErrorDetect(
                                    response
                                )
                            ) {
                                categoryBox.WriteFormulating(response.data)
                                NormalizeFunc.loadingPage(false)
                            }
                        })
                    break
            }
        }
    },
}
//------------------------------ codeMirror Function ------------------------------//
const CodeMirrorFunc = {
    //轉換各組行數
    swtichEditorNameToStartLineNumber: EditorName => {
        switch (EditorName) {
            case "setting":
                return 2
            case "config":
                return $("#setting").data("CodeMirror").lineCount() + 3
            case "preload":
                return (
                    $("#setting").data("CodeMirror").lineCount() +
                    $("#config").data("CodeMirror").lineCount() +
                    4
                )
            case "create":
                return (
                    $("#setting").data("CodeMirror").lineCount() +
                    $("#config").data("CodeMirror").lineCount() +
                    $("#preload").data("CodeMirror").lineCount() +
                    5
                )
            case "update":
                return (
                    $("#setting").data("CodeMirror").lineCount() +
                    $("#config").data("CodeMirror").lineCount() +
                    $("#preload").data("CodeMirror").lineCount() +
                    $("#create").data("CodeMirror").lineCount() +
                    6
                )
            case "custom":
                return (
                    $("#setting").data("CodeMirror").lineCount() +
                    $("#config").data("CodeMirror").lineCount() +
                    $("#preload").data("CodeMirror").lineCount() +
                    $("#create").data("CodeMirror").lineCount() +
                    $("#update").data("CodeMirror").lineCount() +
                    7
                )
            default:
                return 0
        }
    },
    //初始化各個Editor
    codeMirrorProgram: (name, content, isReadOnly) => {
        const textProgram = document.getElementById(name)
        CodeMirror.commands.autocomplete = function (cm) {
            cm.showHint({ hint: CodeMirror.hint.javascript })
        }
        const Editor = CodeMirror.fromTextArea(textProgram, {
            //編譯模式
            mode: "text/javascript",
            //主題
            theme: "blackboard",
            //是否要行號
            lineNumbers: true,
            //開始行號
            firstLineNumber:
                CodeMirrorFunc.swtichEditorNameToStartLineNumber(name),
            //過長自動換行
            lineWrapping: true,
            //支持代碼折疊
            foldGutter: true,
            //摺疊順序[左到右]
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            //括號匹配
            matchBrackets: true,
            //縮排單位
            indentUnit: 4,
            //tab寬度
            tabSize: 4,
            //選擇時是否顯示光標
            showCursorWhenSelecting: false,
            keyMap: "sublime",
            autoCloseTags: true,
            autohint: true,
            hintOptions: {
                completeSingle: false,
            },
            extraKeys: {
                tab: "autocomplete",
            },
            //光標接近邊緣時，上下距離
            // cursorScrollMargin: 250,
            //光標高度
            cursorHeight: name == "tutorial" ? 0 : 0.85,
            readOnly: name == isReadOnly,
        })
        Editor.on("inputRead", e => {
            Editor.showHint()
        })
        Editor.on("change", e => {
            $(".content_complete").animate(
                {
                    color: "black",
                    border: "1px solid black",
                    "font-size": "12px",
                    "font-weight": "normal",
                    opacity: "0.3",
                },
                500
            )
        })

        if (content == "") {
            switch (name) {
                case "setting":
                    Editor.setValue(`//global variable writing here\n`)
                    break
                case "config":
                    Editor.setValue(
                        "//Config writing here\n" +
                        "let config = {\n" +
                        "type: Phaser.AUTO,\n" +
                        "width: 1200,\n" +
                        "height: 800,\n" +
                        "scene: {\n" +
                        "preload: preload,\n" +
                        "create: create,\n" +
                        "update: update\n" +
                        "},\n" +
                        'parent:"container",\n' +
                        "};\n" +
                        "let game = new Phaser.Game(config);\n"
                    )
                    break
                case "custom":
                    Editor.setValue(`//all custom function writing here\n`)
                    break
                default:
                    Editor.setValue(
                        `//function ${name} writing here\nfunction ${name}(){\n\n}`
                    )
            }
        } else {
            Editor.setValue(content)
        }

        //save the Instance
        $(`#${name}`).data("CodeMirror", Editor)
    },
}
//------------------------------ Clicking Listening Function ------------------------------//
function ClickListening(e, customClick) {
    if (NormalizeFunc.getCookie("adminId")) {
        return
    }
    // /\s/g 是一個正則表達式，表示匹配所有空格字符。g 是全局匹配，會匹配到所有空格字符。
    // 把所有空格刪掉
    const courseTitle = $("#courseTitle").text().replace(/\s/g, "")

    const clickingOperationMap = new Map([
        // home page //
        ["logout", "登出"],
        ["settingDropDown", "點擊-設定"],
        ["changePassword", "開啟-修改密碼"],
        ["LS_ComfirmChangePassword", "送出-修改密碼"],
        ["LS_CancelChangePassword", "取消-修改密碼"],
        // go list class //
        ["courseTitle", "點擊-課程名稱"],
        ["studentId", "點擊-自己的ID"],
        // Start //
        ["start_launchbtn", "重新執行-任務-範例"],
        // Understanding //
        ["understandingDescription", "點擊-探索理解-標題"],
        ["understandingOperation", "點擊-探索理解-操作"],
        ["understandingLimit", "點擊-探索理解-限制"],
        // Formulating //
        ["formulatingDescription", "點擊-表徵制定-標題"],
        ["formulatingContent", "點擊-表徵制定-內容"],
        // Programming //
        ["LS_programmingLaunchDemo", "執行-計畫執行-Code"],
        ["LS_programmingHint", "打開-計畫執行-Hint"],
        ["programmingHintModal", "關閉-計畫執行-Hint"],
        ["LS_closeProgrammingModal", "關閉-計畫執行-Hint"],
        ["LS_programmingVisualizationArea", "點擊-計畫執行-檔案區"],
        ["LS_programmingVisualizationArea_up", "點擊-計畫執行-檔案區"],
        ["LS_programmingVisualizationArea_down", "點擊-計畫執行-檔案區"],
        [
            "LS_programmingVisualizationArea_indexFileIcon",
            "點擊-計畫執行-檔案區 index檔案夾"
        ],
        [
            "LS_programmingVisualizationArea_htmlIcon",
            "點擊-計畫執行-檔案區 html檔案",
        ],
        [
            "LS_programmingVisualizationArea_jsIcon",
            "點擊-計畫執行-檔案區 js檔案",
        ],
        [
            "LS_programmingVisualizationArea_fileIcon",
            "點擊-計畫執行-檔案區 file檔案",
        ],
        ["LS_programmingDemoContent_up", "打開-計畫執行-程式執行結果畫面"],
        ["LS_programmingDemoContent_down", "關閉-計畫執行-程式執行結果畫面"],
        // Reflection //
        ["LS_reflectionDescription_title", "點擊-問題反思-標題"],
        ["LS_reflectionDescription_learning", "點擊-問題反思-學到了甚麼"],
        ["LS_reflectionDescription_workhard", "點擊-問題反思-還要努力甚麼"],
        ["LS_reflectionDescription_difficult", "點擊-問題反思-遇到那些困難"],
        ["LS_reflectionDescription_scoring", "點擊-問題反思-自我評分"],
        ["scoringText", "點擊-問題反思-自我評分敘述"],
        ["learningValue", "點擊-問題反思-學到了甚麼輸入框"],
        ["workhardValue", "點擊-問題反思-還要努力甚麼輸入框"],
        ["difficultValue", "點擊-問題反思-遇到那些困難輸入框"],
        // ChatBox //
        ["chatBox_Close", "打開-聊天室"],
        ["chatBox_Open", "關閉-聊天室"],
    ])

    const time = NormalizeFunc.getNowTime("FullTime")
    //製作序列，避免點到 svg path 之類的找不到正確 id
    let operation
    let checkingMap

    //如果直接輸入值，則以輸入值為優先
    if (customClick !== undefined) {
        operation = customClick
    } else {
        // 若無則從 id 查找
        for (const PathingId of [
            e.target.id || "",
            e.target.parentNode.id || "",
            e.target.parentNode.parentNode.id || "",
            e.target.parentNode.parentNode.parentNode.id || "",
        ]) {
            const ProgrammingHintAry = PathingId.split("_")
            const ProgrammingMediaAry = PathingId.split("___")
            //Programming Hint特殊區域----------------------------------------------------
            if (ProgrammingHintAry[0] === "programmingHint") {
                operation =
                    "點擊-計畫執行-第 " +
                    (parseInt(ProgrammingHintAry[1]) + 1) +
                    " 的Hint"
            } else if (ProgrammingHintAry[0] === "programmingHintCode") {
                operation =
                    "打開-計畫執行-第 " +
                    (parseInt(ProgrammingHintAry[1]) + 1) +
                    " 個Hint的Code"
            } else if (ProgrammingMediaAry[0] === "programmingFile") {
                operation = `點擊-計畫執行-檔案之${ProgrammingMediaAry[1]}`
            } else {
                if (PathingId !== "") {
                    checkingMap = clickingOperationMap.get(PathingId)
                    // console.log(
                    //     "clicking :",
                    //     PathingId,
                    //     " ",
                    //     "Mapping: ",
                    //     checkingMap || null,
                    //     `[${courseTitle || null}]`
                    // )

                    if (checkingMap === undefined) return

                    operation = checkingMap
                }
            }

            if (PathingId !== "") break
        }
    }

    if (
        operation === "undefined[null]" ||
        operation === undefined ||
        operation === null
    )
        return

    // operation => [0]operation , [1]keyName , [2]detail

    const description = `${NormalizeFunc.getCookie("studentId")} 在 ${time} ${courseTitle} ${operation}`

    const tempOperation = operation.split("-")
    operation = tempOperation[0]

    // console.log(tempOperation)
    // 若傳入值的[1] 為 標示進入 Task 則儲存該 Task 至 sessionStorage 內
    if (tempOperation[1].split(" ")[0] == "Task") {
        sessionStorage.setItem("ListeningTask", tempOperation[1])
    }

    const task = sessionStorage.getItem("ListeningTask") || ''
    const keyName = () => {
        let keyName
        if (tempOperation[1].split(" ")[0] == "Task") {
            keyName = tempOperation[2]
        } else {
            keyName = tempOperation[1]
        }
        return keyName
    }

    const detail = () => {
        let detail
        if (keyName() === tempOperation[2]) {
            detail = ""
        } else {
            detail = tempOperation[2]
        }

        return detail
    }
    // console.table({
    //     "操作": operation,
    //     "Task": task,
    //     "keyName": keyName,
    //     "detail": detail
    // })
    // console.warn(description)

    studentClientConnect
        .listenerUpload(
            time,
            courseTitle,
            operation,
            task,
            keyName(),
            detail(),
            description
        )
        .then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                return
            }
        })
}

export { NormalizeFunc, GoListFunc, CodeMirrorFunc, ClickListening }
