import { StartBox, CommentBox, UnderstandingBox, FormulatingBox, ProgrammingBox, ReflectionBox } from "./gogrammingPage.js"

//loading Page
const loadingPage = (state) => {
    if (state) {
        $('.loadingContainer').fadeIn(200)
    } else {
        $('.loadingContainer').fadeOut(200)
    }
}

//save code sync Icon
const saveCodeStatus = (state) => {
    if (state) {
        $('.content_status').fadeIn(200)
        $('.content_complete').animate({
            'color': 'black',
            'border': '1px solid black',
            'font-size': '12px',
            'font-weight': "normal",
            'opacity': '0.3',
        }, 500)
    } else {
        $('.content_status').fadeOut(200)
        $('.content_complete').animate({
            'color': 'green',
            'border': '1px solid green',
            'font-size': '20px',
            'font-weight': "bolder",
            'opacity': '1',
        }, 500)
    }
}

//calculate maximumSizeInMegaByte
const maximumSizeInMegaByte = (megaByte) => {
    //MB -> KB -> Byte
    return megaByte * 1024 * 1024
}

//show Each Box
const showContainer = async (s) => {
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
        }, 200)
    }

    // loadingPage(true)

    //辨別任務
    //console.log(s)
    //禁止滾動
    $('body').css({
        'overflow': 'hidden',
    })
    loadingPage(true)
    
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
    switch (s.category) {
        case "Start":
            StartBox(s).appendTo(contentContainer)

            codeMirrorProgram('tutorial', '')
            $('#tutorial').data('CodeMirror').setSize(null,700)
            break;
        case "Comment":
            CommentBox(s).appendTo(contentContainer)
            break;
        case "Undestanding":
            UnderstandingBox(s).appendTo(contentContainer)
            break;
        case "Formulating":
            FormulatingBox(s).appendTo(contentContainer)
            break;
        case "Programming":
            //確認userId資料夾是否建立
            await axios({
                method: 'post',
                url: '/launch/createdemo'
            }).then(response => {
                if (response.data.status != 200) {
                    window.alert(response.data.message)
                    return
                }
            })
            //讀取該key值的Code內容
            await axios({
                method: 'post',
                url: '/student/readcode',
                data: {
                    keyCode: s.key,
                }
            }).then(response => {
                //response.data.data == code內容
                if (response.data.status != 200) {
                    window.alert(response.data.message)
                    return
                }
                // console.log(response.data)
                ProgrammingBox(s).appendTo(contentContainer)
                // create listenEvent
                listenMessageBind()
                codeMirrorProgram('setting', response.data.data.setting || '')
                codeMirrorProgram('config', response.data.data.config || '')
                codeMirrorProgram('preload', response.data.data.preload || '')
                codeMirrorProgram('create', response.data.data.create || '')
                codeMirrorProgram('update', response.data.data.update || '')
                codeMirrorProgram('custom', response.data.data.custom || '')
                saveCodeStatus(false)
            })
            loadingPage(false)
            break;
        case "Reflection":
            ReflectionBox(s).appendTo(contentContainer)
            break;
    }
}


//codeMirror Function
//轉換各組行數
const swtichEditorNameToStartLineNumber = (EditorName) => {
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
}

//初始化各個Editor
const codeMirrorProgram = (name, content) => {
    const textProgram = document.getElementById(name)
    CodeMirror.commands.autocomplete = function (cm) {
        cm.showHint({ hint: CodeMirror.hint.javascript });
    }
    const Editor = CodeMirror.fromTextArea(textProgram, {
        //編譯模式
        mode: 'javascript',
        //主題
        theme: 'blackboard',
        //行號
        lineNumbers: true,
        //開始行號
        firstLineNumber: swtichEditorNameToStartLineNumber(name),
        //過長自動換行
        lineWrapping: true,
        //支持代碼折疊
        foldGutter: true,
        //括號匹配
        matchBrackets: true,
        //縮排單位
        indentUnit: 2,
        //tab寬度
        tabSize: 2,
        //選擇時是否顯示光標
        showCursorWhenSelecting: false,
        keyMap: "sublime",
        autoCloseTags: true,
        autohint: true,
        hintOptions: {
            completeSingle: false
        },
        // extraKeys: {
        //     "Alt-Space": "autocomplete"
        // },
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



export { showContainer, swtichEditorNameToStartLineNumber, codeMirrorProgram, loadingPage, saveCodeStatus, maximumSizeInMegaByte }