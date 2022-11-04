import {loadingPage} from '../global/common.js'

$('#formSubmit').click((e) => {
    login(e)
})
$(document).keydown((e) => {
    if (e.keyCode == 13) {
        login(e)
    }
})

const login = (e) => {
    loadingPage(true)
    setTimeout((e)=>{
        const account = $('#account').val()
        const password = $('#password').val()
    
        if(account == ''){
            loadingPage(false)
            window.alert('請輸入帳號')
            return
        }
        if(password == ''){
            loadingPage(false)
            window.alert('請輸入密碼')
            return
        }
    
        axios({
            method: 'post',
            url: '/login',
            data: {
                studentId: account,
                studentPassword: password,
            }
        }).then(response => {
            if (response.data.status == 401) {
                window.alert(response.data.message)
                loadingPage(false)
                return
            }
    
            window.location.href = `/home/${response.data.studentId}`
        })
    },200)
}