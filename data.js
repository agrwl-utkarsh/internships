// Mock data for internships
const internships = [
    {
        id: 1,
        company: "TechNova",
        role: "Frontend Developer Intern",
        domain: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        preference: "Remote",
        location: "San Francisco, CA (Remote)",
        deadline: "Nov 30, 2026",
        logoColor: "#61dafb", // React blue
        logoText: "TN"
    },
    {
        id: 2,
        company: "DataSphere",
        role: "Data Science Intern",
        domain: "Data Science",
        skills: ["Python", "SQL", "Pandas", "Machine Learning"],
        preference: "On-site",
        location: "New York, NY",
        deadline: "Dec 15, 2026",
        logoColor: "#3776ab", // Python blue
        logoText: "DS"
    },
    {
        id: 3,
        company: "MobileFirst",
        role: "iOS Engineering Intern",
        domain: "App Development",
        skills: ["Swift", "Objective-C", "UI/UX"],
        preference: "Hybrid",
        location: "Austin, TX",
        deadline: "Nov 20, 2026",
        logoColor: "#f05138", // Swift orange
        logoText: "MF"
    },
    {
        id: 4,
        company: "CloudCore",
        role: "Backend Engineer Intern",
        domain: "Core Engineering",
        skills: ["Java", "Spring Boot", "SQL", "AWS"],
        preference: "Remote",
        location: "Seattle, WA (Remote)",
        deadline: "Dec 05, 2026",
        logoColor: "#e32c2e", // Java red
        logoText: "CC"
    },
    {
        id: 5,
        company: "DesignHub",
        role: "Product Design Intern",
        domain: "UI/UX Design",
        skills: ["Figma", "UI/UX", "CSS"],
        preference: "On-site",
        location: "London, UK",
        deadline: "Nov 25, 2026",
        logoColor: "#f24e1e", // Figma red
        logoText: "DH"
    },
    {
        id: 6,
        company: "AlgoTrader",
        role: "Quantitative Analyst Intern",
        domain: "Finance",
        skills: ["Python", "C++", "Mathematics"],
        preference: "On-site",
        location: "Chicago, IL",
        deadline: "Dec 10, 2026",
        logoColor: "#004225", // Finance green
        logoText: "AT"
    },
    {
        id: 7,
        company: "BuildIt",
        role: "Full Stack Intern",
        domain: "Web Development",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        preference: "Hybrid",
        location: "Berlin, DE",
        deadline: "Dec 01, 2026",
        logoColor: "#68a063", // Node green
        logoText: "BI"
    },
    {
        id: 8,
        company: "GrowthGenius",
        role: "Digital Marketing Intern",
        domain: "Marketing",
        skills: ["SEO", "Content Creation", "Analytics"],
        preference: "Remote",
        location: "Global (Remote)",
        deadline: "Nov 28, 2026",
        logoColor: "#f4b400", // Google yellow
        logoText: "GG"
    },
    {
        id: 9,
        company: "BrainNet",
        role: "Machine Learning Intern",
        domain: "Machine Learning",
        skills: ["Python", "TensorFlow", "PyTorch"],
        preference: "On-site",
        location: "Toronto, CA",
        deadline: "Dec 20, 2026",
        logoColor: "#ff6f00", // TF orange
        logoText: "BN"
    },
    {
        id: 10,
        company: "SystemsGO",
        role: "Embedded Systems Intern",
        domain: "Core Engineering",
        skills: ["C", "C++", "Linux", "Hardware"],
        preference: "On-site",
        location: "Munich, DE",
        deadline: "Nov 15, 2026",
        logoColor: "#a8b9cc", // C++ blue
        logoText: "SG"
    },
    {
        id: 11,
        company: "AppWorks",
        role: "Android Developer Intern",
        domain: "App Development",
        skills: ["Java", "Kotlin", "Android Studio"],
        preference: "Remote",
        location: "Remote",
        deadline: "Dec 05, 2026",
        logoColor: "#3ddc84", // Android green
        logoText: "AW"
    },
    {
        id: 12,
        company: "PixelPerfect",
        role: "UI Engineer Intern",
        domain: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "UI/UX"],
        preference: "Remote",
        location: "Remote",
        deadline: "Nov 22, 2026",
        logoColor: "#e34f26", // HTML red
        logoText: "PP"
    }
];

// Available skills for the profile form
const availableSkills = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Python",
    "Java", "C++", "C", "Swift", "Kotlin", "SQL", "MongoDB",
    "Machine Learning", "TensorFlow", "PyTorch", "Pandas",
    "UI/UX", "Figma", "AWS", "Linux", "SEO", "Content Creation"
].sort();
