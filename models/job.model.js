const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide job title"],
        trim: true,
        maxlength: [100, "Job title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Please provide job description"],
        trim: true,
        maxlength: [2000, "Job description cannot exceed 2000 characters"]
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    location: {
        type: String,
        required: [true, "Please provide job location"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Please provide job type"],
        enum: ["Full-time", "Part-time", "Contract", "Internship"],
        default: "Full-time"
    },
    salary: {
        type: Number,
        required: [true, "Please provide salary"]
    },
    skills: [{
        type: String,
        required: [true, "Please provide required skills"]
    }],
    experience: {
        type: Number,
        required: [true, "Please provide required experience in years"]
    },
    education: {
        type: String,
        required: [true, "Please provide required education"]
    },
    status: {
        type: String,
        enum: ["Open", "Closed"],
        default: "Open"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;