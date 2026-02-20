import React from 'react';

const Landing = ({ onGetStarted }) => {
    return (
        <section className="view section-active flex-col md:flex-row items-center justify-between gap-16 py-16">
            <div className="landing-content flex-1 max-w-[600px]">
                <div className="badge inline-block px-4 py-2 bg-indigo-900 text-indigo-300 font-semibold text-sm rounded-full mb-6">
                    🚀 Your Career Starts Here
                </div>
                <h1 className="landing-title text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                    Find Internships That <span className="text-gradient">Match Your Skills</span>
                </h1>
                <p className="landing-subtitle text-xl text-slate-400 mb-10 max-w-[90%]">
                    A personalized internship discovery platform tailored to your unique stack, preferences, and goals. Stop searching, start matching.
                </p>
                <button
                    onClick={onGetStarted}
                    className="btn btn-primary btn-large"
                >
                    Get Started <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>

                <div className="landing-features flex flex-col sm:flex-row gap-8 mt-12 text-slate-400 font-medium">
                    <div className="feature flex items-center">
                        <i className="fa-solid fa-bullseye text-indigo-500 mr-2"></i>
                        <span>Skill-Based Matching</span>
                    </div>
                    <div className="feature flex items-center">
                        <i className="fa-solid fa-bolt text-indigo-500 mr-2"></i>
                        <span>Instant Filtering</span>
                    </div>
                    <div className="feature flex items-center">
                        <i className="fa-solid fa-earth-americas text-indigo-500 mr-2"></i>
                        <span>Remote & On-site</span>
                    </div>
                </div>
            </div>

            <div className="landing-visual flex-1 relative h-[500px] flex items-center justify-center hidden md:flex">
                <div className="glass-card decor-card-1 absolute top-[20%] left-[10%] w-[260px] z-10 animate-float">
                    <div className="decor-header flex items-center gap-3 font-semibold mb-2">
                        <i className="fa-brands fa-react tech-icon text-react text-2xl" style={{ color: '#61dafb' }}></i>
                        <span>Frontend Intern</span>
                    </div>
                    <div className="decor-body text-slate-300">TechCorp Inc.</div>
                </div>

                <div className="glass-card decor-card-2 absolute bottom-[20%] right-[10%] w-[260px] z-10 animate-float" style={{ animationDelay: '-3s' }}>
                    <div className="decor-header flex items-center gap-3 font-semibold mb-2">
                        <i className="fa-brands fa-python tech-icon text-python text-2xl" style={{ color: '#3776ab' }}></i>
                        <span>Data Science Intern</span>
                    </div>
                    <div className="decor-body text-slate-300">Analytics Co.</div>
                </div>

                <div className="blob shape-1 absolute blur-[60px] z-0 opacity-50 rounded-full w-[300px] h-[300px] bg-indigo-600 top-[10%] right-[20%]"></div>
                <div className="blob shape-2 absolute blur-[60px] z-0 opacity-50 rounded-full w-[250px] h-[250px] bg-sky-500 bottom-[10%] left-[20%]"></div>
            </div>
        </section>
    );
};

export default Landing;
