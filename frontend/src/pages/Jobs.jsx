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
    <div>
        <p>💡 Tip: Include job type in your search e.g. "werkstudent python" or "junior data scientist"</p>
        <input onChange={(e) => setQuery(e.target.value)} placeholder="e.g. werkstudent python"/>
        <input onChange={(e) => setLocation(e.target.value)} placeholder="Location e.g. Berlin"/>
        <button onClick={handleSearch}>Search</button>
        {filteredJobs.length === 0 && jobs.length > 0 ? (
            <p>No matching jobs found. Try different search terms.</p>
        ) : (
            filteredJobs.map((job) => (
                <div key={job.slug}>
                    <h3>{job.title}</h3>
                    <p>{job.company_name} — {job.location}</p>
                </div>
            ))
        )}
    </div>
)
}

export default Jobs