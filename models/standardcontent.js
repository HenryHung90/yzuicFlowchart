import mongoose from 'mongoose'

const standardcontent = new mongoose.Schema({
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
    // Flowchart 內容
    standardGoList: {
        type: 'object',
        required: false,
    },
    // Code 內容
    standardCodeList: {
        type: 'object',
        required: false,
    }
})

export default mongoose.model('standardcontents', standardcontent)