import mongoose from 'mongoose'

const flowchartsConfig = new mongoose.Schema({
    studentClass: {
        type: 'string',
        required: true,
    },
    studentId: {
        type: 'string',
        required: true,
    },
    flowchartConfig:{
        type:'object',
        required: true,
    }
})

export default mongoose.model('flowcharts', flowchartsConfig)