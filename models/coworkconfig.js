import mongoose from 'mongoose'

// 學生端共編內容
const coworkconfig = new mongoose.Schema({
    // 屆數
    class: {
        type: 'string',
        required: true,
    },
    // 協作課程名稱
    coworkTitle: {
        type: 'string',
        required: true,
    },
    // 協作課程ID
    coworkContentId: {
        type: 'string',
        required: true,
    },
    // 協作狀態
    // {progress:進度, completeVote:是否全數通過(該階段), Iscomplete:是否全數完成(該階段)}
    coworkStatus: {
        type: 'object',
        required: true,
    },
    // 房間ID
    groupId: {
        type: 'string',
        required: true,
    },
    // 學生群組
    studentGroup: {
        type: 'array', //[1082020,1082022]
        required: true,
    },
    // 共編內容
    coworkContent: {
        type: 'object',
        required: false,
    },
    // 共編紀錄
    // [{time:更動時間, student:編輯人, coworkContent:內容}]
    coworkTimesheet: {
        type: 'array',
        required: false
    }
})

export default mongoose.model('coworkconfigs', coworkconfig)