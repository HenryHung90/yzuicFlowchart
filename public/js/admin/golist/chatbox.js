import customizeOperation from "../../../global/customizeOperation"

const chatBoxInit = async () => {
    const chatBoxMessageContainer = $('<div>').prop({
        className: 'chatBox_MessageContainer'
    }).prependTo($('.chatBoxContainer'))

    //Title
    $('<div>').prop({
        className: 'chatBox_MessageTitle',
        innerHTML: '<h3>Chat Center</h3>'
    }).appendTo(chatBoxMessageContainer)


    // MessageBox
    const MessageBox = $('<div>').prop({
        className: 'chatBox_MessageBox'
    }).appendTo(chatBoxMessageContainer)

    await axios({
        method: 'post',
        url: '/admin/getchatroom',
    }).then(response => {
        
    })




    
    const chatBox = $('.chatBox')
    chatBox.click((e) => {
        if (chatBox.attr('id') === 'chatBox_Close') {
            openChatBox()
        } else {
            closeChatBox()
        }
    })


    const openChatBox = () => {
        chatBox.attr('id', 'chatBox_Open')
        $('.chatBox_MessageContainer').css({
            "display": "inline",
        }).animate({
            'opacity': '1'
        }, 300)

        $('#Message').keydown((e) => {
            if (e.shiftKey && e.keyCode === 13) {
                $('#Message').val($('#Message').val() + '\n')
            }
            else if (e.keyCode === 13) {
                e.preventDefault()
                sendMessage()
            }
        })
    }
    const closeChatBox = () => {
        chatBox.attr('id', 'chatBox_Close')
        $('.chatBox_MessageContainer').animate({
            'opacity': '0'
        }, 300)
        $('#Message').off('keydown')
        setTimeout((e) => {
            $('.chatBox_MessageContainer').css({
                'display': 'none'
            })
        }, 300)
    }
}


export default chatBoxInit 