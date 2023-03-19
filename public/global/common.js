import { TargetBox, StartBox, CommentBox, UnderstandingBox, FormulatingBox, ProgrammingBox, ReflectionBox } from "../js/golist/gogrammingPage.js"
import { adminTargetBox, adminStartBox, adminUnderstandingBox, adminFormulatingBox, adminProgrammingBox, adminReflectionBox } from '../js/admin/golist/gogrammingPage.js'
import { adminClientConnect, studentClientConnect } from "./axiosconnect.js"

//------------------------------ normal function ------------------------------//]
const NormalizeFunc = {
    //loading Page
    loadingPage: (state) => {
        if (state) {
            $('.loadingContainer').fadeIn(200)
        } else {
            $('.loadingContainer').fadeOut(200)
        }
    },
    //與 server 聯繫進行偵錯
    serverResponseErrorDetect: (response) => {
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
                window.alert(response.data.message || 'Error 請重新整理網頁')
                return false
            case 401:
                window.alert(response.data.message)
                NormalizeFunc.loadingPage(false)
                return false
        }
    },
    //取得 cookie值
    getCookie: (name) => {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    //取得 當前時間
    getNowTime: (type) => {
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
                return date.getYear() + "/" +
                    date.getMonth() - 1 +
                    date.getDay() + " " +
                    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        }
    },
    //取得 Front-end Code
    getFrontEndCode: (id) => {
        return $.trim($(`#${id}`).text())
    },
    //calculate maximumSizeInMegaByte
    maximumSizeInMegaByte: (Byte) => {
        //MB -> KB -> Byte
        return Byte * 1024 * 1024
    },
}
//------------------------------ category Box Function -----------------------------------//
const categoryBox = {
    Target: (data) => {
        $('.targetIframe').attr('src', `../Material/${data.message}/full/index.html`)
    },
    Start: (data, key) => {
        if (data.message === undefined) {
            CodeMirrorFunc.codeMirrorProgram('tutorial', '')
            $('#startDescription').html(`<h3>Task undefined</h3>`)
            return
        }
        // 設定 Iframe 跑的　demo
        $('#startIframe').attr('src', `../Material${data.message.material}`)
        // 設定 Target 字樣
        $('#startDescription').html(`<h3>Task ${key} : ${data.message.target}</h3>`)
        // 設定 button click 事件
        $('#start_launchbtn').click((e) => {
            $('#startIframe').attr('src', `../Material${data.message.material}`)
            $('#demoContent').addClass('startDemoFinish')
            setTimeout(e => {
                $('#demoContent').removeClass('startDemoFinish')
            }, 800)
        })
        return
    },
    Understanding: (data) => {
        if (data.message === undefined) {
            $('#understandingDescription').html(`<h3>任務目標 -</h3><h3> -- </h3>`)
            return
        }
        $('#understandingDescription').html(`<h3>任務目標 -</h3><h3>⭐${data.message.target}⭐</h3>`)

        //operation
        if (data.message.operation !== undefined) {
            data.message.operation.split('\n').forEach(operation => {
                $('<p>').prop({
                    className: 'understandingDescription_operationText',
                    innerHTML: '🕹 ' + operation
                }).appendTo($('#understandingOperation'))
            })
        }

        //limit
        if (data.message.limit !== undefined) {
            data.message.limit.split('\n').forEach(limit => {
                $('<p>').prop({
                    className: 'understandingDescription_limitText',
                    innerHTML: '⚠ ' + limit
                }).appendTo($('#understandingLimit'))
            })
        }
    },
    Formulating: (data) => {
        if (data.message === undefined) {
            return
        }
        if (data.message.content !== undefined) {
            let index = 0
            for (const { title, code, description } of data.message.content) {
                // ContentBox
                const contentBox = $('<div>').prop({
                    className: 'formulatingDescription_contentBox',
                }).appendTo($('#formulatingContent'))

                //Title
                $('<div>').prop({
                    className: 'formulatingDescription_contentTitle',
                    innerHTML: `<h4>⌨ ${title}</h4>`
                }).appendTo(contentBox)

                //Code
                $('<textarea>').prop({
                    className: 'formulatingDescription_contentCode',
                    id: `code_${index}`,
                    innerHTML: code
                }).appendTo(contentBox)

                CodeMirrorFunc.codeMirrorProgram(`code_${index}`, code)
                $(`#code_${index}`).data('CodeMirror').setSize('auto', 'auto')
                $(`#code_${index}`).data('CodeMirror').setOption('readOnly', true)
                index++

                //Description
                $('<div>').prop({
                    className: 'formulatingDescription_contentDescription',
                    innerHTML: `<p>${description}</p>`
                }).appendTo(contentBox)
            }
        }
    },
    Programming: (data, key) => {
        let codeData = [
            { name: 'setting', data: '' },
            { name: 'config', data: '' },
            { name: 'preload', data: '' },
            { name: 'create', data: '' },
            { name: 'update', data: '' },
            { name: 'custom', data: '' }
        ]
        if (data.code !== undefined) {
            codeData = [
                { name: 'setting', data: data.code.setting || '' },
                { name: 'config', data: data.code.config || '' },
                { name: 'preload', data: data.code.preload || '' },
                { name: 'create', data: data.code.create || '' },
                { name: 'update', data: data.code.update || '' },
                { name: 'custom', data: data.code.custom || '' }
            ]
        }


        for (const CodeMirror of codeData) {
            CodeMirrorFunc.codeMirrorProgram(CodeMirror.name, CodeMirror.data)
            $(`#${CodeMirror.name}`).data('CodeMirror').setSize('auto', 'auto')
        }

        //hint
        if (data.hint !== undefined) {
            data.hint.split('\n').forEach((hint, index) => {
                if (index !== 0) {
                    $('<div>').prop({
                        className: 'programmingDescription_hintArrow',
                        innerHTML: '<img src="../media/img/arrow.gif" width="50px" height="50px" style="transform:rotate(90deg)"></img>'
                    }).appendTo($('#programmingHint'))
                }

                $('<div>').prop({
                    className: 'programmingDescription_hintText',
                    innerHTML: `<p>👊step ${index + 1}</p>` + hint,
                    id: index
                }).attr({
                    'data-bs-toggle': "tooltip",
                    'data-bs-placement': 'right',
                    'data-container': "body",
                    'data-bs-html': "true",
                    'name': 'hint',
                    'title': '<h3>程式碼參考</h3>若無顯示請重新點擊'
                }).appendTo($('#programmingHint'))
            })
        }

        //初始化 boostrap Tooltip
        $('[data-bs-toggle="tooltip"]').tooltip({
            trigger: 'click'
        });

        //點擊時將其他 tooltip 關閉
        $('[data-bs-toggle="tooltip"]').click(function () {
            if ($(this).attr('name') === 'hint') {
                $('[data-bs-toggle="tooltip"]').not(this).tooltip("hide");
            }
        })
        // $('[data-bs-toggle="tooltip"]').on('show.bs.tooltip', function () {

        // })
        $('[data-bs-toggle="tooltip"]').on('shown.bs.tooltip', function () {
            if ($(this).attr('name') === 'hint') {
                $('<textarea>').prop({
                    id: 'hint'
                }).css({
                    'resize': 'none'
                }).appendTo($(".tooltip-inner"))

                if (data.hintCode !== undefined) {
                    CodeMirrorFunc.codeMirrorProgram('hint', data.hintCode[$(this).attr('id')] || 'no data')
                } else {
                    CodeMirrorFunc.codeMirrorProgram('hint', 'no data')
                }
                $('#hint').data('CodeMirror').setSize('auto', 'auto')
            }
        });
    },
    Reflection: (data) => {
        if (data == undefined) {
            return
        }
        console.log(data)

        $('#learningValue').val(data.learing)
        $('#workhardValue').val(data.workhard)
        $('#difficultValue').val(data.difficult)
        $('#scoringValue').val(data.scoring)

        switch (data.scoring) {
            case '0':
                $('#scoringText').html('<p>0分，我完全不滿意我的表現，好爛!</p>')
                break
            case '1':
                $('#scoringText').html('<p>1分，我甚麼都不會😢</p>')
                break
            case '2':
                $('#scoringText').html('<p>2分，我的人生怎麼會遇到這種難題😵</p>')
                break
            case '3':
                $('#scoringText').html('<p>3分，我的程式碼跟我的人生一樣，只有一半成功，另一半還在Debug。</p>')
                break
            case '4':
                $('#scoringText').html('<p>4分，感覺有了，但不多</p>')
                break
            case '5':
                $('#scoringText').html('<p>5分，中規中矩🤏</p>')
                break
            case '6':
                $('#scoringText').html('<p>6分，只要程式碼會跑，再亂都沒問題👌</p>')
                break
            case '7':
                $('#scoringText').html('<p>7分，只要程式碼夠亂，就沒有人能抄襲😎</p>')
                break
            case '8':
                $('#scoringText').html('<p>8分，程式碼有沒有問題不重要，能用就好</p>')
                break
            case '9':
                $('#scoringText').html('<p>9分，這個世界上只有我搞不定的女生，沒有我搞不定的程式碼🤙🤙</p>')
                break
            case '10':
                $('#scoringText').html('<p>10分，我的程式碼都是 ChatGPT 教我的，呵😎🤏</p>')
                break
        }
    }
}
//------------------------------ Go.js Function -----------------------------------//
const GoListFunc = {
    saveCodeStatus: (state) => {
        if (state) {
            $('.content_status').fadeIn(200)
            $('.content_complete').animate({
                'color': 'black',
                'border': '1px solid black',
                'font-size': '12px',
                'font-weight': "normal",
                'opacity': '0.3',
            }, 200)
        } else {
            $('.content_status').fadeOut(200)
            $('.content_complete').animate({
                'color': 'green',
                'border': '1px solid green',
                'font-size': '20px',
                'font-weight': "bolder",
                'opacity': '1',
            }, 200)
        }
    },
    //show Each Box
    showContainer: async (s, id) => {
        //取得 Iframe 發出之 Error 警訊
        const reciveMessage = (e) => {
            e.preventDefault()
            const sendPort = e.origin
            const sendMessage = e.data.data.arguments.join()
            const sendStatus = e.data.data.function
            // console.log(e.data.data.function)
            if (sendPort == "http://localhost:3000") {
                let logger = document.getElementById('testingCode');
                if (sendStatus == 'log') {
                    logger.innerHTML += '<div class="consoleErrorArea_logCode">' + sendMessage + '</div>';
                } else if (sendStatus == 'error') {
                    logger.innerHTML += '<div class="consoleErrorArea_errorCode">' + sendMessage + '</div>';
                }
            }
        }
        //listen Message from iframe
        const listenMessageBind = () => {
            window.addEventListener('message', reciveMessage, false)
        }
        const listenMessageUnbind = () => {
            window.removeEventListener('message', reciveMessage, false)
        }
        //click close function
        const closePage = () => {
            block.fadeOut(200)
            contentDiv.fadeOut(200)
            //iframe
            $('.DemoDiv').fadeOut(200)
            $('.content_dataVisualizationArea').fadeOut(200)
            $('.content_consoleErrorArea').fadeOut(200)
            //unbind listenEvent
            listenMessageUnbind()
            setTimeout(() => {
                $('body').css({
                    'overflow': 'auto',
                })
                contentDiv.remove()
                block.remove()
                //iframe
                $('.DemoDiv').remove()
                $('.content_consoleErrorArea').remove()
                $('.content_dataVisualizationArea').remove()
                //Programming modal
                $('.modal').remove()
            }, 200)
        }

        // loadingPage(true)

        //辨別任務
        //console.log(s)
        //禁止滾動
        $('body').css({
            'overflow': 'hidden',
        })
        NormalizeFunc.loadingPage(true)

        //blocking
        const block = $('<div>').prop({
            className: 'container-fluid block',
        }).css({
            'margin-top': `calc(${window.pageYOffset}px - 15px)`
        }).click(() => {
            closePage()
        }).prependTo($('body'))

        //contentDiv
        const contentDiv = $('<div>').prop({
            className: 'container-fluid contentDiv',
        }).css({
            'margin-top': `calc(${window.pageYOffset}px + 15px)`
        }).prependTo($('body'))

        //contentContainer
        const contentContainer = $('<div>').prop({
            className: 'container-md contentContainer'
        }).appendTo(contentDiv)


        //------------------------------------------------
        //contentContainer Btn Area
        const content_iconContainer = $('<div>').prop({
            className: 'row justify-content-start'
        }).appendTo(contentContainer)
        //Cancel Btn
        const content_CancelBtn = $('<div>').prop({
            className: 'col-1 content_cancel',
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>'
        }).hover((e) => {
            content_CancelBtn.css({
                'transition-duration': '0.3s',
                'background-color': 'rgba(0,0,0,0.2)',
                'border-radius': '20px',
            })
        }, (e) => {
            content_CancelBtn.css({
                'transition-duration': '0.3s',
                'background-color': 'transparent',
                'border-radius': '0',
            })
        }).click((e) => {
            closePage()
        }).appendTo(content_iconContainer)
        //------------------------------------------------
        //complete Icon
        $('<div>').prop({
            className: 'col-1 content_complete',
            innerHTML: 'Sync'
        }).appendTo(content_iconContainer)
        //status Icon
        $('<div>').prop({
            className: 'col-2 content_status',
            innerHTML: '<svg id="content_status_icon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/></svg>' +
                ' Save code...'
        }).appendTo(content_iconContainer)

        //Start 任務欄
        //Comment 筆記
        //Understanding 探索理解
        //Formulating 表徵制定
        //Programming 計畫執行
        //Reflection 監控反思
        //利用 Key 值紀錄內容
        // console.log(s)

        if (id === 'admin') {
            switch (s.category) {

            }
        } else {
            switch (s.category) {
                case "Target":
                    TargetBox().appendTo(contentContainer)

                    await studentClientConnect.getMaterial(NormalizeFunc.getFrontEndCode('courseId')).then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            categoryBox.Target(response.data)
                            NormalizeFunc.loadingPage(false)
                        }
                    })
                    break

                case "Start":
                    StartBox().appendTo(contentContainer)

                    await studentClientConnect.getStarting(NormalizeFunc.getFrontEndCode('courseId'), s.key).then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            categoryBox.Start(response.data, s.key)
                            NormalizeFunc.loadingPage(false)
                        }
                    })
                    break;

                case "Understanding":
                    UnderstandingBox().appendTo(contentContainer)

                    await studentClientConnect.getUnderstanding(NormalizeFunc.getFrontEndCode('courseId'), s.key).then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            categoryBox.Understanding(response.data)
                            NormalizeFunc.loadingPage(false)
                        }
                    })
                    break;

                case "Formulating":
                    FormulatingBox(s).appendTo(contentContainer)

                    await studentClientConnect.getFormulating(NormalizeFunc.getFrontEndCode('courseId'), s.key).then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            categoryBox.Formulating(response.data)
                            NormalizeFunc.loadingPage(false)
                        }
                    })
                    break;

                case "Programming":
                    ProgrammingBox(s).appendTo(contentContainer)

                    //確認userId資料夾是否建立
                    await studentClientConnect.createDemo().then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            //讀取該key值的Code內容
                            studentClientConnect.readCode(NormalizeFunc.getFrontEndCode('courseId'), s.key).then(response => {
                                if (NormalizeFunc.serverResponseErrorDetect(response)) {
                                    // listenMessageBind()
                                    categoryBox.Programming(response.data, s.key)
                                    GoListFunc.saveCodeStatus(false)
                                    NormalizeFunc.loadingPage(false)
                                }
                            })
                        }
                    })
                    break;

                case "Reflection":
                    ReflectionBox(s).appendTo(contentContainer)

                    //讀取 reflection 內容
                    await studentClientConnect.readReflection(NormalizeFunc.getFrontEndCode('courseId'), s.key).then(response => {
                        if (NormalizeFunc.serverResponseErrorDetect(response)) {
                            categoryBox.Reflection(response.data.message)
                            NormalizeFunc.loadingPage(false)
                        }
                    })
                    break;

                case "Comment":
                    CommentBox(s).appendTo(contentContainer)
                    NormalizeFunc.loadingPage(false)
                    break;
            }
        }
    },
}
//------------------------------ codeMirror Function ------------------------------//
const CodeMirrorFunc = {
    //轉換各組行數
    swtichEditorNameToStartLineNumber: (EditorName) => {
        switch (EditorName) {
            case "setting":
                return 2
            case "config":
                return $("#setting").data('CodeMirror').lineCount() + 3
            case 'preload':
                return (
                    $("#setting").data('CodeMirror').lineCount() +
                    $("#config").data('CodeMirror').lineCount() + 4
                )
            case 'create':
                return (
                    $("#setting").data('CodeMirror').lineCount() +
                    $("#config").data('CodeMirror').lineCount() +
                    $("#preload").data('CodeMirror').lineCount() +
                    5
                )
            case 'update':
                return (
                    $("#setting").data('CodeMirror').lineCount() +
                    $("#config").data('CodeMirror').lineCount() +
                    $("#preload").data('CodeMirror').lineCount() +
                    $("#create").data('CodeMirror').lineCount() +
                    6
                )
            case 'custom':
                return (
                    $("#setting").data('CodeMirror').lineCount() +
                    $("#config").data('CodeMirror').lineCount() +
                    $("#preload").data('CodeMirror').lineCount() +
                    $("#create").data('CodeMirror').lineCount() +
                    $("#update").data('CodeMirror').lineCount() +
                    7
                )
            default:
                return 0
        }
    },
    //初始化各個Editor
    codeMirrorProgram: (name, content) => {
        const textProgram = document.getElementById(name)
        CodeMirror.commands.autocomplete = function (cm) {
            cm.showHint({ hint: CodeMirror.hint.javascript });
        }
        const Editor = CodeMirror.fromTextArea(textProgram, {
            //編譯模式
            mode: 'text/javascript',
            //主題
            theme: 'blackboard',
            //是否要行號
            lineNumbers: true,
            //開始行號
            firstLineNumber: CodeMirrorFunc.swtichEditorNameToStartLineNumber(name),
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
                completeSingle: false
            },
            extraKeys: {
                "tab": "autocomplete",
            },
            //光標接近邊緣時，上下距離
            // cursorScrollMargin: 250,
            //光標高度
            cursorHeight: name == 'tutorial' ? 0 : 0.85,
            readOnly: name == 'tutorial' ? true : false
        })
        Editor.on('inputRead', (e) => {
            Editor.showHint()
        })
        Editor.on('change', (e) => {
            $('.content_complete').animate({
                'color': 'black',
                'border': '1px solid black',
                'font-size': '12px',
                'font-weight': "normal",
                'opacity': '0.3',
            }, 500)
        })

        if (content == '') {
            switch (name) {
                case 'setting':
                    Editor.setValue(
                        `//global variable writing here\n`)
                    break
                case 'config':
                    Editor.setValue(
                        '//Config writing here\n' +
                        'let config = {\n' +
                        'type: Phaser.AUTO,\n' +
                        'width: 1200,\n' +
                        'height: 800,\n' +
                        'scene: {\n' +
                        'preload: preload,\n' +
                        'create: create,\n' +
                        'update: update\n' +
                        '},\n' +
                        'parent:"container",\n' +
                        '};\n' +
                        'let game = new Phaser.Game(config);\n'
                    )
                    break
                case 'custom':
                    Editor.setValue(
                        `//all custom function writing here\n`
                    )
                    break
                default:
                    Editor.setValue(
                        `//function ${name} writing here\nfunction ${name}(){\n\n}`)
            }
        } else {
            Editor.setValue(content)
        }

        //save the Instance
        $(`#${name}`).data('CodeMirror', Editor)
    }
}


export {
    NormalizeFunc,
    GoListFunc,
    CodeMirrorFunc
}