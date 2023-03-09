import { NormalizeFunc } from '../../global/common.js'
import { adminClientConnect } from '../../global/axiosconnect.js'

$('#formSubmit').click((e) => {
    login(e)
})
$(document).keydown((e) => {
    if (e.keyCode == 13) {
        login(e)
    }
})
$(document).on('mousemove', (e) => {
    $('#background').css({
        'transform': `translateX(${e.pageX / 120 - 10}px) translateY(${e.pageY / 120 - 5}px) scale(1.2)`
    })
})

const login = (e) => {
    NormalizeFunc.loadingPage(true)
    const account = $('#account').val()
    const password = $('#password').val()

    if (account == '') {
        NormalizeFunc.loadingPage(false)
        window.alert('請輸入帳號')
        return
    }
    if (password == '') {
        NormalizeFunc.loadingPage(false)
        window.alert('請輸入密碼')
        return
    }

    adminClientConnect.login(account, password).then(response => {
        if (NormalizeFunc.serverResponseErrorDetect(response)) {
            window.location.href = `/home/${response.data.adminId}`
        }
    })
}