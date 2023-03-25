import mongoose from 'mongoose'

const formulatingConfig = new mongoose.Schema({
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
    // 表徵制定 內容
    // 語法 => 動畫 互動 監聽
    // 內容應包含 key = {content[{title, code, description}], hint}
    formulatingData: {
        type: 'object',
        required: true,
    }

})

export default mongoose.model('formulatingConfigs', formulatingConfig)