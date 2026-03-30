import { useEffect, useState } from "react"
import { getMe, uploadCV, deleteCV, analyzeCV, getCV } from "../api"

function Dashboard() {
    const [user, setUser] = useState(null)
    const [cv, setCv] = useState(null)
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getMe()
            if (userData) setUser(userData)
            const cvData = await getCV()
            if (cvData && cvData.id) setCv(cvData)
        }
        fetchData()
    }, [])

    const handleUploadCV = async () => {
        if (!file) { setMessage("Please select a file first"); return }
        setUploading(true)
        const data = await uploadCV(file)
        setUploading(false)
        if (data && data.id) {
            setCv(data)
            setAnalysis(null)
            setMessage("CV uploaded successfully")
        } else {
            setMessage("Upload failed. Try again.")
        }
    }

    const handleDeleteCV = async () => {
        const data = await deleteCV()
        if (data) { setCv(null); setFile(null); setAnalysis(null); setMessage("") }
    }

    const handleAnalyzeCV = async () => {
        setAnalyzing(true)
        const data = await analyzeCV()
        setAnalyzing(false)
        if (data && data.skills) {
            setAnalysis(data)
            setMessage("")
        } else if (data && data.detail && data.detail.includes("busy")) {
            setMessage("AI service is busy — please wait a few seconds and try again.")
        } else {
            setMessage("Analysis failed. Make sure you have a CV uploaded.")
        }
    }

    const card = {
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "28px"
    }

    return (
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
                <h1 style={{
                    fontSize: "26px",
                    fontWeight: "600",
                    letterSpacing: "-0.5px",
                    marginBottom: "6px"
                }}>
                    Welcome back{user ? `, ${user.username}` : ""} 👋
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
                    Manage your CV and start matching jobs
                </p>
            </div>

            {/* CV Section */}
            <div style={{ ...card, marginBottom: "20px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Your CV</h2>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
                        Upload PDF or DOCX — uploading a new CV replaces the existing one
                    </p>
                </div>

                {message && (
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        marginBottom: "16px",
                        backgroundColor: message.includes("failed") || message.includes("select") || message.includes("busy")
                            ? "rgba(248,113,113,0.08)" : "rgba(74,222,128,0.08)",
                        border: `1px solid ${message.includes("failed") || message.includes("select") || message.includes("busy")
                            ? "rgba(248,113,113,0.2)" : "rgba(74,222,128,0.2)"}`,
                        color: message.includes("failed") || message.includes("select") || message.includes("busy")
                            ? "#f87171" : "#4ade80"
                    }}>{message}</div>
                )}

                {cv && (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: "rgba(74,222,128,0.05)",
                        border: "1px solid rgba(74,222,128,0.15)",
                        borderRadius: "9px",
                        marginBottom: "16px"
                    }}>
                        <div>
                            <p style={{ fontSize: "13px", color: "#4ade80", marginBottom: "2px" }}>✓ CV uploaded</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{cv.file_path?.split("/").pop()}</p>
                        </div>
                        <button onClick={handleDeleteCV} style={{
                            backgroundColor: "transparent",
                            border: "1px solid rgba(248,113,113,0.3)",
                            color: "#f87171",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            fontSize: "12px"
                        }}>Delete</button>
                    </div>
                )}

                <div style={{
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "28px",
                    textAlign: "center",
                    marginBottom: "16px",
                    backgroundColor: "rgba(255,255,255,0.02)"
                }}>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginBottom: "14px" }}>
                        PDF or DOCX supported
                    </p>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", width: "auto" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleUploadCV} disabled={uploading}
                        style={{ opacity: uploading ? 0.5 : 1, fontSize: "13px", padding: "9px 18px" }}>
                        {uploading ? "Uploading..." : "Upload CV"}
                    </button>
                    {cv && (
                        <button onClick={handleAnalyzeCV} disabled={analyzing} style={{
                            backgroundColor: "transparent",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "13px",
                            padding: "9px 18px",
                            opacity: analyzing ? 0.5 : 1
                        }}>
                            {analyzing ? "Analyzing..." : "Analyze CV"}
                        </button>
                    )}
                </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
                <div style={card}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>CV Analysis</h2>

                    <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                        {[
                            { label: "Skills Detected", value: analysis.skills.length, color: "#a78bfa" },
                            { label: "Experience", value: analysis.years_of_experience, color: "#4ade80" },
                            { label: "Degrees", value: `${analysis.education.length}`, color: "#4f8ef7" }
                        ].map((stat, i) => (
                            <div key={i} style={{
                                flex: 1,
                                backgroundColor: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "10px",
                                padding: "16px"
                            }}>
                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    {stat.label}
                                </p>
                                <p style={{ fontSize: "24px", fontWeight: "600", color: stat.color }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                            Technical Skills
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                            {analysis.skills.map((skill, i) => (
                                <span key={i} style={{
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "6px",
                                    padding: "4px 11px",
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.7)"
                                }}>{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                            Education
                        </p>
                        {analysis.education.map((edu, i) => (
                            <div key={i} style={{
                                backgroundColor: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "8px",
                                padding: "12px 14px",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.7)"
                            }}>{edu}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard