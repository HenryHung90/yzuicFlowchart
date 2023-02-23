import mongoose from 'mongoose'

const adminConfig = new mongoose.Schema({
    adminId: {
        type: 'string',
        required: true,
    },
    adminPassword: {
        type: 'string',
        required: true,
    },
    adminName: {
        type: 'string',
        required: true,
    }
})

export default mongoose.model('admincontents', adminConfig)