function Landing() {
    return (
        <div>
            {/* Hero Section */}
            <div style={{ 
                maxWidth: "800px", 
                margin: "0 auto", 
                padding: "120px 24px 80px",
                textAlign: "center" 
            }}>
                <div style={{
                    display: "inline-block",
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #2a2a4a",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    color: "#4f8ef7",
                    marginBottom: "24px"
                }}>
                    ✨ AI-Powered Job Search
                </div>
                <h1 style={{ fontSize: "56px", marginBottom: "16px", lineHeight: "1.15", fontWeight: "700" }}>
                    Your AI-powered<br/>job search assistant
                </h1>
                <p style={{ color: "#888", fontSize: "18px", marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px" }}>
                    Match your CV to jobs, identify skill gaps, generate cover letters and track your applications — all in one place.
                </p>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                    <a href="/register" style={{
                        backgroundColor: "#4f8ef7",
                        color: "white",
                        padding: "14px 36px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "500"
                    }}>Get Started — it's free</a>
                    <a href="/login" style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        color: "#e8e8e8",
                        padding: "14px 36px",
                        borderRadius: "8px",
                        fontSize: "16px"
                    }}>Sign In</a>
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #2a2a2a", margin: "0 48px" }}></div>

            {/* Features Section */}
            <div style={{ maxWidth: "1000px", margin: "80px auto", padding: "0 24px" }}>
                <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "16px" }}>Everything you need to land your next role</h2>
                <p style={{ textAlign: "center", color: "#888", marginBottom: "60px" }}>Built for students and job seekers in Germany and beyond</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {[
                        { icon: "🎯", title: "CV Matching", desc: "Upload your CV and get an instant match score against any job description with detailed skill gap analysis." },
                        { icon: "✉️", title: "Cover Letter Generator", desc: "Generate personalized, human-sounding cover letters tailored to each specific job — not generic templates." },
                        { icon: "🎤", title: "Interview Prep", desc: "Get targeted interview questions based on your skill gaps so you walk in prepared for exactly what they'll ask." },
                        { icon: "📋", title: "Application Tracker", desc: "Track every job you apply to, update statuses and never lose track of where you are in each process." },
                        { icon: "🔍", title: "Job Search", desc: "Search thousands of jobs across Germany with smart filtering — find werkstudent, junior or senior roles instantly." },
                        { icon: "🌐", title: "Auto Translation", desc: "German job descriptions automatically translated to English so nothing gets lost in translation." },
                    ].map((feature, i) => (
                        <div key={i} style={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "12px",
                            padding: "28px"
                        }}>
                            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{feature.icon}</div>
                            <h3 style={{ fontSize: "17px", marginBottom: "8px" }}>{feature.title}</h3>
                            <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ 
                borderTop: "1px solid #2a2a2a",
                textAlign: "center",
                padding: "80px 24px"
            }}>
                <h2 style={{ fontSize: "36px", marginBottom: "16px" }}>Ready to find your next job?</h2>
                <p style={{ color: "#888", marginBottom: "40px" }}>Join students already using Job Assistant to land roles at top companies.</p>
                <a href="/register" style={{
                    backgroundColor: "#4f8ef7",
                    color: "white",
                    padding: "14px 40px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500"
                }}>Get Started for Free</a>
            </div>
        </div>
    )
}

export default Landing