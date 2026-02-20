const mongoose = require('mongoose');
const Internship = require('./models/Internship');
const connectDB = require('./config/db');

// The original mock data expanded
const internshipsData = [
    {
        company: "TechNova",
        role: "Frontend Developer Intern",
        domain: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        preference: "Remote",
        location: "San Francisco, CA (Remote)",
        deadline: new Date("2026-11-30"),
        logoColor: "#61dafb",
        logoText: "TN",
        postedAt: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago -> "New"
    },
    {
        company: "DataSphere",
        role: "Data Science Intern",
        domain: "Data Science",
        skills: ["Python", "SQL", "Pandas", "Machine Learning"],
        preference: "On-site",
        location: "New York, NY",
        deadline: new Date("2026-12-15"),
        logoColor: "#3776ab",
        logoText: "DS",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago -> Not new
    },
    {
        company: "MobileFirst",
        role: "iOS Engineering Intern",
        domain: "App Development",
        skills: ["Swift", "Objective-C", "UI/UX"],
        preference: "Hybrid",
        location: "Austin, TX",
        deadline: new Date("2026-11-20"),
        logoColor: "#f05138",
        logoText: "MF",
        postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago -> "New"
    },
    {
        company: "CloudCore",
        role: "Backend Engineer Intern",
        domain: "Core Engineering",
        skills: ["Java", "Spring Boot", "SQL", "AWS"],
        preference: "Remote",
        location: "Seattle, WA (Remote)",
        deadline: new Date("2026-12-05"),
        logoColor: "#e32c2e",
        logoText: "CC",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        company: "DesignHub",
        role: "Product Design Intern",
        domain: "UI/UX Design",
        skills: ["Figma", "UI/UX", "CSS"],
        preference: "On-site",
        location: "London, UK",
        deadline: new Date("2026-11-25"),
        logoColor: "#f24e1e",
        logoText: "DH",
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago -> "New"
    },
    {
        company: "AlgoTrader",
        role: "Quantitative Analyst Intern",
        domain: "Finance",
        skills: ["Python", "C++", "Mathematics"],
        preference: "On-site",
        location: "Chicago, IL",
        deadline: new Date("2026-12-10"),
        logoColor: "#004225",
        logoText: "AT",
        postedAt: new Date()
    },
    {
        company: "BuildIt",
        role: "Full Stack Intern",
        domain: "Web Development",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        preference: "Hybrid",
        location: "Berlin, DE",
        deadline: new Date("2026-12-01"),
        logoColor: "#68a063",
        logoText: "BI",
        postedAt: new Date()
    },
    {
        company: "GrowthGenius",
        role: "Digital Marketing Intern",
        domain: "Marketing",
        skills: ["SEO", "Content Creation", "Analytics"],
        preference: "Remote",
        location: "Global (Remote)",
        deadline: new Date("2026-11-28"),
        logoColor: "#f4b400",
        logoText: "GG",
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
        company: "BrainNet",
        role: "Machine Learning Intern",
        domain: "Machine Learning",
        skills: ["Python", "TensorFlow", "PyTorch"],
        preference: "On-site",
        location: "Toronto, CA",
        deadline: new Date("2026-12-20"),
        logoColor: "#ff6f00",
        logoText: "BN",
        postedAt: new Date()
    },
    {
        company: "SystemsGO",
        role: "Embedded Systems Intern",
        domain: "Core Engineering",
        skills: ["C", "C++", "Linux", "Hardware"],
        preference: "On-site",
        location: "Munich, DE",
        deadline: new Date("2026-11-15"),
        logoColor: "#a8b9cc",
        logoText: "SG",
        postedAt: new Date()
    },
    {
        company: "AppWorks",
        role: "Android Developer Intern",
        domain: "App Development",
        skills: ["Java", "Kotlin", "Android Studio"],
        preference: "Remote",
        location: "Remote",
        deadline: new Date("2026-12-05"),
        logoColor: "#3ddc84",
        logoText: "AW",
        postedAt: new Date(Date.now() - 20 * 60 * 60 * 1000) // 20 hours ago -> "New"
    },
    {
        company: "PixelPerfect",
        role: "UI Engineer Intern",
        domain: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "UI/UX"],
        preference: "Remote",
        location: "Remote",
        deadline: new Date("2026-11-22"),
        logoColor: "#e34f26",
        logoText: "PP",
        postedAt: new Date()
    },
    // Adding a few more to flesh out the DB
    {
        company: "FinTech Sol",
        role: "Blockchain Dev Intern",
        domain: "Core Engineering",
        skills: ["Solidity", "C++", "JavaScript", "Cryptography"],
        preference: "Remote",
        location: "Miami, FL (Remote)",
        deadline: new Date("2026-12-10"),
        logoColor: "#3c3c3d",
        logoText: "FS",
        postedAt: new Date()
    },
    {
        company: "Creative Cloud",
        role: "Motion Graphics Intern",
        domain: "UI/UX Design",
        skills: ["After Effects", "Premiere Pro", "UI/UX"],
        preference: "Hybrid",
        location: "Los Angeles, CA",
        deadline: new Date("2026-11-28"),
        logoColor: "#ff0000",
        logoText: "CC",
        postedAt: new Date(Date.now() - 40 * 60 * 60 * 1000) // 40 hours ago
    },
    {
        company: "CyberShield",
        role: "Security Analyst Intern",
        domain: "Core Engineering",
        skills: ["Network Security", "Python", "Linux", "C"],
        preference: "On-site",
        location: "Washington, DC",
        deadline: new Date("2026-12-01"),
        logoColor: "#000000",
        logoText: "CS",
        postedAt: new Date()
    }
];

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Internship.deleteMany({});
        console.log('Cleared existing internships.');

        // Insert mock data
        await Internship.insertMany(internshipsData);
        console.log('Database seeded with internships successfully!');

        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
