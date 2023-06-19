import mongoose from 'mongoose'

const chatroomconfig = new mongoose.Schema({
    // 屆數
    class: {
        type: 'string',
        required: true,
    },
    // 是否啟用
    access: {
        type: 'boolean',
        required: true,
    },
    // 房間ID
    chatRoomId: {
        type: 'string',
        required: true,
    },
    // 學生群組
    studentGroup: {
        type: 'array', //[1082020,1082022]
        required: true,
    },
    // 訊息紀錄
    messageHistory: {
        type: 'array',
        required: false,
    }
})

export default mongoose.model('chatroomconfigs', chatroomconfig)