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

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getMe()
            if (data) setUser(data)

            const cvData  = await getCV()
            if (cvData && cvData.id) setCv(cvData)
        }
        fetchUser()
    }, [])

    const handleUploadCV = async () => {
        if (!file) {
            setMessage("Please select a file first")
            return
        }
        setUploading(true)
        const data = await uploadCV(file)
        setUploading(false)
        if (data && data.id) {
            setCv(data)
            setAnalysis(null)
            setMessage("CV uploaded successfully!")
        } else {
            setMessage("Upload failed. Try again.")
        }
    }

    const handleDeleteCV = async () => {
        const data = await deleteCV()
        if (data) {
            setCv(null)
            setFile(null)
            setAnalysis(null)
            setMessage("CV deleted.")
        }
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

    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>

            {/* Header */}
            <div style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "24px"
            }}>
                <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>
                    Welcome back, {user ? user.username : "..."} 👋
                </h1>
                <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                    Manage your CV and start matching jobs
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                    <a href="/jobs" style={{
                        backgroundColor: "#4f8ef7", color: "white",
                        padding: "10px 20px", borderRadius: "6px", fontSize: "14px"
                    }}>Search Jobs</a>
                    <a href="/applications" style={{
                        backgroundColor: "#2a2a2a", color: "#e8e8e8",
                        padding: "10px 20px", borderRadius: "6px", fontSize: "14px"
                    }}>My Applications</a>
                    <button onClick={handleLogout} style={{
                        backgroundColor: "transparent",
                        border: "1px solid #2a2a2a",
                        color: "#888", padding: "10px 20px",
                        borderRadius: "6px", fontSize: "14px", cursor: "pointer"
                    }}>Logout</button>
                </div>
            </div>

            {/* CV Section */}
            <div style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "24px"
            }}>
                <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>Your CV</h2>
                <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
                    Upload your CV as PDF or DOCX — uploading a new CV replaces the existing one
                </p>

                {message && (
                    <p style={{
                        color: message.includes("failed") || message.includes("select") ? "#f87171" : "#4ade80",
                        fontSize: "14px", marginBottom: "16px"
                    }}>{message}</p>
                )}

                {cv && (
                    <div style={{
                        backgroundColor: "#0f0f0f",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <p style={{ fontSize: "14px", color: "#4ade80" }}>✓ CV uploaded</p>
                            <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{cv.file_path}</p>
                        </div>
                        <button onClick={handleDeleteCV} style={{
                            backgroundColor: "transparent",
                            border: "1px solid #f87171",
                            color: "#f87171",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}>Delete</button>
                    </div>
                )}

                <div style={{
                    border: "2px dashed #2a2a2a",
                    borderRadius: "8px",
                    padding: "32px",
                    textAlign: "center",
                    marginBottom: "16px"
                }}>
                    <p style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
                        📄 PDF or DOCX files supported
                    </p>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ color: "#e8e8e8", fontSize: "14px" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleUploadCV} disabled={uploading}
                        style={{ opacity: uploading ? 0.6 : 1 }}>
                        {uploading ? "Uploading..." : "Upload CV"}
                    </button>
                    {cv && (
                        <button onClick={handleAnalyzeCV} disabled={analyzing}
                            style={{
                                backgroundColor: "#2a2a2a",
                                border: "1px solid #4f8ef7",
                                color: "#4f8ef7",
                                opacity: analyzing ? 0.6 : 1
                            }}>
                            {analyzing ? "Analyzing..." : "Analyze CV"}
                        </button>
                    )}
                </div>
            </div>

            {/* Analysis Results */}
{analysis && (
    <div style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "32px"
    }}>
        <h2 style={{ fontSize: "18px", marginBottom: "24px" }}>📊 CV Analysis</h2>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
            <div style={{
                flex: 1, backgroundColor: "#0f0f0f",
                border: "1px solid #2a2a2a", borderRadius: "10px", padding: "20px"
            }}>
                <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>SKILLS DETECTED</p>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#4f8ef7" }}>{analysis.skills.length}</p>
            </div>
            <div style={{
                flex: 1, backgroundColor: "#0f0f0f",
                border: "1px solid #2a2a2a", borderRadius: "10px", padding: "20px"
            }}>
                <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>YEARS OF EXPERIENCE</p>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#4ade80" }}>{analysis.years_of_experience}</p>
            </div>
            <div style={{
                flex: 1, backgroundColor: "#0f0f0f",
                border: "1px solid #2a2a2a", borderRadius: "10px", padding: "20px"
            }}>
                <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>EDUCATION</p>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#e8e8e8" }}>
                    {analysis.education.length} degree{analysis.education.length > 1 ? "s" : ""}
                </p>
            </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "12px" }}>🛠 TECHNICAL SKILLS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {analysis.skills.map((skill, i) => (
                    <span key={i} style={{
                        backgroundColor: "#0f0f0f",
                        border: "1px solid #2a2a2a",
                        borderRadius: "6px",
                        padding: "5px 12px",
                        fontSize: "13px",
                        color: "#e8e8e8"
                    }}>{skill}</span>
                ))}
            </div>
        </div>

        {/* Education */}
        <div>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "12px" }}>🎓 EDUCATION</p>
            {analysis.education.map((edu, i) => (
                <div key={i} style={{
                    backgroundColor: "#0f0f0f",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    padding: "14px 16px",
                    marginBottom: "8px",
                    fontSize: "14px"
                }}>{edu}</div>
            ))}
        </div>
    </div>
)
}
    </div>
    )
}

export default Dashboard