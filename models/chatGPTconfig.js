import mongoose from 'mongoose'

const chatGPTconfig = new mongoose.Schema({
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
    // 課程 ID
    courseId: {
        type: 'string',
        required: true,
    },
    // 課程名稱
    courseName: {
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

export default mongoose.model('chatGPTconfigs', chatGPTconfig)