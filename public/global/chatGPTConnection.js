function chatGPTInit() {
    axios({
        method: 'POST',
        url:'/chatGPT/chat',
    })
}









window.addEventListener('DOMContentLoaded', chatGPTInit)