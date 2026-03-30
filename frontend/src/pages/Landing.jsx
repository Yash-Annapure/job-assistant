function Landing() {
    return (
        <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>

            {/* Navbar */}
            <nav style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 48px",
                borderBottom: "1px solid rgba(255,255,255,0.06)"
            }}>
                <span style={{ fontSize: "16px", fontWeight: "600", letterSpacing: "-0.3px" }}>Job Assistant</span>
                <div style={{ display: "flex", gap: "8px" }}>
                    <a href="/login" style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.2s"
                    }}>Sign In</a>
                    <a href="/register" style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "#fff",
                        color: "#000",
                        fontWeight: "500"
                    }}>Get Started</a>
                </div>
            </nav>

            {/* Hero */}
            <div style={{
                textAlign: "center",
                padding: "120px 24px 80px",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Glow */}
                <div style={{
                    position: "absolute",
                    top: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "800px",
                    height: "400px",
                    background: "radial-gradient(ellipse, rgba(100,60,255,0.15) 0%, transparent 70%)",
                    pointerEvents: "none"
                }} />

                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "32px"
                }}>
                    ✦ AI-Powered Job Search
                </div>

                <h1 style={{
                    fontSize: "72px",
                    fontWeight: "700",
                    letterSpacing: "-3px",
                    lineHeight: "1.05",
                    marginBottom: "24px"
                }}>
                    <span style={{
                        background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>Job</span>
                    {" "}
                    <span style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "300",
                        letterSpacing: "-2px"
                    }}>Assistant</span>
                    <br />
                    <span style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "52px",
                        fontWeight: "400",
                        letterSpacing: "-1.5px"
                    }}>for your next role</span>
                </h1>

                <p style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "18px",
                    maxWidth: "500px",
                    margin: "0 auto 48px",
                    lineHeight: "1.7"
                }}>
                    Match your CV to jobs, identify skill gaps, generate cover letters and track applications — all in one place.
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <a href="/register" style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        padding: "13px 28px",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "500"
                    }}>Get Started — it's free</a>
                    <a href="/login" style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                        padding: "13px 28px",
                        borderRadius: "10px",
                        fontSize: "15px"
                    }}>Sign In</a>
                </div>
            </div>

            {/* Features */}
            <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "80px 48px"
            }}>
                <p style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "13px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "56px"
                }}>Everything you need to land your next role</p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    maxWidth: "960px",
                    margin: "0 auto",
                    borderRadius: "16px",
                    overflow: "hidden"
                }}>
                    {[
                        { icon: "◎", title: "CV Matching", desc: "Get a match score against any job description with detailed skill analysis." },
                        { icon: "✦", title: "Cover Letter", desc: "Personalized cover letters tailored to each specific job — not generic templates." },
                        { icon: "☰", title: "Application Tracker", desc: "Track every job you apply to and never lose track of your progress." },
                        { icon: "⊞", title: "Job Search", desc: "Search jobs across Germany — filter by role, location and type instantly." },
                        { icon: "◐", title: "Auto Translation", desc: "German job descriptions automatically translated to English." },
                        { icon: "◈", title: "Interview Ready", desc: "Know your gaps before the interview and prepare accordingly." },
                    ].map((f, i) => (
                        <div key={i} style={{
                            backgroundColor: "#080808",
                            padding: "32px 28px"
                        }}>
                            <span style={{ fontSize: "20px", display: "block", marginBottom: "16px", opacity: 0.7 }}>{f.icon}</span>
                            <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>{f.title}</h3>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center",
                padding: "80px 24px"
            }}>
                <h2 style={{
                    fontSize: "40px",
                    fontWeight: "700",
                    letterSpacing: "-1px",
                    marginBottom: "16px",
                    background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>Ready to find your next role?</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "36px", fontSize: "16px" }}>
                    Join students already using Job Assistant to land roles at top companies.
                </p>
                <a href="/register" style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "13px 32px",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: "500",
                    display: "inline-block"
                }}>Get Started for Free</a>
            </div>
        </div>
    )
}

export default Landing