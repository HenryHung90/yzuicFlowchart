import { NormalizeFunc } from '../global/common.js'
NormalizeFunc.loadingPage(true)

const homeInit = async () => {
    axios({
        method: 'POST',
        url: '/student/getallcourse',
    }).then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            if (response.data.standardData !== null || response.data.standardData !== undefined) {
                renderGoList(response.data.standardData)
            }
        }
    })

    NormalizeFunc.loadingPage(false)
}


//----click function----//
$('#logout').click(e => logout())
$('#changePassword').click(e => changePassword())


const logout = () => {
    if (window.confirm("確定登出嗎？退出前請記得儲存內容喔!")) {
        NormalizeFunc.loadingPage(true)
        axios({
            method: 'post',
            url: '/logout'
        }).then(response => {
            window.location.href = '/'
        })
    }
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
        innerHTML: '確認'
    }).click(e => {
        confirmCP()
    }).appendTo(CP_Button)
    $('<button>').prop({
        className: 'col-4 offset-md-4 btn btn-outline-info',
        innerHTML: '取消'
    }).click(e => {
        cancelCP()
    }).appendTo(CP_Button)

    //----Block----//
    $('<div>').prop({
        className: 'container-fluid block',
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
        axios({
            method: 'POST',
            url: '/student/changepassword',
            data: {
                oldPassword: OP,
                newPassword: NP_2,
            },
            withCredentials: true
        }).then(async response => {
            if (NormalizeFunc.serverResponseErrorDetect(response)) {
                window.alert(response.data.message)
                NormalizeFunc.loadingPage(false)
                if (response.data.status === 200) {
                    cancelCP()
                }
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

const renderGoList = (standardData) => {
    standardData.map((value, index) => {
        const goListContainer = $('<div>').prop({
            className: 'goListCourse_contentContainer'
        }).click(e => {
            enterClass(value._id)
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

window.addEventListener('DOMContentLoaded', homeInit)