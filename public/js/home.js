import { NormalizeFunc, ClickListening } from '../global/common.js'
import { studentClientConnect } from '../global/axiosconnect.js'
NormalizeFunc.loadingPage(true)

//----click function----//
$('#logout').click(e => logout())
$('#changePassword').click(e => changePassword())
$('.goListTitle_Selection').click(e => changeSelection(e.currentTarget))


const logout = () => {
    NormalizeFunc.loadingPage(true)
    studentClientConnect.logout().then(response => {
        window.location.href = '/'
    })
}

const changePassword = () => {
    const changePasswordDiv = $('<div>').prop({
        className: 'container-fluid changePasswordDiv'
    }).prependTo($('body'))

    $(document).keydown((e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            confirmCP()
        }
    })


    const CPDesktop = $('<div>').prop({
        className: 'container-fluid CPDesktop'
    }).appendTo(changePasswordDiv)

    const CPContainer = $('<div>').prop({
        className: 'container-sm CPContainer'
    }).appendTo(CPDesktop)

    $('<div>').prop({
        className: 'CP_Title',
        innerHTML: '<h3><b>修改密碼</b></h3>'
    }).appendTo(CPContainer)

    //----Change Password Content----//
    const CP_PasswordContent = $('<div>').prop({
        className: 'container justify-content-center CP_PasswordContent',
    }).appendTo(CPContainer)

    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="password" class="form-control" id="old_password" placeholder="舊密碼">
                    <label for="old_password">舊密碼</label>`
    }).appendTo(CP_PasswordContent)
    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="password" class="form-control" id="new_password_1" placeholder="新密碼">
                    <label for="new_password_1">新密碼</label>`
    }).appendTo(CP_PasswordContent)
    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="password" class="form-control" id="new_password_2" placeholder="再次輸入">
                    <label for="new_password_2">再次輸入</label>`
    }).appendTo(CP_PasswordContent)

    //----Change Password Button----//
    const CP_Button = $('<div>').prop({
        className: 'row CP_Button'
    }).appendTo(CP_PasswordContent)
    $('<button>').prop({
        className: 'col-4 btn btn-info',
        id: 'LS_ComfirmChangePassword',
        innerHTML: '確認'
    }).click(e => {
        confirmCP()
    }).appendTo(CP_Button)
    $('<button>').prop({
        className: 'col-4 offset-md-4 btn btn-outline-info',
        id: 'LS_CancelChangePassword',
        innerHTML: '取消'
    }).click(e => {
        cancelCP()
    }).appendTo(CP_Button)

    //----Block----//
    $('<div>').prop({
        className: 'container-fluid block',
        id: 'LS_CancelChangePassword'
    }).click(e => {
        cancelCP()
    }).appendTo(changePasswordDiv)

    const confirmCP = () => {
        const NP_1 = $('#new_password_1').val()
        const NP_2 = $('#new_password_2').val()
        const OP = $('#old_password').val()

        if (NP_1.length === 0 || NP_2.length === 0 || OP.length === 0) {
            window.alert('不得有欄位為空!')
            return
        }
        if (NP_1 !== NP_2) {
            window.alert("兩次密碼輸入不一致!")
            $('#new_password_1').val('')
            $('#new_password_2').val('')
            $('#old_password').val('')
            return
        }
        if (NP_1 === OP) {
            window.alert("新舊密碼不得相同!")
            $('#new_password_1').val('')
            $('#new_password_2').val('')
            $('#old_password').val('')
            return
        }
        NormalizeFunc.loadingPage(true)
        studentClientConnect.changePassword(OP, NP_2).then(async response => {
            ClickListening('', `確認修改-密碼-新密碼為 ${NP_1}`)
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                window.alert(response.data.message)
                NormalizeFunc.loadingPage(false)
                cancelCP()
            }
        })
    }
    const cancelCP = () => {
        $(document).off('keydown')
        changePasswordDiv.fadeOut(500)
        setTimeout(e => {
            changePasswordDiv.remove()
        }, 300)
    }


}

const changeSelection = (target) => {
    // 變換文字選擇狀態
    $('.goListTitle_Selection').removeClass('title_selected')
    $(`#${target.id}`).addClass('title_selected')

    $('.goListCourse').empty()
    if (target.id === 'titleCoWorker') {
        window.location.href = "#cowork"
    } else {
        window.location.href = "#student"
    }

    homRenderInit()
}

const homeInit = () => {
    studentClientConnect.getAllCourse().then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            if (response.data.standardData !== null || response.data.standardData !== undefined) {
                response.data.standardData.forEach((value, index) => {
                    const goListContainer = $('<div>').prop({
                        className: 'goListCourse_contentContainer',
                    }).click(e => {
                        enterClass(value._id)
                        // 進入課程LS
                        ClickListening('', `進入課程-${value.goListTitle}`)
                    }).appendTo($('.goListCourse'))

                    //Image Box
                    $('<div>').prop({
                        className: 'goListCourse_contentImageBox',
                        innerHTML: '<img src="../media/img/amumamum.PNG" alt="home" style="width:100%;height: 60%">'
                    }).appendTo(goListContainer)

                    //Title Detail
                    $('<div>').prop({
                        className: 'goListCourse_contentTitle',
                        innerHTML: value.goListTitle
                    }).appendTo(goListContainer)

                    const enterClass = (id) => {
                        window.location.href = `/student/${id}`
                    }
                })
            }
        }
    })

    document.addEventListener('mousedown', ClickListening, false)

    NormalizeFunc.loadingPage(false)
}

const renderCoWorkList = () => {
    studentClientConnect.getAllCoworkCourse().then((response)=>{
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            console.log(response.data)
        }
    })
    NormalizeFunc.loadingPage(false)
}

const homRenderInit = () => {
    if (window.location.hash == '#cowork') {
        $('.goListTitle_Selection').removeClass('title_selected')
        $(`#titleCoWorker`).addClass('title_selected')
        renderCoWorkList()
    } else {
        window.location.href = '#course'
        $('.goListTitle_Selection').removeClass('title_selected')
        $(`#titleCourse`).addClass('title_selected')
        homeInit()
    }
}

window.addEventListener('DOMContentLoaded', homRenderInit)