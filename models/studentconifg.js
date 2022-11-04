import mongoose from 'mongoose'

const studentsConfig = new mongoose.Schema({
    studentClass: {
        type: 'string',
        required: true,
    },
    studentId: {
        type: 'string',
        required: true,
    },
    studentPassword: {
        type: 'string',
        required: true,
    },
    studentName: {
        type: 'string',
        required: true,
    },
    studentAccess: {
        type: 'boolean',
        required: true,
    },
    studentGoList: {
        type: 'object',
        required: false
    },
    studentCodeLst: {
        type:'object',
        required:false,
    }
})

export default mongoose.model('students', studentsConfig)