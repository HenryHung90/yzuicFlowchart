import { StartBox, CommentBox, UnderstandingBox, FormulatingBox, ProgrammingBox, ReflectionBox } from "./gogrammingPage.js"

const showContainer = (s) => {
    //click close function
    const closePage = () => {
        block.fadeOut(200)
        contentDiv.fadeOut(200)
        setTimeout(() => {
            $('body').css({
                'overflow': 'auto',
            })
            contentDiv.remove()
            block.remove()
        }, 200)
    }

    //辨別任務
    //console.log(s)
    //禁止滾動
    $('body').css({
        'overflow': 'hidden',
    })
    //blocking
    const block = $('<div>').prop({
        className: 'container-fluid block',
    }).css({
        'margin-top': `calc(${window.pageYOffset}px - 20px)`
    }).click(() => {
        closePage()
    }).prependTo($('body'))

    //contentDiv
    const contentDiv = $('<div>').prop({
        className: 'container-fluid contentDiv',
    }).css({
        'margin-top': `calc(${window.pageYOffset}px + 25px)`
    }).prependTo($('body'))

    //contentContainer
    const contentContainer = $('<div>').prop({
        className: 'container-md contentContainer'
    }).appendTo(contentDiv)

    //Cancel Btn
    const content_CancelBtn = $('<div>').prop({
        className: 'content_cancel',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>'
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
    }).appendTo(contentContainer)


    //Start 任務欄
    //Comment 筆記
    //Understanding 探索理解
    //Formulating 表徵制定
    //Programming 計畫執行
    //Reflection 監控反思
    //利用 Key 值紀錄內容
    switch (s.category) {
        case "Start":
            StartBox().appendTo(contentContainer)
            break;
        case "Comment":
            CommentBox().appendTo(contentContainer)
            break;
        case "Undestanding":
            UnderstandingBox().appendTo(contentContainer)
            break;
        case "Formulating":
            FormulatingBox().appendTo(contentContainer)
            break;
        case "Programming":
            ProgrammingBox().appendTo(contentContainer)
            codeMirrorProgram('setting')
            codeMirrorProgram('config')
            codeMirrorProgram('preload')
            codeMirrorProgram('create')
            codeMirrorProgram('update')
            codeMirrorProgram('custom')
            break;
        case "Reflection":
            ReflectionBox().appendTo(contentContainer)
            break;
    }


}

const codeMirrorProgram = (name) => {
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
        cursorScrollMargin:250,
        //光標高度
        cursorHeight:0.85
    })
    Editor.on('inputRead', (e) => {
        Editor.showHint()
    })

    if (name == 'custom') {
        Editor.setValue(
            `//all custom function writing here\n`
        )
    } else if (name == 'setting') {
        Editor.setValue(
            `//global variable writing here\n`
        )
    } else if (name == 'config') {
        Editor.setValue(
            `//Config writing here
let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent:'container',
};
let game = new Phaser.Game(config);`
        )
    }
    else {
        Editor.setValue(
            `//function ${name} writing here\nfunction ${name}(){\n\n}`)
    }
    //save the Instance
    $(`#${name}`).data('CodeMirror', Editor)
}



export { showContainer, codeMirrorProgram }