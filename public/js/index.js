$('#formSubmit').click((e) => {
    const account = $('#account').val()
    const password = $('#password').val()

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
            return
        }
        
        window.location.href = `/home/${response.data.studentId}`
    })
})