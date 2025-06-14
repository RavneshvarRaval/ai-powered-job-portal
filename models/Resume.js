import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    file: {
        type: Buffer,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    extractedSkills: [{
        type: String
    }],
    processedText: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
resumeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume; 