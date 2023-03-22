import mongoose from 'mongoose'

const listenerConfig = new mongoose.Schema({
    // 學生屆數
    studentClass: {
        type: 'string',
        required: true,
    },
    // 學生Id
    studentId: {
        type: 'string',
        required: true,
    },
    // 學生姓名
    studentName: {
        type: 'string',
        required: true,
    },
    // 監聽資料
    // 內容應包含 [{time, operation, description}]
    listenerData: {
        type: 'array',
        required: true,
    }

})

export default mongoose.model('listenerConfigs', listenerConfig)