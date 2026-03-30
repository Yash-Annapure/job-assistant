import { useEffect, useState } from "react"
import { getApplications, updateApplication, deleteApplication } from "../api"

const statusConfig = {
    applied: { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)", color: "#facc15" },
    interviewing: { bg: "rgba(79,142,247,0.08)", border: "rgba(79,142,247,0.25)", color: "#4f8ef7" },
    offered: { bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", color: "#4ade80" },
    rejected: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", color: "#f87171" }
}

function Applications() {
    const [applications, setApplications] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openDropdown, setOpenDropdown] = useState(null)

    useEffect(() => {
        const fetchApplications = async () => {
            const data = await getApplications()
            setApplications(Array.isArray(data) ? data : [])
            setLoading(false)
        }
        fetchApplications()
    }, [])

    const handleStatusChange = async (id, newStatus, notes) => {
        const data = await updateApplication(id, newStatus, notes)
        if (data && data.id) {
            setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app))
        }
        setOpenDropdown(null)
    }

    const handleDelete = async (id) => {
        const data = await deleteApplication(id)
        if (data) setApplications(prev => prev.filter(app => app.id !== id))
        setOpenDropdown(null)
    }

    return (
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "28px", textAlign: "center" }}>
                <h1 style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-0.5px", marginBottom: "6px" }}>
                    Applications
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
                    Track your job application progress
                </p>
            </div>

            {loading ? (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", textAlign: "center" }}>Loading...</p>
            ) : applications.length === 0 ? (
                <div style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    padding: "56px",
                    textAlign: "center"
                }}>
                    <p style={{ color: "rgba(255,255,255,0.3)", marginBottom: "12px", fontSize: "15px" }}>No applications yet</p>
                    <a href="/jobs" style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "7px 16px",
                        borderRadius: "7px",
                        display: "inline-block"
                    }}>Browse jobs →</a>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {applications.map(app => {
                        const config = statusConfig[app.status] || statusConfig.applied
                        return (
                            <div key={app.id} style={{
                                backgroundColor: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "12px",
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px"
                            }}>
                                {/* Job info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontSize: "14px", fontWeight: "500", marginBottom: "3px",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                    }}>{app.notes || "Job Application"}</p>
                                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                                        {new Date(app.applied_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {/* Status Badge */}
                                    <span
                                        onClick={() => setOpenDropdown(openDropdown === `status-${app.id}` ? null : `status-${app.id}`)}
                                        style={{
                                            backgroundColor: config.bg,
                                            border: `1px solid ${config.border}`,
                                            color: config.color,
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            textTransform: "capitalize",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            whiteSpace: "nowrap"
                                        }}>
                                        {app.status} ✎
                                    </span>

                                    {/* Status Dropdown */}
                                    {openDropdown === `status-${app.id}` && (
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value, app.notes)}
                                            style={{
                                                backgroundColor: "#111",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                color: "rgba(255,255,255,0.7)",
                                                borderRadius: "7px",
                                                padding: "5px 10px",
                                                fontSize: "12px",
                                                cursor: "pointer",
                                                width: "auto"
                                            }}>
                                            <option value="applied">Applied</option>
                                            <option value="interviewing">Interviewing</option>
                                            <option value="offered">Offered</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    )}

                                    {/* Three dots menu */}
                                    <div style={{ position: "relative" }}>
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === `menu-${app.id}` ? null : `menu-${app.id}`)}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                                color: "rgba(255,255,255,0.3)",
                                                fontSize: "18px",
                                                padding: "4px 8px",
                                                cursor: "pointer",
                                                letterSpacing: "1px",
                                                lineHeight: "1"
                                            }}>⋮</button>

                                        {openDropdown === `menu-${app.id}` && (
                                            <div style={{
                                                position: "absolute",
                                                right: "0",
                                                top: "100%",
                                                backgroundColor: "#111",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                                padding: "4px",
                                                zIndex: 50,
                                                minWidth: "120px",
                                                boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                                            }}>
                                                <button
                                                    onClick={() => handleDelete(app.id)}
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        color: "#f87171",
                                                        padding: "8px 12px",
                                                        fontSize: "13px",
                                                        cursor: "pointer",
                                                        width: "100%",
                                                        textAlign: "left",
                                                        borderRadius: "5px"
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.08)"}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                                >Remove</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Applications