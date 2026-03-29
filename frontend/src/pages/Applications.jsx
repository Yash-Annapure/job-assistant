import { useEffect, useState } from "react"
import { getApplications, updateApplication, deleteApplication } from "../api"

const statusColors = {
    applied: { bg: "#2a2000", border: "#facc15", color: "#facc15" },
    interviewing: { bg: "#001a2a", border: "#4f8ef7", color: "#4f8ef7" },
    offered: { bg: "#002a00", border: "#4ade80", color: "#4ade80" },
    rejected: { bg: "#2a0000", border: "#f87171", color: "#f87171" }
}

function Applications() {
    const [applications, setApplications] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openDropdown, setOpenDropdown] = useState(null)

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

    const handleStatusChange = async (id, newStatus, notes) => {
        const data = await updateApplication(id, newStatus, notes)
        if (data && data.id) {
            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
            )
        }
        setOpenDropdown(null)
    }

    const handleDeleteApplication = async (id) => {
        const data = await deleteApplication(id)
        if (data) {
            setApplications(prev => prev.filter(app => app.id !== id))
        }
    }

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
                        <a href="/jobs" style={{ color: "#4f8ef7", fontSize: "14px" }}>
                            Start searching for jobs →
                        </a>
                    </div>
                ) : (
                    applications.map(app => {
                        const colors = statusColors[app.status] || statusColors.applied
                        return (
                            <div key={app.id} style={{
                                backgroundColor: "#1a1a1a",
                                border: "1px solid #2a2a2a",
                                borderRadius: "10px",
                                padding: "20px 24px"
                            }}>
                                {/* Job title + date + remove button */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "16px"
                                }}>
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                                        {app.notes || "Job Application"}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{ color: "#888", fontSize: "13px" }}>
                                            {new Date(app.applied_at).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteApplication(app.id)}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid #f87171",
                                                color: "#f87171",
                                                padding: "3px 10px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                cursor: "pointer"
                                            }}>
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Status badge + dropdown */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span
                                        onClick={() => setOpenDropdown(openDropdown === app.id ? null : app.id)}
                                        style={{
                                            backgroundColor: colors.bg,
                                            border: `1px solid ${colors.border}`,
                                            color: colors.color,
                                            padding: "4px 14px",
                                            borderRadius: "20px",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                            textTransform: "capitalize",
                                            cursor: "pointer",
                                            userSelect: "none"
                                        }}
                                    >
                                        {app.status} ✎
                                    </span>
                                    {openDropdown === app.id && (
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value, app.notes)}
                                            style={{
                                                backgroundColor: "#0f0f0f",
                                                border: "1px solid #2a2a2a",
                                                color: "#888",
                                                borderRadius: "6px",
                                                padding: "4px 10px",
                                                fontSize: "13px",
                                                cursor: "pointer",
                                                width: "auto"
                                            }}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="interviewing">Interviewing</option>
                                            <option value="offered">Offered</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default Applications