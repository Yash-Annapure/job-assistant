import { useState, useEffect } from "react"
import { searchJob, matchCV, createApplication, saveJob, getMe, generateCoverLetter, getInterviewPrep } from "../api"

function Jobs() {
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [jobs, setJobs] = useState([])
    const [matchResult, setMatchResult] = useState(null)
    const [matchingJob, setMatchingJob] = useState(null)
    const [user, setUser] = useState(null)
    const [coverLetter, setCoverLetter] = useState(null)
    const [generatingLetter, setGeneratingLetter] = useState(null)
    const [interviewPrep, setInterviewPrep] = useState(null)
    const [generatingPrep, setGeneratingPrep] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getMe()
            if (data) setUser(data)
        }
        fetchUser()
    }, [])

    const handleSearch = async () => {
        const data = await searchJob(query, location)
        setJobs(data)
    }

    const filteredJobs = jobs.filter(job =>
        location === "" ||
        query.toLowerCase().split(" ").some(word =>
            job.title.toLowerCase().includes(word)
        ) ||
        job.location.toLowerCase().includes(location.toLowerCase())
    )

    const handleMatchCV = async (job) => {
        setMatchingJob(job.slug)
        setMatchResult(null)
        const data = await matchCV(job.description)
        setMatchingJob(null)
        if (data && data.match_score !== undefined) {
            setMatchResult({ ...data, jobTitle: job.title })
        } else if (data && data.detail && data.detail.includes("busy")) {
            alert("AI service is busy — please wait a few seconds and try again.")
        }
    }

    const handleCoverLetter = async (job) => {
        setGeneratingLetter(job.slug)
        const data = await generateCoverLetter(job.description)
        setGeneratingLetter(null)
        if (data && typeof data === "string") {
            setCoverLetter({ text: data, jobTitle: job.title })
        } else if (data && data.detail && data.detail.includes("busy")) {
            alert("AI service is busy — please wait a few seconds and try again.")
        }
    }

    const handleInterviewPrep = async (job) => {
        setGeneratingPrep(job.slug)
        const data = await getInterviewPrep(job.description)
        setGeneratingPrep(null)
        if (data && data.questions) {
            setInterviewPrep({ questions: data.questions, jobTitle: job.title })
        } else if (data && data.detail && data.detail.includes("busy")) {
            alert("AI service is busy — please wait a few seconds and try again.")
        }
    }

    const handleSaveApplication = async (job) => {
        const savedJob = await saveJob({
            title: job.title,
            company: job.company_name,
            description: job.description,
            url: job.url
        })
        if (savedJob && savedJob.id) {
            const data = await createApplication(savedJob.id, "applied", job.title)
            if (data && data.id) {
                alert(`✓ "${job.title}" added to your applications!`)
            } else {
                alert("Failed to save application.")
            }
        }
    }

    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>
            <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Find Jobs</h1>
            <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>
                💡 Include job type in your search e.g. "werkstudent python"
            </p>

            {/* Search Card */}
            <div style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
            }}>
                <input onChange={(e) => setQuery(e.target.value)} placeholder="e.g. werkstudent python" />
                <input onChange={(e) => setLocation(e.target.value)} placeholder="Location e.g. Berlin" />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Match Result */}
            {matchResult && (
                <div style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #4f8ef7",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px"
                }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>
                        Match Result — {matchResult.jobTitle}
                    </h3>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <div style={{
                            backgroundColor: "#0f0f0f",
                            border: "1px solid #2a2a2a",
                            borderRadius: "10px",
                            padding: "16px 24px",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>MATCH SCORE</p>
                            <p style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: matchResult.match_score > 70 ? "#4ade80" : matchResult.match_score > 50 ? "#facc15" : "#f87171"
                            }}>
                                {matchResult.match_score}%
                            </p>
                        </div>
                        <div style={{ flex: 1 }}>
                            {matchResult["skill-analysis"]?.missing_skills?.length > 0 && (
                                <div style={{ marginBottom: "12px" }}>
                                    <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>MISSING SKILLS</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        {matchResult["skill-analysis"].missing_skills.map((skill, i) => (
                                            <span key={i} style={{
                                                backgroundColor: "#2a0000",
                                                border: "1px solid #f87171",
                                                color: "#f87171",
                                                borderRadius: "6px",
                                                padding: "3px 10px",
                                                fontSize: "12px"
                                            }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {matchResult["skill-analysis"]?.matching_skills?.length > 0 && (
                                <div>
                                    <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>MATCHING SKILLS</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        {matchResult["skill-analysis"].matching_skills.map((skill, i) => (
                                            <span key={i} style={{
                                                backgroundColor: "#002a00",
                                                border: "1px solid #4ade80",
                                                color: "#4ade80",
                                                borderRadius: "6px",
                                                padding: "3px 10px",
                                                fontSize: "12px"
                                            }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={() => setMatchResult(null)} style={{
                        backgroundColor: "transparent",
                        border: "1px solid #2a2a2a",
                        color: "#888", fontSize: "13px"
                    }}>Close</button>
                </div>
            )}

            {/* Cover Letter */}
            {coverLetter && (
                <div style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #a78bfa",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "16px" }}>Cover Letter — {coverLetter.jobTitle}</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(coverLetter.text)
                                    alert("Copied to clipboard!")
                                }}
                                style={{
                                    backgroundColor: "#2a2a2a",
                                    border: "1px solid #2a2a2a",
                                    color: "#e8e8e8",
                                    padding: "5px 12px", fontSize: "13px"
                                }}>Copy</button>
                            <button
                                onClick={() => setCoverLetter(null)}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid #2a2a2a",
                                    color: "#888", fontSize: "13px"
                                }}>Close</button>
                        </div>
                    </div>
                    <textarea
                        value={coverLetter.text}
                        onChange={(e) => setCoverLetter({ ...coverLetter, text: e.target.value })}
                        rows={20}
                        style={{
                            width: "100%",
                            backgroundColor: "#0f0f0f",
                            border: "1px solid #2a2a2a",
                            color: "#e8e8e8",
                            borderRadius: "8px",
                            padding: "16px",
                            fontSize: "14px",
                            lineHeight: "1.8",
                            resize: "vertical",
                            fontFamily: "inherit"
                        }}
                    />
                </div>
            )}

            {/* Interview Prep */}
            {interviewPrep && (
                <div style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #fb923c",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px" }}>Interview Prep — {interviewPrep.jobTitle}</h3>
                        <button
                            onClick={() => setInterviewPrep(null)}
                            style={{
                                backgroundColor: "transparent",
                                border: "1px solid #2a2a2a",
                                color: "#888", fontSize: "13px"
                            }}>Close</button>
                    </div>
                    {interviewPrep.questions.map((item, i) => (
                        <div key={i} style={{
                            backgroundColor: "#0f0f0f",
                            border: "1px solid #2a2a2a",
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "16px"
                        }}>
                            <p style={{
                                color: "#fb923c", fontSize: "13px",
                                marginBottom: "12px", fontWeight: "bold"
                            }}>{item.skill}</p>
                            {item.questions.map((q, j) => (
                                <p key={j} style={{
                                    color: "#e8e8e8", fontSize: "14px",
                                    marginBottom: "8px", paddingLeft: "12px",
                                    borderLeft: "2px solid #2a2a2a"
                                }}>{j + 1}. {q}</p>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Job Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {filteredJobs.length === 0 && jobs.length > 0 ? (
                    <p style={{ color: "#888" }}>No matching jobs found. Try different search terms.</p>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job.slug} style={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "10px",
                            padding: "20px 24px"
                        }}>
                            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{job.title}</h3>
                            <p style={{ color: "#888", fontSize: "14px", marginBottom: "12px" }}>
                                {job.company_name} — {job.location}
                            </p>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <a href={job.url} target="_blank" rel="noreferrer" style={{
                                    fontSize: "13px", color: "#4f8ef7",
                                    border: "1px solid #4f8ef7",
                                    padding: "5px 12px", borderRadius: "6px"
                                }}>View Job →</a>
                                <button
                                    onClick={() => handleMatchCV(job)}
                                    disabled={matchingJob === job.slug}
                                    style={{
                                        backgroundColor: "#2a2a2a", color: "#e8e8e8",
                                        border: "1px solid #2a2a2a",
                                        padding: "5px 12px", fontSize: "13px",
                                        opacity: matchingJob === job.slug ? 0.6 : 1
                                    }}>
                                    {matchingJob === job.slug ? "Matching..." : "Match CV"}
                                </button>
                                <button
                                    onClick={() => handleCoverLetter(job)}
                                    disabled={generatingLetter === job.slug}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid #a78bfa",
                                        color: "#a78bfa",
                                        padding: "5px 12px", fontSize: "13px",
                                        opacity: generatingLetter === job.slug ? 0.6 : 1
                                    }}>
                                    {generatingLetter === job.slug ? "Generating..." : "Cover Letter"}
                                </button>
                                <button
                                    onClick={() => handleInterviewPrep(job)}
                                    disabled={generatingPrep === job.slug}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid #fb923c",
                                        color: "#fb923c",
                                        padding: "5px 12px", fontSize: "13px",
                                        opacity: generatingPrep === job.slug ? 0.6 : 1
                                    }}>
                                    {generatingPrep === job.slug ? "Generating..." : "Interview Prep"}
                                </button>
                                <button
                                    onClick={() => handleSaveApplication(job)}
                                    style={{
                                        backgroundColor: "transparent", color: "#4ade80",
                                        border: "1px solid #4ade80",
                                        padding: "5px 12px", fontSize: "13px"
                                    }}>+ Track</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Jobs