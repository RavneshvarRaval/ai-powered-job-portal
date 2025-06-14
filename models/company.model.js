const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide company name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide company description"],
        trim: true
    },
    logo: {
        type: String,
        required: [true, "Please provide company logo"]
    },
    website: {
        type: String,
        required: [true, "Please provide company website"]
    },
    location: {
        type: String,
        required: [true, "Please provide company location"]
    },
    industry: {
        type: String,
        required: [true, "Please provide company industry"]
    },
    size: {
        type: String,
        required: [true, "Please provide company size"]
    },
    founded: {
        type: Number,
        required: [true, "Please provide company founding year"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;