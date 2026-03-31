import { useState } from "react"
import { searchJob, matchCV, createApplication, saveJob, generateCoverLetter } from "../api"

function Jobs() {
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [jobs, setJobs] = useState(() => {
    const cached = localStorage.getItem("cachedJobs")
    return cached ? JSON.parse(cached) : []
    })
    const [matchResult, setMatchResult] = useState(null)
    const [matchingJob, setMatchingJob] = useState(null)
    const [coverLetter, setCoverLetter] = useState(null)
    const [generatingLetter, setGeneratingLetter] = useState(null)
    const [trackMessage, setTrackMessage] = useState(null)

    const handleSearch = async () => {
    const data = await searchJob(query, location)
    setJobs(data)
    // cache the results
    localStorage.setItem("cachedJobs", JSON.stringify(data))
    localStorage.setItem("lastQuery", query)
    localStorage.setItem("lastLocation", location)
    }

    const filteredJobs = jobs.filter(job => {
        const matchesLocation = location === "" ||
            job.location.toLowerCase().includes(location.toLowerCase())
        return matchesLocation
    }).sort((a, b) => {
        const queryWords = query.toLowerCase().split(" ")
        const aScore = queryWords.filter(w => a.title.toLowerCase().includes(w)).length
        const bScore = queryWords.filter(w => b.title.toLowerCase().includes(w)).length
        return bScore - aScore
    })

    const handleMatchCV = async (job) => {
        setMatchingJob(job.slug)
        setMatchResult(null)
        const data = await matchCV(job.description)
        setMatchingJob(null)
        if (data && data.match_score !== undefined) {
            setMatchResult({ ...data, jobTitle: job.title, jobSlug: job.slug })
        } else if (data && data.detail && data.detail.includes("busy")) {
            alert("AI service is busy — please wait a few seconds and try again.")
        }
    }

    const handleCoverLetter = async (job) => {
        setGeneratingLetter(job.slug)
        const data = await generateCoverLetter(job.description)
        setGeneratingLetter(null)
        if (data && typeof data === "string") {
            setCoverLetter({ text: data, jobTitle: job.title, jobSlug: job.slug })
        } else if (data && data.detail && data.detail.includes("busy")) {
            alert("AI service is busy — please wait a few seconds and try again.")
        }
    }

    const handleSaveApplication = async (job) => {
        const savedJob = await saveJob({
            title: job.title, company: job.company_name,
            description: job.description, url: job.url
        })
        if (savedJob && savedJob.id) {
            const data = await createApplication(savedJob.id, "applied", job.title)
            if (data && data.id) {
                setTrackMessage({ slug: job.slug, text: `✓ "${job.title}" added to applications`, success: true })
                setTimeout(() => setTrackMessage(null), 3000)
            } else {
                setTrackMessage({ slug: job.slug, text: "Failed to save application.", success: false })
                setTimeout(() => setTrackMessage(null), 3000)
            }
        }
    }

    const outlineBtn = (color) => ({
        backgroundColor: "transparent",
        border: `1px solid ${color}`,
        color: color,
        padding: "5px 12px",
        fontSize: "12px",
        borderRadius: "6px"
    })

    return (
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "28px", textAlign: "center" }}>
                <h1 style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-0.5px", marginBottom: "6px" }}>
                    Find Jobs
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
                    Include job type in your search — e.g. "werkstudent python"
                </p>
            </div>

            {/* Search */}
            <div style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "28px",
                display: "flex",
                gap: "10px"
            }}>
                <input 
                    defaultValue={localStorage.getItem("lastQuery") || ""}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value === "") {
                            setJobs([])
                            setMatchResult(null)
                            setCoverLetter(null)
                            setTrackMessage(null)
                            localStorage.removeItem("cachedJobs")
                            localStorage.removeItem("lastQuery")
                        }
                    }} 
                    placeholder="Role or keywords" 
                    style={{ flex: 2 }} 
                />
                <input 
                    defaultValue={localStorage.getItem("lastLocation") || ""}
                    onChange={(e) => {
                        setLocation(e.target.value)
                        if (e.target.value === "") {
                            localStorage.removeItem("lastLocation")
                        }
                    }} 
                    placeholder="Location" 
                    style={{ flex: 1 }} 
                />
                <button onClick={handleSearch} style={{ width: "auto", padding: "10px 20px", fontSize: "13px", whiteSpace: "nowrap" }}>
                    Search
                </button>
            </div>
            {/* SAP Featured Section */}
                <div style={{
                    backgroundColor: "rgba(79,142,247,0.05)",
                    border: "1px solid rgba(79,142,247,0.2)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                            🎯 Looking for SAP Werkstudent positions?
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
                            Browse directly on SAP's official careers portal
                        </p>
                    </div>
                    <a href="https://jobs.sap.com/"
                        target="_blank" rel="noreferrer"
                        style={{
                            backgroundColor: "#4f8ef7",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "7px",
                            fontSize: "13px",
                            whiteSpace: "nowrap"
                        }}>
                        View SAP Jobs →
                    </a>
                </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredJobs.length === 0 && jobs.length > 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", textAlign: "center" }}>
                        No matching jobs found.
                    </p>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job.slug}>
                            {/* Job Card */}
                            <div style={{
                                backgroundColor: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: matchResult?.jobSlug === job.slug || coverLetter?.jobSlug === job.slug ? "12px 12px 0 0" : "12px",
                                padding: "18px 22px"
                            }}>
                                <div style={{ marginBottom: "12px" }}>
                                    <h3 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "4px" }}>{job.title}</h3>
                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                                        {job.company_name} · {job.location}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    <a href={job.url} target="_blank" rel="noreferrer" style={{
                                        ...outlineBtn("rgba(255,255,255,0.2)"),
                                        color: "rgba(255,255,255,0.6)"
                                    }}>View →</a>
                                    <button
                                        onClick={() => handleMatchCV(job)}
                                        disabled={matchingJob === job.slug}
                                        style={{ ...outlineBtn("rgba(79,142,247,0.6)"), color: "#4f8ef7", opacity: matchingJob === job.slug ? 0.5 : 1 }}>
                                        {matchingJob === job.slug ? "Matching..." : "Match CV"}
                                    </button>
                                    <button
                                        onClick={() => handleCoverLetter(job)}
                                        disabled={generatingLetter === job.slug}
                                        style={{ ...outlineBtn("rgba(167,139,250,0.6)"), color: "#a78bfa", opacity: generatingLetter === job.slug ? 0.5 : 1 }}>
                                        {generatingLetter === job.slug ? "Generating..." : "Cover Letter"}
                                    </button>
                                    <button
                                        onClick={() => handleSaveApplication(job)}
                                        style={{ ...outlineBtn("rgba(74,222,128,0.5)"), color: "#4ade80" }}>
                                        + Track
                                    </button>
                                </div>

                                {/* Inline track message */}
                                {trackMessage?.slug === job.slug && (
                                    <div style={{
                                        marginTop: "12px",
                                        padding: "8px 12px",
                                        backgroundColor: trackMessage.success ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                                        border: `1px solid ${trackMessage.success ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                                        borderRadius: "7px",
                                        fontSize: "13px",
                                        color: trackMessage.success ? "#4ade80" : "#f87171"
                                    }}>
                                        {trackMessage.text}
                                    </div>
                                )}
                            </div>

                            {/* Inline Match Result */}
                            {matchResult?.jobSlug === job.slug && (
                                <div style={{
                                    backgroundColor: "rgba(79,142,247,0.04)",
                                    border: "1px solid rgba(79,142,247,0.2)",
                                    borderTop: "none",
                                    borderRadius: coverLetter?.jobSlug === job.slug ? "0" : "0 0 12px 12px",
                                    padding: "18px 22px"
                                }}>
                                    <div style={{ display: "flex", gap: "16px", marginBottom: "14px" }}>
                                        <div style={{
                                            backgroundColor: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            borderRadius: "10px",
                                            padding: "14px 20px",
                                            textAlign: "center",
                                            minWidth: "100px"
                                        }}>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Match</p>
                                            <p style={{
                                                fontSize: "28px", fontWeight: "700",
                                                color: matchResult.match_score > 70 ? "#4ade80" : matchResult.match_score > 50 ? "#facc15" : "#f87171"
                                            }}>{matchResult.match_score}%</p>
                                        </div>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {matchResult["skill-analysis"]?.missing_skills?.length > 0 && (
                                                <div>
                                                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Missing</p>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                                        {matchResult["skill-analysis"].missing_skills.map((skill, i) => (
                                                            <span key={i} style={{
                                                                backgroundColor: "rgba(248,113,113,0.08)",
                                                                border: "1px solid rgba(248,113,113,0.2)",
                                                                color: "#f87171", borderRadius: "5px",
                                                                padding: "3px 9px", fontSize: "12px"
                                                            }}>{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {matchResult["skill-analysis"]?.matching_skills?.length > 0 && (
                                                <div>
                                                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Matching</p>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                                        {matchResult["skill-analysis"].matching_skills.map((skill, i) => (
                                                            <span key={i} style={{
                                                                backgroundColor: "rgba(74,222,128,0.08)",
                                                                border: "1px solid rgba(74,222,128,0.2)",
                                                                color: "#4ade80", borderRadius: "5px",
                                                                padding: "3px 9px", fontSize: "12px"
                                                            }}>{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => setMatchResult(null)} style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.3)",
                                        fontSize: "12px", padding: "4px 10px"
                                    }}>Close</button>
                                </div>
                            )}

                            {/* Inline Cover Letter */}
                            {coverLetter?.jobSlug === job.slug && (
                                <div style={{
                                    backgroundColor: "rgba(167,139,250,0.03)",
                                    border: "1px solid rgba(167,139,250,0.2)",
                                    borderTop: "none",
                                    borderRadius: "0 0 12px 12px",
                                    padding: "18px 22px"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                                        <p style={{ fontSize: "11px", color: "rgba(167,139,250,0.8)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                                            Cover Letter
                                        </p>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(coverLetter.text); }}
                                                style={{
                                                    backgroundColor: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    color: "rgba(255,255,255,0.6)",
                                                    padding: "4px 10px", fontSize: "12px"
                                                }}>Copy</button>
                                            <button
                                                onClick={() => setCoverLetter(null)}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                    color: "rgba(255,255,255,0.3)",
                                                    fontSize: "12px", padding: "4px 10px"
                                                }}>Close</button>
                                        </div>
                                    </div>
                                    <textarea
                                        value={coverLetter.text}
                                        onChange={(e) => setCoverLetter({ ...coverLetter, text: e.target.value })}
                                        rows={14}
                                        style={{
                                            width: "100%",
                                            backgroundColor: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            color: "rgba(255,255,255,0.8)",
                                            borderRadius: "8px",
                                            padding: "14px",
                                            fontSize: "14px",
                                            lineHeight: "1.8",
                                            resize: "vertical",
                                            fontFamily: "Inter, sans-serif"
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Jobs