import { useState } from "react";
import { searchJob } from "../api";

function Jobs(){
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [jobs, setJobs] = useState([])
    const [jobType, setJobType] = useState("")

    const handleSearch = async () => {
        const data = await searchJob(query, location)
        setJobs(data)
        // console.log(data.map(j => j.location))
    }

    const filteredJobs = jobs.filter(job => {
    const matchesLocation = location === "" || 
        job.location.toLowerCase().includes(location.toLowerCase())
    const matchesQuery = query === "" || 
        query.toLowerCase().split(" ").some(word => 
            job.title.toLowerCase().includes(word)
        )
    return matchesLocation && matchesQuery
})
    return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Find Jobs</h1>
        <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>
             Include job type in your search e.g. "werkstudent python"
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
            <input onChange={(e) => setQuery(e.target.value)} placeholder="e.g. werkstudent python"/>
            <input onChange={(e) => setLocation(e.target.value)} placeholder="Location e.g. Berlin"/>
            <button onClick={handleSearch}>Search</button>
        </div>

        {/* Results */}
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
                        <p style={{ color: "#888", fontSize: "14px" }}>{job.company_name} — {job.location}</p>
                        <a href={job.url} target="_blank" rel="noreferrer" style={{
                            display: "inline-block",
                            marginTop: "12px",
                            fontSize: "13px",
                            color: "#4f8ef7"
                        }}>View Job →</a>
                    </div>
                ))
            )}
        </div>
    </div>
)
}

export default Jobs