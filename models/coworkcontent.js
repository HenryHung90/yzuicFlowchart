import mongoose from 'mongoose'

// 教師端共編課程內容
const coworkcontent = new mongoose.Schema({
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
    coworkTitle: {
        type: 'string',
        required: true,
    },
    standardGoList: {
        type: 'object',
        required: true,
    },
    // Demo 位置
    standardMaterial: {
        type: 'string',
        required: false,
    },
    // 任務內容
    // 內容應包含 key => {target, material}
    standardStarting: {
        type: 'object',
        required: false,
    },
    // 探索理解 內容
    // 目標 操作 限制
    // 內容應包含 key = {target, operation, limit}
    standardUnderstanding: {
        type: 'object',
        required: false
    },
    // 表徵制定 內容
    // 語法 => 動畫 互動 監聽
    // 內容應包含 key = {content[{title, code, description}], hint}
    standardFormulating: {
        type: 'object',
        required: false,
    },
    // 計畫執行 內容
    // 提供 hint key => {hint}
    standardProgramming: {
        type: 'object',
        required: false,
    }
})

export default mongoose.model('coworkcontents', coworkcontent)