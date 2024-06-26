import mongoose from 'mongoose'

const studentsConfig = new mongoose.Schema({
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
    // 學生密碼
    studentPassword: {
        type: 'string',
        required: true,
    },
    // 學生姓名
    studentName: {
        type: 'string',
        required: true,
    },
    // 學生帳號是否啟用合作功能
    studentAccess: {
        type: 'boolean',
        required: true,
    },
    // 學生帳號是否啟用
    studentPermission: {
        type: 'boolean',
        required: false,
    },
    // 學生使用的聊天室
    studentChatRoomId: {
        type: 'string',
        required: false,
    },
    // 學生的 Flowchart
    studentGoList: {
        type: 'object',
        required: false
    },
    // 學生的 Code
    studentCodeList: {
        type: 'object',
        required: false,
    }
})

export default mongoose.model('students', studentsConfig)