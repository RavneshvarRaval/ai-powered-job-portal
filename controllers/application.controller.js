const Application = require("../models/application.model");
const Job = require("../models/job.model");
const { sendEmail } = require("../utils/email");

const applyJob = async (req, res) => {
    try {
        const { jobId, resumeId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        const application = new Application({
            job: jobId,
            applicant: req.user._id,
            resume: resumeId
        });

        await application.save();

        // Send email notification to company
        const emailData = {
            to: job.company.email,
            subject: "New Job Application",
            text: `A new application has been received for the position of ${job.title}`
        };

        await sendEmail(emailData);

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({
            success: false,
            message: "Error applying for job",
            error: error.message
        });
    }
};

const getAppliedJobs = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: "job",
                select: "title company location type salary",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error("Error getting applied jobs:", error);
        res.status(500).json({
            success: false,
            message: "Error getting applied jobs",
            error: error.message
        });
    }
};

const getApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (job.company.toString() !== req.user.company.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view applicants for this job"
            });
        }

        const applications = await Application.find({ job: jobId })
            .populate({
                path: "applicant",
                select: "name email"
            })
            .populate({
                path: "resume",
                select: "fileUrl skills experience"
            })
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error("Error getting applicants:", error);
        res.status(500).json({
            success: false,
            message: "Error getting applicants",
            error: error.message
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await Application.findById(applicationId)
            .populate({
                path: "job",
                select: "title company",
                populate: {
                    path: "company",
                    select: "name"
                }
            })
            .populate("applicant", "email");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.job.company.toString() !== req.user.company.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application"
            });
        }

        application.status = status;
        await application.save();

        // Send email notification to applicant
        const emailData = {
            to: application.applicant.email,
            subject: `Application Status Update - ${application.job.title}`,
            text: `Your application for ${application.job.title} at ${application.job.company.name} has been ${status.toLowerCase()}`
        };

        await sendEmail(emailData);

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating application status",
            error: error.message
        });
    }
};

module.exports = {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus
};
