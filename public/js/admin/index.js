import { adminClientConnect } from '../../global/axiosconnect.js'
import customizeOperation from '../../global/customizeOperation.js'

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
    customizeOperation.loadingPage(true)
    const account = $('#account').val()
    const password = $('#password').val()

    if (account == '') {
        customizeOperation.loadingPage(false)
        window.alert('請輸入帳號')
        return
    }
    if (password == '') {
        customizeOperation.loadingPage(false)
        window.alert('請輸入密碼')
        return
    }

    adminClientConnect.login(account, password).then(response => {
        if (customizeOperation.serverResponseErrorDetect(response)) {
            window.location.href = `/home/${response.data.adminId}`
        }
    })
}