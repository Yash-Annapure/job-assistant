import { useEffect,useState } from "react";
import { getApplications } from "../api";

function Applications() {
    const [applications,setApplications] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApplications = async () => {
            const data = await getApplications()
    if (Array.isArray(data)) {
        setApplications(data)
    } else {
        setApplications([])
    }
    setLoading(false)
}
        fetchApplications()
    }, [])
    return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>My Applications</h1>
        <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>
            Track your job application progress
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {loading ? (
                <p style={{ color: "#888" }}>Loading...</p>
            ) : applications.length === 0 ? (
                <div style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "10px",
                    padding: "40px",
                    textAlign: "center"
                }}>
                    <p style={{ color: "#888" }}>No applications yet.</p>
                    <a href="/jobs" style={{ color: "#4f8ef7", fontSize: "14px" }}>Start searching for jobs →</a>
                </div>
            ) : (
                applications.map(app => (
                    <div key={app.id} style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "10px",
                        padding: "20px 24px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{
                                backgroundColor: "#2a2a2a",
                                color: "#4ade80",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "13px"
                            }}>{app.status}</span>
                            <span style={{ color: "#888", fontSize: "13px" }}>
                                {new Date(app.applied_at).toLocaleDateString()}
                            </span>
                        </div>
                        {app.notes && <p style={{ color: "#888", fontSize: "14px", marginTop: "12px" }}>{app.notes}</p>}
                    </div>
                ))
            )}
        </div>
    </div>
)
}
export default Applications