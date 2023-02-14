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
    // 主題名稱
    goListTitle: {
        type: 'string',
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
    },
    // Demo 位置
    standardMaterial: {
        type: 'string',
        required: false,
    },
    // 任務內容
    standardStarting: {
        type: 'object',
        required: false,
    },
    // 探索理解 內容
    // 目標 操作 限制（問號內塞流程圖）
    standardUnderstanding: {
        type: 'object',
        required: false
    },
    // 表徵制定 內容
    // 語法 => 動畫 互動 監聽 （問號內塞程式碼）
    standardFormulating: {
        type: 'object',
        required: false,
    }
})

export default mongoose.model('standardcontents', standardcontent)