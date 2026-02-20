// State Management
const appState = {
    user: {
        name: "",
        domain: "",
        skills: [],
        preference: "Any"
    },
    theme: "theme-dark" // Default theme
};

// DOM Elements
const elements = {
    // Views
    views: document.querySelectorAll('.view'),
    landingView: document.getElementById('view-landing'),
    profileView: document.getElementById('view-profile'),
    dashboardView: document.getElementById('view-dashboard'),

    // Interactions
    btnGetStarted: document.getElementById('btn-get-started'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    btnEditProfile: document.getElementById('btn-edit-profile'),
    btnResetFilters: document.getElementById('btn-reset-filters'),

    // Profile Form
    profileForm: document.getElementById('profile-form'),
    userNameInput: document.getElementById('user-name'),
    userDomainInput: document.getElementById('user-domain'),
    skillsContainer: document.getElementById('skills-container'),

    // Dashboard Elements
    displayName: document.getElementById('display-name'),
    displayDomain: document.getElementById('display-domain'),
    chipPref: document.getElementById('chip-pref'),
    chipSkills: document.getElementById('chip-skills'),
    matchCountNum: document.getElementById('match-count-num'),
    internshipsContainer: document.getElementById('internships-container'),
    noResultsMessage: document.getElementById('no-results')
};

// Initialization
function init() {
    setupTheme();
    renderSkillsCheckboxes();
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    elements.btnGetStarted.addEventListener('click', () => switchView('view-profile'));
    elements.btnEditProfile.addEventListener('click', () => switchView('view-profile'));
    elements.btnResetFilters.addEventListener('click', () => switchView('view-profile'));

    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.profileForm.addEventListener('submit', handleProfileSubmit);
}

// Theme handling
function setupTheme() {
    const savedTheme = localStorage.getItem('internmatch-theme');
    if (savedTheme) {
        appState.theme = savedTheme;
        document.body.className = savedTheme;
        updateThemeIcon();
    }
}

function toggleTheme() {
    if (appState.theme === 'theme-dark') {
        appState.theme = 'theme-light';
        document.body.className = '';
    } else {
        appState.theme = 'theme-dark';
        document.body.className = 'theme-dark';
    }

    updateThemeIcon();
    localStorage.setItem('internmatch-theme', appState.theme);
}

function updateThemeIcon() {
    if (appState.theme === 'theme-dark') {
        elements.themeIcon.className = 'fa-regular fa-sun'; // Show sun to switch to light
    } else {
        elements.themeIcon.className = 'fa-regular fa-moon'; // Show moon to switch to dark
    }
}

// View Routing
function switchView(viewId) {
    elements.views.forEach(view => {
        view.classList.remove('section-active');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('section-active');
        window.scrollTo(0, 0);
    }
}

// Dynamic Rendering of Profile Form Skills
function renderSkillsCheckboxes() {
    elements.skillsContainer.innerHTML = '';

    // availableSkills is defined in data.js
    availableSkills.forEach(skill => {
        const id = `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        const wrapper = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.value = skill;
        checkbox.className = 'skill-checkbox';
        checkbox.name = 'skills';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.className = 'skill-label';
        label.textContent = skill;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        elements.skillsContainer.appendChild(wrapper);
    });
}

// Handle Form Submission
function handleProfileSubmit(e) {
    e.preventDefault();

    // Capture user input
    appState.user.name = elements.userNameInput.value.trim();
    appState.user.domain = elements.userDomainInput.value;

    // Capture selected skills
    const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
        .map(input => input.value);
    appState.user.skills = selectedSkills;

    // Capture work preference
    const selectedPref = document.querySelector('input[name="work_pref"]:checked').value;
    appState.user.preference = selectedPref;

    // Update Dashboard UI with user data
    elements.displayName.textContent = appState.user.name;
    elements.displayDomain.textContent = appState.user.domain;

    // Filter and Render Data
    filterAndRenderInternships();

    // Switch to Dashboard
    switchView('view-dashboard');
}

// Filtering Logic
function filterAndRenderInternships() {
    const { domain, skills, preference } = appState.user;

    // Render Active Filter Chips
    elements.chipPref.textContent = preference;
    elements.chipPref.innerHTML = `<i class="fa-solid fa-filter fa-sm"></i> ${preference}`;

    elements.chipSkills.innerHTML = '';
    skills.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = skill;
        elements.chipSkills.appendChild(chip);
    });

    // Filter the internships array (from data.js)
    let filteredResults = internships;

    // 1. Filter by Domain (if strict domain matching wanted, else boost score)
    // We will do a strict filter for Domain as it's a primary choice
    if (domain) {
        filteredResults = filteredResults.filter(job => job.domain === domain);
    }

    // 2. Filter by Preference
    if (preference !== 'Any') {
        filteredResults = filteredResults.filter(job =>
            job.preference === preference || job.preference === 'Hybrid'
        );
    }

    // 3. Filter/Sort by Skills Math (We calculate a match score)
    filteredResults = filteredResults.map(job => {
        let matchCount = 0;
        let matchedSkills = [];

        if (skills.length > 0) {
            job.skills.forEach(jobSkill => {
                if (skills.includes(jobSkill)) {
                    matchCount++;
                    matchedSkills.push(jobSkill);
                }
            });
        }

        return { ...job, matchCount, matchedSkills };
    });

    // Sort by highest skill match count first
    filteredResults.sort((a, b) => b.matchCount - a.matchCount);

    // Render the cards
    renderInternshipCards(filteredResults);
}

function renderInternshipCards(results) {
    elements.internshipsContainer.innerHTML = '';
    elements.matchCountNum.textContent = results.length;

    if (results.length === 0) {
        elements.internshipsContainer.classList.add('hidden');
        elements.noResultsMessage.classList.remove('hidden');
        return;
    }

    elements.internshipsContainer.classList.remove('hidden');
    elements.noResultsMessage.classList.add('hidden');

    const userSkills = appState.user.skills;

    results.forEach(job => {
        const card = document.createElement('div');
        card.className = 'internship-card';

        // Generate Skills HTML
        const skillsHtml = job.skills.map(skill => {
            const isMatch = userSkills.includes(skill);
            return `<span class="skill-tag ${isMatch ? 'match' : ''}">${skill}</span>`;
        }).join('');

        // Preference icon
        let prefIcon = 'fa-globe';
        if (job.preference === 'Remote') prefIcon = 'fa-house-laptop';
        if (job.preference === 'On-site') prefIcon = 'fa-building';
        if (job.preference === 'Hybrid') prefIcon = 'fa-building-user';

        card.innerHTML = `
            <div class="card-header">
                <div class="company-logo" style="color: ${job.logoColor}; border-color: ${job.logoColor}40; background: ${job.logoColor}10;">
                    ${job.logoText}
                </div>
                <div class="time-badge">New</div>
            </div>
            
            <div class="card-body">
                <h3 class="card-role">${job.role}</h3>
                <div class="card-company">${job.company}</div>
                
                <div class="card-meta">
                    <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                    <span><i class="fa-solid ${prefIcon}"></i> ${job.preference}</span>
                </div>
                
                <div class="card-skills">
                    ${skillsHtml}
                </div>
            </div>
            
            <div class="card-footer">
                <div class="deadline">Deadline: ${job.deadline}</div>
                <button class="btn btn-primary" onclick="alert('Application submitted to ${job.company} for ${job.role}!')">
                    Apply Now
                </button>
            </div>
        `;

        elements.internshipsContainer.appendChild(card);
    });
}

// Run app
document.addEventListener('DOMContentLoaded', init);
