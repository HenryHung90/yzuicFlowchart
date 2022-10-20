//Start
//Comment
//Understanding
//Formulating
//Programming
//Reflection

//using in common.js => to show messageBox

//StartBox return function
const StartBox = () => {

}
//CommentBox return function
const CommentBox = () => {

    //Content Div-------------------------------------------------
    const contentDiv = $('<div>').prop({
        className: 'justify-content-center commentContentDiv'
    })

    //contentTitle
    const contentTitle = $('<div>').prop({
        className: 'form-floating mb-3 content_Title',
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
            'height': '70px',
            'width': '70px',
            'margin-top': '0',
            'margin-left': '0',
        })
        $('#txtBtn').css({
            'transition-duration': '0.3s',
            'height': '70px',
            'width': '70px',
        })
    }, (e) => {
        createTxtBtn.css({
            'transition-duration': '0.3s',
            'background-color': 'transparent',
            'border-radius': '0',
            'height': '50px',
            'width': '50px',
            'margin-top': '10px',
            'margin-left': '10px',
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
            'height': '70px',
            'width': '70px',
            'margin-top': '0',
            'margin-left': '0',
        })
        $('#codeBtn').css({
            'transition-duration': '0.3s',
            'height': '70px',
            'width': '70px',
        })
    }, (e) => {
        createCodeBtn.css({
            'transition-duration': '0.3s',
            'background-color': 'transparent',
            'border-radius': '0',
            'height': '50px',
            'width': '50px',
            'margin-top': '10px',
            'margin-left': '10px',
        })
        $('#codeBtn').css({
            'transition-duration': '0.3s',
            'height': '50px',
            'width': '50px',
        })
    }).click(() => {
        createCodeContent()
    }).appendTo(contentBoxBtnDiv)


    //CreateTxtContent function
    const createTxtContent = () => {

    }

    //CreateCodeContent function
    const createCodeContent = () => {

    }

    return contentDiv
}
//UnderstandingBox return function
const UnderstandingBox = () => {

}
//FormulatingBox return function
const FormulatingBox = () => {

}
//Programming return function
const ProgrammingBox = () => {
    //Content Row 分行器
    const contentRowDiv = $('<div>').prop({
        className: 'row justify-content-left contentColDiv',
    }).css({
        'width': '121%',
    })

    //Coding Div----------------------------------------------------
    const content_CodingDiv = $('<div>').prop({
        className: 'col-9 content_codingdiv'
    }).appendTo(contentRowDiv)
    //Preload
    const content_CodingPreloadContainer = $('<div>').prop({
        className: 'container-sm content_coding_preloadContainer',
    }).appendTo(content_CodingDiv)
    /////preload textarea
    const preloadTextarea = $('<textarea>').prop({
        className: 'form-control',
        id: 'preload'
    }).appendTo(content_CodingPreloadContainer)

    //create
    const content_CodingCreateContainer = $('<div>').prop({
        className: 'container-sm content_coding_createContainer',
    }).appendTo(content_CodingDiv)
    /////create textarea
    const createTextarea = $('<textarea>').prop({
        className: 'form-control',
        id: 'create'
    }).appendTo(content_CodingCreateContainer)

    //update
    const content_CodingUpdateContainer = $('<div>').prop({
        className: 'container-sm content_coding_updateContainer',
    }).appendTo(content_CodingDiv)
    /////update textarea
    const updateTextarea = $('<textarea>').prop({
        className: 'form-control',
        id: 'update'
    }).appendTo(content_CodingUpdateContainer)

    //--------------------------------------------------------------
    //Lanch
    const content_LanchBtn = $('<div>').prop({
        className: 'col-1 content_lanchbtndiv',
    }).appendTo(contentRowDiv)
    const lanchBtn = $('<button>').prop({
        className: 'btn btn-success',
        innerHTML: 'Launch'
    }).click((e) => {
        launchDemo()
    }).appendTo(content_LanchBtn)

    //Display Div
    const content_DisplayDiv = $('<div>').prop({
        className: 'col-3 content_displaydiv',
        innerHTML: 'display Monitor'
    })


    //Launch function
    const launchDemo = async () => {
        let fileLocation = ''
       
        axios({
            url: 'http://localhost:3000/launchdemo',
            method: 'post',
        }).then(response => {
            if (response.status == 200) {
                fileLocation = response.data
            }
            if (response.status == 500) {
                window.alert(response.data)
                return
            }
            //click close function
            const closePage = () => {
                block.fadeOut(200)
                DemoDiv.fadeOut(200)
                setTimeout(() => {
                    $('body').css({
                        'overflow': 'auto',
                    })
                    DemoDiv.remove()
                    block.remove()
                }, 200)
            }

            const DemoDiv = $('<div>').prop({
                className: 'container-fluid DemoDiv',
            }).prependTo($('.contentDiv'))

            const block = $('<div>').prop({
                className: 'container-fluid block',
            }).css({
                'margin-top': `calc(${window.pageYOffset}px - 20px)`
            }).click(() => {
                closePage()
            }).appendTo(DemoDiv)

            $('<iframe>')
                .prop({
                    className: 'container-sm'
                })
                .css({
                    'position': 'absolute',
                    'height': '600px',
                    'left': '10vw',
                    'z-index': '1000000',
                })
                .attr('src', `access/${fileLocation}/${fileLocation}.html`)
                .appendTo(DemoDiv)
        })
    }

    return contentRowDiv
}
//Reflection return function
const ReflectionBox = () => {

}




export { StartBox, CommentBox, UnderstandingBox, FormulatingBox, ProgrammingBox, ReflectionBox }