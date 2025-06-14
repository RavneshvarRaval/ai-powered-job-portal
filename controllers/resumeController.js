const { processResumeAndMatchJobs } = require('../utils/resumeParser');
const Job = require('../models/Job');

// Upload and process resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a resume file' });
        }

        const { skills, experience, vector } = await processResumeAndMatchJobs(req.file.buffer);
        
        const resume = new Resume({
            user: req.user._id,
            fileUrl: req.file.path,
            skills,
            experience,
            vector
        });

        await resume.save();

        res.status(201).json({
            success: true,
            message: 'Resume uploaded successfully',
            resume
        });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading resume',
            error: error.message
        });
    }
};

// Get job recommendations based on resume
const getJobRecommendations = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const jobs = await Job.find({ status: 'Open' });
        const recommendations = processResumeAndMatchJobs(resume.vector, jobs);

        res.status(200).json({
            success: true,
            recommendations
        });
    } catch (error) {
        console.error('Error getting job recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting job recommendations',
            error: error.message
        });
    }
};

module.exports = {
    uploadResume,
    getJobRecommendations
}; 