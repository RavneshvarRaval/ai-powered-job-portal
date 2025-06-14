const User = require('../models/user.model');
const Job = require('../models/job.model');
const { processResume, matchJobsWithResume } = require('../utils/nlp');
const path = require('path');

// Process uploaded resume and update user profile
const processUserResume = async (req, res) => {
    try {
        const userId = req.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No resume file uploaded",
                success: false
            });
        }

        // Process the resume
        const resumeData = await processResume(file.path);

        // Update user profile with resume data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.profile.resumeData = {
            extractedSkills: resumeData.skills,
            experience: resumeData.experience,
            vector: resumeData.vector
        };

        await user.save();

        return res.status(200).json({
            message: "Resume processed successfully",
            resumeData: user.profile.resumeData,
            success: true
        });
    } catch (error) {
        console.error("Error processing resume:", error);
        return res.status(500).json({
            message: "Error processing resume",
            success: false
        });
    }
};

// Get job recommendations based on resume
const getJobRecommendations = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user || !user.profile.resumeData || !user.profile.resumeData.vector) {
            return res.status(400).json({
                message: "No resume data found. Please upload a resume first.",
                success: false
            });
        }

        // Get all jobs
        const jobs = await Job.find().populate('company');

        // Match jobs with resume
        const matchedJobs = matchJobsWithResume(user.profile.resumeData.vector, jobs);

        return res.status(200).json({
            message: "Job recommendations retrieved successfully",
            jobs: matchedJobs,
            success: true
        });
    } catch (error) {
        console.error("Error getting job recommendations:", error);
        return res.status(500).json({
            message: "Error getting job recommendations",
            success: false
        });
    }
};

module.exports = { processUserResume, getJobRecommendations }; 