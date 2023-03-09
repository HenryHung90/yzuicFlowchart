import {
    NormalizeFunc,
    CodeMirrorFunc,
    GoListFunc
} from "../../global/common.js"
import { studentClientConnect } from "../../global/axiosconnect.js"
//Target 顯示最終成品的Block
const TargetBox = () => {
    // 把 Sync 字樣刪除
    $('.content_complete').remove()
    //Content Div-------------------------------------------------
    const contentDiv = $('<div>').prop({
        className: 'justify-content-center TargetContentDiv'
    })

    $('<iframe>').prop({
        className: 'container-fluid targetIframe',
    }).appendTo(contentDiv)


    return contentDiv
}
//StartBox return function
const StartBox = () => {
    // 把 Sync 字樣刪除
    $('.content_complete').remove()

    const startBoxContainer = $('<div>').prop({
        className: 'row justify-content-start startBoxContainer'
    })

    //start description
    const startDescriptionContainer = $('<div>').prop({
        className: 'row startDescription_container',
    }).appendTo($('.contentContainer'))

    //descriptions
    $('<div>').prop({
        className: 'col-10 startDescription_description',
        id: 'startDescription'
    }).appendTo(startDescriptionContainer)

    //play button
    //launch
    $('<button>').prop({
        className: 'col-2 btn btn-success content_launchbtn',
        id: 'start_launchbtn',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="20px" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>'
    }).appendTo(startDescriptionContainer)

    //container
    const content_codingContainer = $('<div>').prop({
        className: 'col-12 codeTutorial_container'
    }).appendTo(startBoxContainer)

    $('<iframe>')
        .prop({
            className: 'col-12',
            id: 'startIframe',
        })
        .css({
            'width': '100%',
            'height': '95%',
            'margin': '0 auto',
            'margin-top': '5px',
            'border': '1px dashed black',
            'border-radius': '20px',
        })
        .appendTo(content_codingContainer)


    NormalizeFunc.loadingPage(false)
    return startBoxContainer
}
//CommentBox return function
const CommentBox = () => {
    // 把 Sync 字樣刪除
    $('.content_complete').remove()
    //Content Div-------------------------------------------------
    const contentDiv = $('<div>').prop({
        className: 'justify-content-center commentContentDiv'
    })

    //contentTitle
    $('<div>').prop({
        className: 'form-floating content_Title',
        innerHTML: '<input type="text" class="form-control" id="contentTitle" placeholder="輸入你的標題">' +
            '<label for="floatingInput">筆記標題</label>'
    }).appendTo(contentDiv)
    //BtnDiv
    const contentBoxBtnDiv = $('<div>').prop({
        className: 'container-fluid content_BtnDiv'
    }).appendTo(contentDiv)
    //Btn
    const createTxtBtn = $('<div>').prop({
        className: 'content_Btn',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" id="txtBtn" height="50px" width="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"/></svg>'
    }).hover((e) => {
        createTxtBtn.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(0,0,0,0.2)',
            'border-radius': '20px',
            'height': '60px',
            'width': '60px',
            'margin-top': '0',
            'margin-left': '0',
        })
        $('#txtBtn').css({
            'transition-duration': '0.3s',
            'height': '60px',
            'width': '60px',
        })
    }, (e) => {
        createTxtBtn.css({
            'transition-duration': '0.3s',
            'background-color': 'transparent',
            'border-radius': '0',
            'height': '50px',
            'width': '50px',
        })
        $('#txtBtn').css({
            'transition-duration': '0.3s',
            'height': '50px',
            'width': '50px',
        })
    }).click(() => {
        createTxtContent()
    }).appendTo(contentBoxBtnDiv)

    const createCodeBtn = $('<div>').prop({
        className: 'content_Btn',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" id="codeBtn" height="50px" width="50px" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"/></svg>'
    }).hover((e) => {
        createCodeBtn.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(0,0,0,0.2)',
            'border-radius': '20px',
            'height': '60px',
            'width': '60px',
            'margin-top': '0',
            'margin-left': '0',
        })
        $('#codeBtn').css({
            'transition-duration': '0.3s',
            'height': '60px',
            'width': '60px',
        })
    }, (e) => {
        createCodeBtn.css({
            'transition-duration': '0.3s',
            'background-color': 'transparent',
            'border-radius': '0',
            'height': '50px',
            'width': '50px',
        })
        $('#codeBtn').css({
            'transition-duration': '0.3s',
            'height': '50px',
            'width': '50px',
        })
    }).click(() => {
        createCodeContent()
    }).appendTo(contentBoxBtnDiv)

    //Comment Container
    const contentContainer = $("<div>").prop({
        className: 'justify-content-center CommentContainer'
    }).appendTo(contentDiv)

    //CreateTxtContent function
    const createTxtContent = () => {
        const txtContentContainer = $('<div>').prop({
            className: 'row justify-content-center txtContentContainer',
        })

        const slideBar = $('<div>').prop({
            className: 'col-1 txtContent_slideBar',
            innerHTML: `<svg viewBox="0 0 64 200">
	<rect height="8" width="8" y="14" x="16" />
	<rect height="8" width="8" y="30" x="16" />
	<rect height="8" width="8" y="46" x="16" />
	<rect height="8" width="8" y="62" x="16" />
	<rect height="8" width="8" y="14" x="32" />
	<rect height="8" width="8" y="30" x="32" />
	<rect height="8" width="8" y="46" x="32" />
	<rect height="8" width="8" y="62" x="32" />
</svg> `
        })
            .hover((e) => {
                slideBar.css({
                    'opacity': '1',
                })
            }, (e) => {
                slideBar.css({
                    'opacity': '0.5',
                })
            })
            .appendTo(txtContentContainer)
        const txtContent = $('<textarea>').prop({
            className: 'col-11 txtContent_content'
        }).appendTo(txtContentContainer)

        contentContainer.append(txtContentContainer)
    }

    //CreateCodeContent function
    const createCodeContent = () => {
        const codeContentContainer = $('<div>').prop({
            className: 'row justify-content-center codeContentContainer',
        })
        const slideBar = $('<div>').prop({
            className: 'col-1 txtContent_slideBar',
            innerHTML: `<svg viewBox="0 0 64 200">
	<rect height="8" width="8" y="14" x="16" />
	<rect height="8" width="8" y="30" x="16" />
	<rect height="8" width="8" y="46" x="16" />
	<rect height="8" width="8" y="62" x="16" />
	<rect height="8" width="8" y="14" x="32" />
	<rect height="8" width="8" y="30" x="32" />
	<rect height="8" width="8" y="46" x="32" />
	<rect height="8" width="8" y="62" x="32" />
</svg> `
        })
            .hover((e) => {
                slideBar.css({
                    'opacity': '1',
                })
            }, (e) => {
                slideBar.css({
                    'opacity': '0.5',
                })
            })
            .appendTo(codeContentContainer)

        const codeContentId = `codeContent_${$('.CommentContainer').find('.codeContentContainer').length}`

        const codeContentDiv = $('<div>').prop({
            className: 'col-11 codeContent_content'
        }).appendTo(codeContentContainer)

        $('<textarea>').prop({
            id: codeContentId,
        }).appendTo(codeContentDiv)

        contentContainer.append(codeContentContainer)
        //codeMirror append to codeContent
        CodeMirrorFunc.codeMirrorProgram(codeContentId, '//write your comment code here')
        $(`#${codeContentId}`).data('CodeMirror').setSize(null, 200)
    }

    return contentDiv
}
//UnderstandingBox return function
const UnderstandingBox = () => {
    // 把 Sync 字樣刪除
    $('.content_complete').remove()
    //Content Div-------------------------------------------------
    const contentDiv = $('<div>').prop({
        className: 'justify-content-center UnderstandingContentDiv'
    })

    //using Model 互動視窗 from boostrap----------------------------------
    const modal = $('<div>').prop({
        className: "modal fade",
        id: 'understandingHintModal',
        tabindex: "-1",
    }).attr('aria-labelledby', "understandingHintModal").attr('aria-hidden', "true").prependTo($('body'))

    const modalContainer = $('<div>').prop({
        className: 'modal-dialog modal-dialog-centered'
    }).appendTo(modal)

    const modalContent = $('<div>').prop({
        className: 'modal-content'
    }).appendTo(modalContainer)

    //header
    $('<div>').prop({
        className: 'modal-header',
        innerHTML: '<h3>流程圖</h3>'
    }).appendTo(modalContent)

    //body
    $('<div>').prop({
        className: 'modal-body',
        id: 'understandingHint',
    }).appendTo(modalContent)

    //footer
    $('<div>').prop({
        className: 'modal-footer',
        innerHTML: ' <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>'
    }).appendTo(modalContent)
    //----------------------------------------------------------


    //understanding description
    const understandingDescriptionContainer = $('<div>').prop({
        className: 'row understandingDescription_container',
    }).appendTo(contentDiv)

    //descriptions
    $('<div>').prop({
        className: 'col-10 understandingDescription_target',
        id: 'understandingDescription'
    }).appendTo(understandingDescriptionContainer)


    //question button
    $('<button>').prop({
        className: 'col-2 btn btn-outline-primary understandingDescription_targetHint',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="50px" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM105.8 229.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L216 328.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V314.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H158.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM160 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
        id: 'understandingHint',
    }).attr('data-bs-toggle', 'modal').attr('data-bs-target', "#understandingHintModal").appendTo(understandingDescriptionContainer)

    //operation
    $('<div>').prop({
        className: 'col-12 understandingDescription_operation',
        id: 'understandingOperation',
        innerHTML: '<h4>操作</h4>'
    }).appendTo(understandingDescriptionContainer)

    //limit
    $('<div>').prop({
        className: 'col-12 understandingDescription_limit',
        id: 'understandingLimit',
        innerHTML: '<h4>限制</h4>'
    }).appendTo(understandingDescriptionContainer)


    return contentDiv
}
//FormulatingBox return function
const FormulatingBox = () => {
    // 把 Sync 字樣刪除
    $('.content_complete').remove()
    //Content Div-------------------------------------------------
    const contentDiv = $('<div>').prop({
        className: 'justify-content-center FormulatingContentDiv'
    })


    // //using Model 互動視窗 from boostrap----------------------------------
    // const modal = $('<div>').prop({
    //     className: "modal fade",
    //     id: 'formulatingHintModal',
    //     tabindex: "-1",
    // }).attr('aria-labelledby', "formulatingHintModal").attr('aria-hidden', "true").prependTo($('body'))

    // const modalContainer = $('<div>').prop({
    //     className: 'modal-dialog modal-dialog-centered'
    // }).appendTo(modal)

    // const modalContent = $('<div>').prop({
    //     className: 'modal-content'
    // }).appendTo(modalContainer)

    // //header
    // $('<div>').prop({
    //     className: 'modal-header',
    //     innerHTML: '<h3>流程圖</h3>'
    // }).appendTo(modalContent)

    // //body
    // $('<div>').prop({
    //     className: 'modal-body',
    //     id: 'formulatingHint',
    // }).appendTo(modalContent)

    // //footer
    // $('<div>').prop({
    //     className: 'modal-footer',
    //     innerHTML: ' <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>'
    // }).appendTo(modalContent)
    // //----------------------------------------------------------


    //formulating description
    const formulatingDescriptionContainer = $('<div>').prop({
        className: 'row formulatingDescription_container',
    }).appendTo(contentDiv)

    //descriptions
    $('<div>').prop({
        className: 'col-10 formulatingDescription_target',
        id: 'formulatingDescription',
        innerHTML: '<h3>語法的使用與制定</h3>'
    }).appendTo(formulatingDescriptionContainer)


    // //question button
    // $('<button>').prop({
    //     className: 'col-2 btn btn-outline-primary formulatingDescription_targetHint',
    //     innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="50px" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM105.8 229.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L216 328.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V314.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H158.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM160 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
    //     id: 'formulatingHint',
    // }).attr('data-bs-toggle', 'modal').attr('data-bs-target', "#formulatingHintModal").appendTo(formulatingDescriptionContainer)


    $('<div>').prop({
        className: 'col-12 formulatingDescription_content',
        id: 'formulatingContent'
    }).appendTo(formulatingDescriptionContainer)

    return contentDiv
}
//Programming return function
const ProgrammingBox = (programmingKey) => {
    //Content Row 分行器
    const contentRowDiv = $('<div>').prop({
        className: 'row justify-content-left contentColDiv',
    })

    //Coding Div----------------------------------------------------
    const content_CodingDiv = $('<div>').prop({
        className: 'col-11 content_codingdiv'
    }).appendTo(contentRowDiv)

    //Coding 分層
    const content_codingContainer = [
        {
            title: 'Setting',
            container: 'content_coding_settingContainer',
            id: 'setting'
        },
        {
            title: 'Config',
            container: 'content_coding_configContainer',
            id: 'config'
        },
        {
            title: 'Preload',
            container: 'content_coding_preloadContainer',
            id: 'preload'
        },
        {
            title: 'Create',
            container: 'content_coding_createContainer',
            id: 'create'
        },
        {
            title: 'Update',
            container: 'content_coding_updateContainer',
            id: 'update'
        },
        {
            title: 'Custom',
            container: 'content_coding_customContainer',
            id: 'custom'
        }
    ]
    //render coding Area
    for (let codingType of content_codingContainer) {
        //title
        $("<h3>").prop({
            className: 'function_title',
            innerHTML: codingType.title
        }).appendTo(content_CodingDiv)
        const content_CodingSettingContainer = $('<div>').prop({
            className: `container-sm ${codingType.container}`,
        }).appendTo(content_CodingDiv)
        //textarea
        $('<textarea>').prop({
            className: 'form-control',
            id: codingType.id
        }).appendTo(content_CodingSettingContainer)
    }
    //--------------------------------------------------------------
    //Button area
    const content_LaunchDiv = $('<div>').prop({
        className: 'col-1 content_launchbtndiv'
    }).appendTo(contentRowDiv)

    //launch
    $('<button>').prop({
        className: 'btn btn-success content_launchbtn',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="20px" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>'
    }).click((e) => {
        launchDemo()
    }).appendTo(content_LaunchDiv)

    //save code
    $('<button>').prop({
        className: 'btn btn-outline-primary content_launchbtn',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="20px" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 416c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>'
    }).click((e) => {
        saveCode()
    }).appendTo(content_LaunchDiv)
    //Save Btn
    $('.contentDiv').keydown((e) => {
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault()
            saveCode()
        }
        if (e.metaKey && e.keyCode == 83) {
            e.preventDefault()
            saveCode()
        }
    })

    $('<input>').prop({
        className: 'uploadfileInput',
        type: 'file',
        accept: 'image/png, image/jpeg, image/jpg'
    }).css({
        'display': 'none'
    }).change((e) => {
        uploadFile(e.target.files)
    }).appendTo(content_LaunchDiv)
    //upload file
    $('<button>').prop({
        className: 'btn btn-outline-primary content_lanchbtn',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="20px" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z"/></svg>'
    }).click((e) => {
        uploadFileClick()
    }).appendTo(content_LaunchDiv)

    //-----------------------------------------------------------------------
    //Data Visualization Area
    const dataVisualizationArea = $('<div>').prop({
        className: 'justify-content-center content_dataVisualizationArea'
    }).prependTo($('body'))

    const dataVisualization_container = $('<div>').prop({
        className: 'row dataVisualizationArea_container'
    }).hover(
        (e) => {
            dataVisualizationArea_upIcon.css({
                'transform': 'rotate(180deg)'
            })
        }, (e) => {
            dataVisualizationArea_upIcon.css({
                'margin-top': '5px',
                'transform': 'rotate(0deg)'
            })
        }).appendTo(dataVisualizationArea)

    //upIcon
    const dataVisualizationArea_upIcon = $('<div>').prop({
        className: 'col-12 dataVisualizationArea_upIcon',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="20px" viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>'
    }).appendTo(dataVisualization_container)

    //fileDisk
    const dataVisualizationArea_filedisk = $('<div>').prop({
        className: 'col-2 dataVisualizationArea_filedisk',
    }).appendTo(dataVisualization_container)

    const dataVisualizationArea_showing = $('<div>').prop({
        className: 'col-10 dataVisualizationArea_showing'
    }).appendTo(dataVisualization_container)


    ////html icon
    $('<div>').prop({
        className: 'dataVisualizationArea_filedisk_icon',
        innerHTML:
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="50px" viewBox="0 0 384 512"><path d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/></svg>' +
            '<p>phaserView.html</p>'
    }).click((e) => {
        dataVisualizationArea_showing.empty()
        dataVisualizationArea_showing.append(dataHtml())
    }).appendTo(dataVisualizationArea_filedisk)
    ////js icon
    $('<div>').prop({
        className: 'dataVisualizationArea_filedisk_icon',
        innerHTML:
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="50px" viewBox="0 0 448 512"><path d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"/></svg>' +
            '<p>phaserScript.js</p>'
    }).click((e) => {
        dataVisualizationArea_showing.empty()
        dataVisualizationArea_showing.append(dataJs())
    }).appendTo(dataVisualizationArea_filedisk)
    ////media folder icon
    $('<div>').prop({
        className: 'dataVisualizationArea_filedisk_icon',
        innerHTML:
            '<svg xmlns="http://www.w3.org/2000/svg"  width="100%" height="50px" viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H298.5c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/></svg>' +
            '<p>media</p>'
    }).click((e) => {
        dataVisualizationArea_showing.empty()
        dataVisualizationArea_showing.append(dataMedia())
    }).appendTo(dataVisualizationArea_filedisk)
    //-----------------------------------------------------------------------
    //console error area
    const consoleErrorArea = $('<div>').prop({
        className: 'justify-content-center content_consoleErrorArea'
    }).prependTo($('body'))

    const consoleError_container = $('<div>').prop({
        className: 'row consoleErrorArea_container'
    }).hover(
        (e) => {
            consoleErrorArea_leftIcon.css({
                'transform': 'rotate(180deg)'
            })
        }, (e) => {
            consoleErrorArea_leftIcon.css({
                'transform': 'rotate(0deg)'
            })
        }).appendTo(consoleErrorArea)

    //leftIcon
    const consoleErrorArea_leftIcon = $('<div>').prop({
        className: 'col-1 consoleErrorArea_leftIcon',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg);" width="100%" height="100%" viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>'
    }).appendTo(consoleError_container)
    //errorText
    $('<div>').prop({
        className: 'col-11 consoleErrorArea_errorText',
        id: 'testingCode'
    }).appendTo(consoleError_container)
    //--------------------------------------------------------------
    //Launch demo function
    const launchDemo = async () => {
        NormalizeFunc.loadingPage(true)
        //取得各階段程式碼
        const settingCode = $("#setting").data('CodeMirror')
        const configCode = $('#config').data('CodeMirror')
        const preloadCode = $("#preload").data('CodeMirror')
        const createCode = $('#create').data('CodeMirror')
        const updateCode = $('#update').data('CodeMirror')
        const customCode = $("#custom").data('CodeMirror')

        //重整Code Line 以便查詢錯誤位置
        for (let name of ['setting', 'config', 'preload', 'create', 'update', 'custom']) {
            $(`#${name}`)
                .data('CodeMirror')
                .setOption('firstLineNumber', CodeMirrorFunc.swtichEditorNameToStartLineNumber(name));
        }

        await studentClientConnect.launchDemo(
            settingCode.getValue(),
            configCode.getValue(),
            preloadCode.getValue(),
            createCode.getValue(),
            updateCode.getValue(),
            customCode.getValue()
        ).then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                return response.data.message
            }
        }).then(async response => {
            if (!response) {
                return
            }
            if ($('.DemoDiv').length == 0) {
                const demoDiv = $('<div>').prop({
                    className: 'container-fluid DemoDiv',
                }).prependTo($('body'))

                const demoIframe = $('<div>').prop({
                    className: 'row justify-content-start iframeContainer'
                }).appendTo(demoDiv)

                const demoContent = $('<div>').prop({
                    className: 'col-12 demoContent',
                    id: 'demoContent',
                }).appendTo(demoIframe)

                const demoIframeInfo = $('<iframe>')
                    .prop({
                        className: 'col-12',
                        id: 'demoIframe',
                        src: `../access/${document.cookie.split("; ")[1].split("=")[1]}/${response}/${response}.html`,
                        sandBox: "allow-scripts"
                        //document.cookie.split("; ")[1].split("=")[1]
                        //cookie 0 token , cookie 1 studentId
                    })
                    .css({
                        'width': '100%',
                        'height': '95%',
                        'margin': '0 auto',
                        'margin-top': '5px',
                        'border': '1px dashed black',
                        'border-radius': '20px'
                    })
                    .appendTo(demoContent)

                demoIframeInfo.on('load', (e) => {
                    e.preventDefault()
                    NormalizeFunc.loadingPage(false)
                    $('.demoContent').addClass('demoFinish')
                    setTimeout((e) => {
                        $('.demoContent').removeClass('demoFinish')
                    }, 1000)
                })
                //DownIcon
                $('<div>').prop({
                    className: 'col-1 offset-md-5 downIcon',
                    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="20px" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>',
                }).appendTo(demoContent)
            } else {
                $('#demoIframe').attr('src', `../access/${document.cookie.split("; ")[1].split("=")[1]}/${response}/${response}.html`)
                $('#demoIframe').on('load', (e) => {
                    e.preventDefault()
                    NormalizeFunc.loadingPage(false)
                    $('.demoContent').addClass('demoFinish')
                    setTimeout((e) => {
                        $('.demoContent').removeClass('demoFinish')
                    }, 1000)
                })
            }
        })
    }

    //save code function
    const saveCode = async () => {
        GoListFunc.saveCodeStatus(true)
        //取得各階段程式碼
        const settingCode = $("#setting").data('CodeMirror')
        const configCode = $('#config').data('CodeMirror')
        const preloadCode = $("#preload").data('CodeMirror')
        const createCode = $('#create').data('CodeMirror')
        const updateCode = $('#update').data('CodeMirror')
        const customCode = $("#custom").data('CodeMirror')

        const keyCode = programmingKey.key
        await studentClientConnect.saveCode(
            settingCode.getValue(),
            configCode.getValue(),
            preloadCode.getValue(),
            createCode.getValue(),
            updateCode.getValue(),
            customCode.getValue(),
            keyCode
        ).then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                GoListFunc.saveCodeStatus(false)
            }
        })
    }

    //upload flie & click function
    //click
    const uploadFileClick = async () => {
        //模擬Click隱藏之Input
        return $('.uploadfileInput').click()
    }
    //upload
    const uploadFile = async (files) => {
        NormalizeFunc.loadingPage(true)
        let uploadFile = new FormData()

        for (let file of files) {
            const extension = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLowerCase();

            //檢查檔案大小
            if (file.size >= NormalizeFunc.maximumSizeInMegaByte(20)) {
                window.alert("上傳檔案禁止超過 20 MB")
                NormalizeFunc.loadingPage(false)
                return
            }
            //檢查檔案副檔名結構
            if (extension == '.png' || extension == '.jpg' || extension == '.jpeg') {
                uploadFile.append('image', file)
            } else {
                window.alert("上傳檔案僅限 png jpg jpeg")
                NormalizeFunc.loadingPage(false)
                return
            }
        }
        await studentClientConnect.uploadFile(uploadFile).then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                NormalizeFunc.loadingPage(false)
            }
        })

    }
    //--------------------------------------------------------------
    //data Visualization function
    const dataHtml = () => {
        const datahtmlContainer = $('<div>').prop({
            className: 'container-fluid dataVisualizationArea_data',
        })

        $('<h2>').prop({
            innerHTML: 'You can\'t not edit html'
        }).css({
            'margin': '0 auto',
            'text-align': 'center',
            'line-height': '100%',
        }).appendTo(datahtmlContainer)

        return datahtmlContainer
    }
    const dataJs = () => {
        const datajsContainer = $('<div>').prop({
            className: 'container-fluid dataVisualizationArea_data',
        })

        $('<h2>').prop({
            innerHTML: 'Edit javascript in the box<br><br>' +
                'If you want import media file<br>' +
                'For Example: \'./media/[filename]\''
        }).css({
            'margin': '0 auto',
            'text-align': 'center',
            'line-height': '100%',
        }).appendTo(datajsContainer)


        return datajsContainer
    }
    const dataMedia = () => {
        const datamediaContainer = $('<div>').prop({
            className: 'row dataVisualizationArea_data'
        })

        const datamediaLoading = $('<div>').prop({
            innerHTML: '<svg id="content_status_icon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/></svg>' +
                'Seacrhing Folder...'
        }).css({
            'width': '100%',
            'height': '100%',
            'text-align': 'center'
        }).appendTo(datamediaContainer)

        //搜尋file
        studentClientConnect.searchFile().then(response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                //去除Loading畫面
                datamediaLoading.remove()

                if (response.data.files != undefined) {
                    //製作 IMG 的列表圖
                    for (let mediaFile of response.data.files) {
                        const fileItem = $('<div>').prop({
                            className: 'col-2 media_item',
                            innerHTML: `<img src=${mediaFile.src} style="width:40px;height:40px"></img>` +
                                `<p>${mediaFile.name}</p>`,
                            name: mediaFile.name
                        }).hover(
                            (e) => {
                                deleteIcon.fadeIn(200)
                            },
                            (e) => {
                                deleteIcon.fadeOut(50)
                            }).appendTo(datamediaContainer)

                        const deleteIcon = $('<div>').prop({
                            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="10px" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'
                        }).css({
                            'display': 'none',
                            'background-color': 'rgba(0,0,0,0.3)',
                            'width': '50%',
                            'border-radius': '10px',
                            'margin': '0 auto',
                            'transition-duration': '0.3s'
                        }).hover(
                            (e) => {
                                deleteIcon.css({
                                    'background-color': 'rgba(255,0,0,0.7)'
                                })
                            }, (e) => {
                                deleteIcon.css({
                                    'background-color': 'rgba(0,0,0,0.3)'
                                })
                            }).click((e) => {
                                deleteMedia(fileItem)
                            }).appendTo(fileItem)
                    }
                } else {
                    $('<h3>').prop({
                        innerHTML: 'no file exist'
                    }).css({
                        'margin': '0 auto'
                    }).appendTo(datamediaContainer)
                }
            }

        })
        return datamediaContainer
    }
    //delete Media
    const deleteMedia = (file) => {
        if (window.confirm(`確定刪除圖像 ${file[0].name} ?`)) {
            studentClientConnect.deleteFile(file[0].name).then(response => {
                if (NormalizeFunc.serverResponseErrorDetect(response)) {
                    file.remove()
                }
            })
        }
    }

    return contentRowDiv
}
//Reflection return function
const ReflectionBox = () => {
    // 把 Sync 字樣刪除
    $('.content_complete').remove()
    //Content Div-------------------------------------------------
    const contentDiv = $('<div>').prop({
        className: 'justify-content-center ReflectionContentDiv'
    })

    return contentDiv
}


export {
    TargetBox,
    StartBox,
    CommentBox,
    UnderstandingBox,
    FormulatingBox,
    ProgrammingBox,
    ReflectionBox
}