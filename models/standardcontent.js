import mongoose from 'mongoose'

const standardcontent = new mongoose.Schema({
    class: {
        type: 'string',
        required: true,
    },
    access: {
        type: 'boolean',
        required: true,
    },
    standardGoList: {
        type: 'object',
        required: false,
    },
    standardCodeList: {
        type: 'object',
        required: false,
    }
})

export default mongoose.model('standardcontents', standardcontent)