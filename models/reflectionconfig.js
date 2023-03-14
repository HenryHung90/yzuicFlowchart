import mongoose from 'mongoose'

const reflectionconfig = new mongoose.Schema({
    // 屆數
    class: {
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
    // 課程id
    courseId: {
        type: 'string',
        required: true,
    },
    // 學生反思內容
    // 內容應為 key = { learning, workhard, difficult, scoring }
    // learing => 學到甚麼, workhard => 要努力甚麼, difficult => 遇到甚麼困難, scoring => 自我評分
    studentReflectionData: {
        type: 'object',
        required: true
    }
})

export default mongoose.model('reflectionconfigs', reflectionconfig)